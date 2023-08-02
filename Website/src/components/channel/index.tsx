import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { Type, getTypeFromURL, getTypeText, getTypeURL } from '../../enums/type';
import { collection, where, query, onSnapshot, Unsubscribe } from "firebase/firestore"
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { db } from '../../firebase';
import "./index.scss";

const types = [Type.Voltage, Type.Current, Type.Power, Type.Energy, Type.Frequency, Type.PowerFactor];

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

export default function Index() {
    const navigate = useNavigate();
    const { type } = useParams();
    const [currentType, setCurrentType] = useState(types[0]);
    const [data, setData] = useState([0, 0]);

    useEffect(() => {
        if (type === undefined) {
            navigate(`/channel/${getTypeURL(types[0])}`)
        } else {
            setCurrentType(getTypeFromURL(type));
        }
    }, [type, navigate, setCurrentType]);

    useEffect(() => {
        var collectionName = ["data1", "data2"];
        var d = new Date();
        // @ts-ignore
        var date = new Date(new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0) - 6 * 24 * 60 * 60 * 1000) / 1000;

        var isAverage = false;
        if (currentType === Type.Voltage || currentType === Type.Frequency || currentType === Type.PowerFactor)
            isAverage = true;

        var unsubscribers: Array<Unsubscribe> = []
        for (var i = 0; i < collectionName.length; i++) {
            const ith = i;
            const q = query(collection(db, collectionName[i]), where('time', ">", date));
            const unsubscribe = onSnapshot(q, async querySnapshot => {
                var tempData = 0, count = 0;

                for (let doc of querySnapshot.docs) {
                    let d = doc.data();

                    if (currentType === Type.Voltage)
                        tempData += d.voltage;
                    else if (currentType === Type.Current)
                        tempData += d.current;
                    else if (currentType === Type.Power)
                        tempData += d.power;
                    else if (currentType === Type.Energy)
                        tempData += d.energy;
                    else if (currentType === Type.Frequency)
                        tempData += d.frequency;
                    else if (currentType === Type.PowerFactor)
                        tempData += d.pf;
                    count++;
                }

                if (isAverage)
                    setData(data => data.map((el, ind) => ind !== ith ? el : Math.round(tempData * 100 / count) / 100));
                else
                    setData(data => data.map((el, ind) => ind !== ith ? el : tempData));
            });
            unsubscribers.push(unsubscribe);
        }
        return () => unsubscribers.forEach(unsubscribe => unsubscribe());
    }, [currentType, setData]);

    return (
        <div className="channelMain">
            <div className="channel">
                <Pie data={{
                    labels: ['Channel 1', 'Channel 2'],
                    datasets: [
                        {
                            label: '# ',
                            data: data,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                            ],
                            borderWidth: 1,
                        },
                    ],
                }} width={400} height={400} />
            </div>
            <div className="channelChip">
                <Stack direction="row" spacing={1} className='channelStack'>
                    {types.map(type => {
                        var func = () => {
                            navigate(`/channel/${getTypeURL(type)}`);
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


