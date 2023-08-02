import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { Channel, getChannelFromURL, getChannelText, getChannelURL } from '../../enums/channel';
import { Graph, getGraphFromURL, getGraphText, getGraphURL } from '../../enums/graph';
import { Type, getTypeFromURL, getTypeText, getTypeURL } from '../../enums/type';
import { collection, where, query, onSnapshot } from "firebase/firestore"
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
import { Bar, Line } from 'react-chartjs-2';
import { db } from '../../firebase';
import "./index.scss";

const channels = [Channel.Channel1, Channel.Channel2];
const graphs = [Graph.BarGraph, Graph.LineGraph];
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
    const { channel, graph, type } = useParams();
    const [currentChannel, setCurrentChannel] = useState(channels[0]);
    const [currentGraph, setCurrentGraph] = useState(graphs[0]);
    const [currentType, setCurrentType] = useState(types[0]);
    const [data, setData] = useState<any>({
        labels: [],
        datasets: [
            {
                label: 'Dataset',
                data: [],
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    });

    useEffect(() => {
        if (channel === undefined || graph === undefined || type === undefined) {
            navigate(`/graph/${getChannelURL(channels[0])}/${getGraphURL(graphs[0])}/${getTypeURL(types[0])}`)
        } else {
            setCurrentChannel(getChannelFromURL(channel));
            setCurrentGraph(getGraphFromURL(graph));
            setCurrentType(getTypeFromURL(type));
        }
    }, [channel, graph, type, navigate, setCurrentChannel, setCurrentGraph, setCurrentType]);

    useEffect(() => {
        var collectionName = currentChannel === channels[0] ? "data1" : "data2";
        var d = new Date();
        // @ts-ignore
        var date = new Date(new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0) - 6 * 24 * 60 * 60 * 1000) / 1000;
        const q = query(collection(db, collectionName), where('time', ">", date));

        var isAverage = false;
        if (currentType === Type.Voltage || currentType === Type.Frequency || currentType === Type.PowerFactor)
            isAverage = true;

        const unsubscribe = onSnapshot(q, async querySnapshot => {
            var tempData = [], count: number[] = [];
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

            var labels: string[] = [];
            for (let i = 0; i < 7; i++)
                labels.push(new Date((date + i * 24 * 60 * 60) * 1000).toDateString());
            if (isAverage)
                setData({
                    labels,
                    datasets: [{
                        label: 'Dataset',
                        data: tempData.map((val, indx) => Math.round(val * 100 / count[indx]) / 100),
                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    }],
                });
            else
                setData({
                    labels,
                    datasets: [{
                        label: 'Dataset',
                        data: tempData,
                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    }],
                });
        });
        return () => unsubscribe();
    }, [currentChannel, currentGraph, currentType, setData]);

    return (
        <div className="graphMain">
            <div className="graph">
                {currentGraph === Graph.BarGraph ?
                    <Bar options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top' as const,
                            },
                            title: {
                                display: true,
                                text: 'Bar Chart',
                            },
                        },
                    }} data={data} width={400} height={400} />
                    : <Line options={{
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
                    }} data={data} width={400} height={400} />}
            </div>
            <div className="graphChip">
                <Stack direction="row" spacing={1} className='graphStack'>
                    {channels.map(ch => {
                        var func = () => {
                            navigate(`/graph/${getChannelURL(ch)}/${getGraphURL(currentGraph)}/${getTypeURL(currentType)}`);
                        }
                        if (ch === currentChannel)
                            return <Chip key={getChannelText(ch)} label={getChannelText(ch)} onClick={func} />;
                        else
                            return <Chip key={getChannelText(ch)} label={getChannelText(ch)} variant="outlined" onClick={func} />;
                    })}
                </Stack>
                <Stack direction="row" spacing={1} className='graphStack'>
                    {graphs.map(graph => {
                        var func = () => {
                            navigate(`/graph/${getChannelURL(currentChannel)}/${getGraphURL(graph)}/${getTypeURL(currentType)}`);
                        }
                        if (graph === currentGraph)
                            return <Chip key={getGraphText(graph)} label={getGraphText(graph)} onClick={func} />;
                        else
                            return <Chip key={getGraphText(graph)} label={getGraphText(graph)} variant="outlined" onClick={func} />;
                    })}
                </Stack>
                <Stack direction="row" spacing={1} className='graphStack'>
                    {types.map(type => {
                        var func = () => {
                            navigate(`/graph/${getChannelURL(currentChannel)}/${getGraphURL(currentGraph)}/${getTypeURL(type)}`);
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


