import image from './../../assets/electricity.png'
import "./index.scss";

export default function Index() {
    return (
        <div>
            <div>
                <img src={image} className='container' alt="srcImage" />
                <div className="centered">IOT-Based Electrical Load Parameters Monitoring System</div>
            </div>
            <div className='homePageContents'>
                <div className='graphInfo'>
                    <div className='homePageContentTitle'>Graph and Channel</div>
                    <div>• You can compare your bills with previous data on weekly and monthly basis</div>
                    <div>• Can validate the power Quality</div>
                    <div>• Data regarding to electrical parameters like frequency, powerfactor, voltage, current are available</div>
                    <div>• Can compare consumption with 2 different channels</div>
                </div>
                <div className='solarInfo'>
                    <div className='homePageContentTitle'>Solar</div>
                    <div>• Enter the available roof area to install solar panel</div>
                    <div>• Get the accommodative no of solar panels</div>
                    <div>• Solar generation capacity and other investment related things</div>
                    <div>• By using the collected data so far, it will advise whether to install or not.</div>
                </div>
            </div>
        </div>
    )
}