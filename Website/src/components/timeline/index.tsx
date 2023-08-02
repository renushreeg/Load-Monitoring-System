import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { Type, getTypeFromURL, getTypeText, getTypeURL } from '../../enums/type';
import { collection, where, query, onSnapshot, Unsubscribe } from "firebase/firestore"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { db } from '../../firebase';
import "./index.scss";

const types = [Type.Voltage, Type.Current, Type.Power, Type.Energy, Type.Frequency, Type.PowerFactor];

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
);

export default function Index() {
    const navigate = useNavigate();
    const { type } = useParams();
    const [currentType, setCurrentType] = useState(types[0]);
    const [labels, setLabels] = useState(["", "", "", "", "", "", ""]);
    const [data, setData] = useState([[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]]);

    useEffect(() => {
        if (type === undefined) {
            navigate(`/timeline/${getTypeURL(types[0])}`)
        } else {
            setCurrentType(getTypeFromURL(type));
        }
    }, [type, navigate, setCurrentType]);

    useEffect(() => {
        var collectionName = ["data1", "data2"];
        var d = new Date();
        // @ts-ignore
        var date = new Date(new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0) - 6 * 24 * 60 * 60 * 1000) / 1000;
        var labels: string[] = [];
        for (let i = 0; i < 7; i++)
            labels.push(new Date((date + i * 24 * 60 * 60) * 1000).toDateString());
        setLabels(labels);

        var isAverage = false;
        if (currentType === Type.Voltage || currentType === Type.Frequency || currentType === Type.PowerFactor)
            isAverage = true;

        var unsubscribers: Array<Unsubscribe> = []
        for (var i = 0; i < collectionName.length; i++) {
            const ith = i;
            const q = query(collection(db, collectionName[i]), where('time', ">", date));
            const unsubscribe = onSnapshot(q, async querySnapshot => {
                var tempData: number[] = [], count: number[] = [];
                for (var i = 0; i < 7; i++) {
                    tempData.push(0);
                    count.push(0);
                }

                for (let doc of querySnapshot.docs) {
                    let d = doc.data();

                    var index = Math.floor((d.time - date) / (24 * 60 * 60));
                    if (currentType === Type.Voltage)
                        tempData[index] += d.voltage;
                    else if (currentType === Type.Current)
                        tempData[index] += d.current;
                    else if (currentType === Type.Power)
                        tempData[index] += d.power;
                    else if (currentType === Type.Energy)
                        tempData[index] += d.energy;
                    else if (currentType === Type.Frequency)
                        tempData[index] += d.frequency;
                    else if (currentType === Type.PowerFactor)
                        tempData[index] += d.pf;
                    count[index]++;
                }

                if (isAverage)
                    setData(data => data.map((el, ind) => ind !== ith ? el : tempData.map((val,indx) => Math.round(val * 100 / count[indx]) / 100)));
                else
                    setData(data => data.map((el, ind) => ind !== ith ? el : tempData));
            });
            unsubscribers.push(unsubscribe);
        }
        return () => unsubscribers.forEach(unsubscribe => unsubscribe());
    }, [currentType, setData, setLabels]);

    return (
        <div className="timelineMain">
            <div className="timeline">
                <Line options={{
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top' as const,
                        },
                        title: {
                            display: true,
                            text: 'Line Chart',
                        },
                    },
                }} data={{
                    labels,
                    datasets: [{
                        label: 'Channel 1',
                        data: data[0],
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    }, {
                        label: 'Channel 2',
                        data: data[1],
                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    }],
                }} width={400} height={400} />
            </div>
            <div className="timelineChip">
                <Stack direction="row" spacing={1} className='timelineStack'>
                    {types.map(type => {
                        var func = () => {
                            navigate(`/timeline/${getTypeURL(type)}`);
                        }
                        if (type === currentType)
                            return <Chip key={getTypeText(type)} label={getTypeText(type)} onClick={func} />;
                        else
                            return <Chip key={getTypeText(type)} label={getTypeText(type)} variant="outlined" onClick={func} />;
                    })}
                </Stack>
            </div>
        </div>
    )
}


