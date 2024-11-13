import React, { useState, useEffect } from 'react';
import './PomodoroTimer.css';
import WaterWave from 'react-water-wave';
import { useRipple } from './RippleContext';
import notificationSound from './assets/notification.wav';

const PomodoroTimer = ({ bgImage }) => {
  const { isRippleEnabled } = useRipple();
  const [focusTime, setFocusTime] = useState(25);
  const [seconds, setSeconds] = useState(focusTime * 60);
  const [isActive, setIsActive] = useState(false);
  const [inputValue, setInputValue] = useState(focusTime);
  const [isSessionCompleted, setIsSessionCompleted] = useState(false);
  const notification = new Audio(notificationSound);
  const userId = localStorage.getItem('userId');
  
  useEffect(() => {
    let timer = null;
    if (isActive && seconds > 0) {
      timer = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0 && !isSessionCompleted) {
      setIsSessionCompleted(true);
      const timeInSeconds = focusTime * 60;
      saveFocusTime(timeInSeconds);
      setIsActive(false);
      notification.play();
    }
    return () => clearInterval(timer);
  }, [isActive, seconds, isSessionCompleted]);

  const saveFocusTime = (timeInSeconds) => {
    // Save to local storage
    const today = new Date().toISOString().slice(0, 10);
    const storedData = JSON.parse(localStorage.getItem('focusTimeData')) || {};
    storedData[today] = (storedData[today] || 0) + timeInSeconds;
    localStorage.setItem('focusTimeData', JSON.stringify(storedData));
    console.log(storedData);
  
    // Save to database
    const saveFocusTimeToDatabase = async (userId, storedData) => {
      try {
        const response = await fetch('https://studyplanner1.onrender.com/api/focus-time', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId, 
            focusTimeData: storedData, 
          }),
        });
  
        const data = await response.json();
        console.log('Focus time saved to database:', data);
      } catch (error) {
        console.error('Error saving focus time to database:', error);
      }
    };
    
    saveFocusTimeToDatabase(userId, storedData);
  };
 

  const handleStart = () => {
    setIsActive(true);
    setIsSessionCompleted(false);
  };

  const handlePause = () => setIsActive(false);

  const handleReset = () => {
    setIsActive(false);
    setSeconds(focusTime * 60);
    setIsSessionCompleted(false);
  };

  const handleInputChange = (e) => setInputValue(e.target.value);

  const handleSetFocusTime = () => {
    const newFocusTime = parseInt(inputValue, 10);
    if (!isNaN(newFocusTime) && newFocusTime > 0) {
      setFocusTime(newFocusTime);
      setSeconds(newFocusTime * 60);
      setInputValue(newFocusTime);
    }
  };

  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <>
      {isRippleEnabled ? (
        <WaterWave imageUrl={bgImage} style={{ width: '100%', height: '100%', backgroundSize: 'cover' }}>
          {() => (
            <div className="pomodoro-timer">
              <div className="pomodoro-timer-content">
                <h2>Timer</h2>
                <div className="timer-display">
                  <h1>{formatTime(seconds)}</h1>
                </div>
                <div className="timer-controls">
                  <button onClick={handleStart} disabled={isActive}>Start</button>
                  <button onClick={handlePause} disabled={!isActive}>Pause</button>
                  <button onClick={handleReset}>Reset</button>
                </div>
                <div className="time-settings">
                  <input type="number" value={inputValue} onChange={handleInputChange} min="1" step="1" />
                  <button onClick={handleSetFocusTime}>Set Focus Time</button>
                </div>
              </div>
            </div>
          )}
        </WaterWave>
      ) : (
        <div
          className="pomodoro-timer"
          style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', width: '100%', height: '100%' }}
        >
          <div className="pomodoro-timer-content">
            <h2>Timer</h2>
            <div className="timer-display">
              <h1>{formatTime(seconds)}</h1>
            </div>
            <div className="timer-controls">
              <button onClick={handleStart} disabled={isActive}>Start</button>
              <button onClick={handlePause} disabled={!isActive}>Pause</button>
              <button onClick={handleReset}>Reset</button>
            </div>
            <div className="time-settings">
              <input type="number" value={inputValue} onChange={handleInputChange} min="1" step="1" />
              <button onClick={handleSetFocusTime}>Set Focus Time</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PomodoroTimer;
