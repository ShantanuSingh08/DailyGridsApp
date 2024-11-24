import React, { useState, useEffect } from 'react';
import './HomePage.css';
import WaterWave from 'react-water-wave';
import { useRipple } from './RippleContext'; 
import { MdAccountCircle } from "react-icons/md";
import rainandthunder from './assets/rainandthunder.mp3';
import rainandthunderpiano from './assets/rainandthunderpiano.mp3';
import rainmind from './assets/rainmind.mp3';
import { HiOutlineSpeakerWave } from "react-icons/hi2";
import { HiOutlineSpeakerXMark } from "react-icons/hi2";
import { useNavigate } from 'react-router-dom';
import { PiCrownSimpleBold } from "react-icons/pi";





const HomePage = ({ bgImage, onBackgroundChange }) => {
  const navigate = useNavigate(); 
  const { isRippleEnabled, setIsRippleEnabled } = useRipple(); 
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [audio, setAudio] = useState(null); 
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [selectedSound, setSelectedSound] = useState('');
  const [volume] = useState(0.5);
  

  const backgrounds = [
    { id: 1, label: 'Background 1', value: 'bg1' },
    { id: 2, label: 'Background 2', value: 'bg2' }, 
    { id: 3, label: 'Background 3', value: 'bg3' },
    { id: 4, label: 'Background 4', value: 'bg4' },
    { id: 5, label: 'Background 5', value: 'bg5' },
    { id: 6, label: 'Background 6', value: 'bg6' },
    { id: 7, label: 'Background 7', value: 'bg7' },
    { id: 8, label: 'Background 8', value: 'bg8' },
    { id: 9, label: 'Background 9', value: 'bg9' },
    { id: 10, label: 'Background 10', value: 'bg10' },
  ];


  const sounds = [
    { label: 'Rain and Thunder', value: rainandthunder },
    { label: 'Rain and Thunder Piano', value: rainandthunderpiano },
    { label: 'Rain Mind', value: rainmind },
  ];

  const handleZenModeToggle = (enabled) => {
    setIsRippleEnabled(enabled);
    if (enabled) {
      const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
      setSelectedSound(randomSound.value);
      playSound(randomSound.value);
    } else {
      stopSound();
    }
  };

  const playSound = (sound) => {
    if (audio) {
      audio.pause();
    }
    if (sound) {
      const newAudio = new Audio(sound);
      newAudio.loop = true;
      newAudio.volume = volume;
      newAudio.play();
      setAudio(newAudio);
      setIsPlayingSound(true);
    }
  };

  const stopSound = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlayingSound(false);
    }
  };
  const toggleMute = () => {
    if (isPlayingSound) {
      stopSound();
    } else {
      playSound(selectedSound);
    }
  };


    const handleClick = () => {
      navigate('/subscribe'); 
    };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {isRippleEnabled ? (
        <WaterWave
          imageUrl={bgImage}
          style={{ width: '100%', height: '100%', backgroundSize: 'cover' }}
        >
          {({ pause, play }) => (
            <div className="container">
              <div className='Header'>Welcome to Daily Grids</div>
              <div className="clock">{currentTime}</div>
              <div className="settings-container">
                <div className="background-selector">
                  <h3>Select a Background:</h3>
                  <select
                    className="custom-dropdown"
                    onChange={(e) => onBackgroundChange(e.target.value)}
                  >
                    {backgrounds.map((bg) => (
                      <option key={bg.id} value={bg.value}>
                        {bg.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="ripple-selector">
                  <h3> Toggle Zen Mode:</h3>
                  <select
                    className="custom-dropdown"
                    onChange={(e) => handleZenModeToggle(e.target.value === 'true')}
                    value={isRippleEnabled ? 'true' : 'false'}
                  >
                    <option value="true">On</option>
                    <option value="false">Off</option>
                  </select>

                 </div>
              </div>
              <div>
                <button className="Mute" onClick={toggleMute}>
                      {isPlayingSound ? <HiOutlineSpeakerWave /> : <HiOutlineSpeakerXMark />}
                      </button>                       
                      </div>
            </div>
          )}
        </WaterWave>
      ) : (
        <div className="container" style={{ width: '100%', height: '100%', backgroundSize: 'cover', backgroundImage: `url(${bgImage})` }}>
              <div className='Header'>Welcome to Daily Grids</div> 
              <div className="clock">{currentTime}</div>
              <div className="settings-container">
                <div className="background-selector">
                  <h3>Select a Background:</h3>
                  <select
                    className="custom-dropdown"
                    onChange={(e) => onBackgroundChange(e.target.value)}
                  >
                    {backgrounds.map((bg) => (
                      <option key={bg.id} value={bg.value}>
                        {bg.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="ripple-selector">
                  <h3> Toggle Zen Mode:</h3>
                  <select
                    className="custom-dropdown"
                    onChange={(e) => handleZenModeToggle(e.target.value === 'true')}
                    value={isRippleEnabled ? 'true' : 'false'}
                  >
                    <option value="true">On</option>
                    <option value="false">Off</option>
                  </select>

                   </div>


              </div>
              
            </div>
      )}
    </>
  );
};

export default HomePage;
