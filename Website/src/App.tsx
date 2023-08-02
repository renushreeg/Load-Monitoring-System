// @ts-nocheck 
import { useState, useEffect } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import Solar from './components/solar';
import Home from './components/home';
import Graph from './components/graph';
import Channel from './components/channel';
import Timeline from './components/timeline';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import WifiChannelIcon from '@mui/icons-material/WifiChannel';
import TimelineIcon from '@mui/icons-material/Timeline';
import SolarPowerIcon from '@mui/icons-material/SolarPower';
import './App.scss';

function App() {
  const [bottomValue, setBottomValue] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith('/solar')) {
      setBottomValue(4);
    }
    else if (location.pathname.startsWith('/timeline')) {
      setBottomValue(3);
    }
    else if (location.pathname.startsWith('/channel')) {
      setBottomValue(2);
    }
    else if (location.pathname.startsWith('/graph')) {
      setBottomValue(1);
    }
    else {
      setBottomValue(0);
    }
  }, [location, setBottomValue]);

  return (
    <div className='app'>
      <div className='appMain'>
        <SwitchTransition className="transition" mode="out-in">
          <CSSTransition
            key={location.key}
            timeout={450}
            classNames="fade"
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/graph" element={<Graph />} />
              <Route path="/graph/:channel/:graph/:type" element={<Graph />} />
              <Route path="/channel" element={<Channel />} />
              <Route path="/channel/:type" element={<Channel />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/timeline/:type" element={<Timeline />} />
              <Route path="/solar" element={<Solar />} />
            </Routes>
          </CSSTransition>
        </SwitchTransition>
      </div>
      <div className='bottomBar'>
        <Box>
          <BottomNavigation
            showLabels
            value={bottomValue}
            onChange={(event, newValue) => {
              switch (newValue) {
                case 0:
                  navigate('/');
                  break;
                case 1:
                  navigate('/graph');
                  break;
                case 2:
                  navigate('/channel');
                  break;
                case 3:
                  navigate('/timeline');
                  break;
                case 4:
                  navigate('/solar');
                  break;
              }
            }}
          >
            <BottomNavigationAction label="Home" icon={<HomeIcon />} />
            <BottomNavigationAction label="Graph" icon={<EqualizerIcon />} />
            <BottomNavigationAction label="Channel" icon={<WifiChannelIcon />} />
            <BottomNavigationAction label="Timeline" icon={<TimelineIcon />} />
            <BottomNavigationAction label="Solar" icon={<SolarPowerIcon />} />
          </BottomNavigation>
        </Box>
      </div>
    </div>
  );
}

export default App;
