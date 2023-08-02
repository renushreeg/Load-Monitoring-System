import { useState, useEffect } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import Input from '@mui/material/Input';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { collection, where, query, onSnapshot } from "firebase/firestore"
import { db } from '../../firebase';
import "./index.scss";

export default function Index() {
    var [display, setDisplay] = useState(0);
    var [disclaimerDisplay, setDisclaimerDisplay] = useState(false);
    var [area, setArea] = useState(0);
    var [noSolarPanels, setNoSolarPanels] = useState(0);
    var [solarGeneration, setSolarGeneration] = useState(0);
    var [totalCapitalCost, setTotalCapitalCost] = useState(0);
    var [subsidy, setSubsidy] = useState(0);
    var [consumerInvestment, setConsumerInvestment] = useState(0);
    var [totalPowerUsage1, setTotalPowerUsage1] = useState(0);
    var [totalPowerUsage2, setTotalPowerUsage2] = useState(0);

    useEffect(() => {
        var d = new Date();
        // @ts-ignore
        var date = new Date(new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0) - 30 * 24 * 60 * 60 * 1000) / 1000;
        const q = query(collection(db, "data1"), where('time', ">", date));
        const unsubscribe = onSnapshot(q, async querySnapshot => {
            var totalUsage = 0;

            for (let doc of querySnapshot.docs) {
                let d = doc.data();

                totalUsage += d.power;
            }

            setTotalPowerUsage1(totalUsage);
        });
        return () => unsubscribe();
    }, [setTotalPowerUsage1]);

    useEffect(() => {
        var d = new Date();
        // @ts-ignore
        var date = new Date(new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0) - 30 * 24 * 60 * 60 * 1000) / 1000;
        const q = query(collection(db, "data2"), where('time', ">", date));
        const unsubscribe = onSnapshot(q, async querySnapshot => {
            var totalUsage = 0;

            for (let doc of querySnapshot.docs) {
                let d = doc.data();

                totalUsage += d.power;
            }

            setTotalPowerUsage2(totalUsage);
        });
        return () => unsubscribe();
    }, [setTotalPowerUsage2]);


    const displayResults = () => {
        setDisplay(1);
        setDisclaimerDisplay(true);

        if (area < 60) {
            setDisplay(2);
            setDisclaimerDisplay(false);
        } else if (area <= 90) {
            setNoSolarPanels(5);
            setSolarGeneration(1);
            setTotalCapitalCost(54000);
            setSubsidy(21600);
            setConsumerInvestment(32400);
        } else if (area <= 180) {
            setNoSolarPanels(6);
            setSolarGeneration(2);
            setTotalCapitalCost(10800);
            setSubsidy(43200);
            setConsumerInvestment(64800);
        } else if (area <= 270) {
            setNoSolarPanels(9);
            setSolarGeneration(3);
            setTotalCapitalCost(162000);
            setSubsidy(64800);
            setConsumerInvestment(97200);
        } else if (area <= 320) {
            setNoSolarPanels(10);
            setSolarGeneration(4);
            setTotalCapitalCost(216000);
            setSubsidy(75600);
            setConsumerInvestment(140400);
        } else if (area <= 450) {
            setNoSolarPanels(12);
            setSolarGeneration(5);
            setTotalCapitalCost(270000);
            setSubsidy(86400);
            setConsumerInvestment(183600);
        } else if (area <= 500) {
            setNoSolarPanels(17);
            setSolarGeneration(6);
            setTotalCapitalCost(324000);
            setSubsidy(97200);
            setConsumerInvestment(226800);
        } else if (area <= 600) {
            setNoSolarPanels(20);
            setSolarGeneration(7);
            setTotalCapitalCost(378000);
            setSubsidy(108000);
            setConsumerInvestment(270000);
        } else if (area <= 700) {
            setNoSolarPanels(25);
            setSolarGeneration(8);
            setTotalCapitalCost(432000);
            setSubsidy(118800);
            setConsumerInvestment(313200);
        } else if (area <= 800) {
            setNoSolarPanels(40);
            setSolarGeneration(9);
            setTotalCapitalCost(486000);
            setSubsidy(129600);
            setConsumerInvestment(356400);
        } else if (area <= 900) {
            setNoSolarPanels(50);
            setSolarGeneration(10);
            setTotalCapitalCost(540000);
            setSubsidy(140400);
            setConsumerInvestment(399600);
        }
    }

    return (
        <div className='solarPage'>
            <div className='solarPageTitle'>Integration of Solar Panels</div>
            <div className='solarPageContent'>
                <div>
                    Enter the available area to install the solar panels
                    <FormControl variant="standard" sx={{ m: 1, mt: 3, width: '25ch' }} className='solarPageAreaInput'>
                        <Input
                            required
                            id="standard-adornment-weight"
                            endAdornment={<InputAdornment position="end">sq.ft</InputAdornment>}
                            aria-describedby="standard-weight-helper-text"
                            inputProps={{
                                'aria-label': 'weight',
                            }}
                            onChange={(e) => {
                                setArea(Number(e.target.value))
                            }}
                        />
                    </FormControl>
                    <IconButton aria-label="add to shopping cart" sx={{ color: "white", backgroundColor: "#1976D2", borderRadius: 1, }} className='solarPageGoButton' >
                        <ArrowForwardIcon style={{ fontSize: 20 }} onClick={displayResults} />
                    </IconButton>
                </div>
                <div>Total monthly power Usage Channel1: {(totalPowerUsage1 / 1000).toFixed(2)}W</div>
                <div>Total monthly power Usage Channel2: {(totalPowerUsage2 / 1000).toFixed(2)}W</div>
                {display === 2 ?
                    <div className='solarPageResults'>Area not sufficient</div> :
                    <div>
                        {display === 1 ? <div>
                            <div className='solarPageResults'>
                                <div className='solarPageKey'>
                                    <div>No of Solar Panels required : </div>
                                    <div>Solar Generation Capacity : </div>
                                    <div>Total capital cost : </div>
                                    <div>Subsidy from MNRE : </div>
                                    <div>Consumer investment : </div>
                                </div>
                                <div className='solarPageValue'>
                                    <div>{noSolarPanels} panels</div>
                                    <div>{solarGeneration} kW</div>
                                    <div>₹ {totalCapitalCost}</div>
                                    <div>₹ {subsidy}</div>
                                    <div>₹ {consumerInvestment}</div>
                                </div>
                            </div>
                            <div className='solarPageInfo'>
                                {solarGeneration < (totalPowerUsage1 + totalPowerUsage2) / 1000 ? <div>Your total usage per month is {((totalPowerUsage1 + totalPowerUsage2) / 1000).toFixed(2)}kW. Hence, Area is not sufficient to suffice your home needs fully.</div> :
                                    <div>Your total usage per month is {((totalPowerUsage1 + totalPowerUsage2) / 1000).toFixed(2)}kW. Hence, You can generate {(solarGeneration - ((totalPowerUsage1 + totalPowerUsage2) / 1000)).toFixed(2)} kW extra and supply it back to grid.</div>}
                            </div>
                        </div> : <div></div>}
                    </div>
                }
                {disclaimerDisplay &&
                    <div className='solarPageDiscalimer'>Disclaimer: This data is only for Individual Residential consumers</div>}
            </div>
        </div>
    );
}
