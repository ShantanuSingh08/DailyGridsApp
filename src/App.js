import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import notificationSound from './assets/notification.wav';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";




import Sidebar from './Sidebar';
import PomodoroTimer from './PomodoroTimer';
import StudyPlanner from './StudyPlanner';
import Whiteboard from './Whiteboard';
import HomePage from './HomePage';
import Notes from './Notes';
import Account from './Account';
import Stats from './Stats';
import Dashboard from './Dashboard';
import SubscriptionPage from './SubscriptionPage';
import PaymentPage from './PaymentPage';

import { RippleProvider } from './RippleContext';

import bg1 from './assets/bg1.jpg';
import bg2 from './assets/bg2.jpg';
import bg3 from './assets/bg3.jpg';
import bg4 from './assets/bg4.jpg';
import bg5 from './assets/bg5.jpg';
import bg6 from './assets/bg6.jpg';
import bg7 from './assets/bg7.jpg';
import bg8 from './assets/bg8.jpg';
import bg9 from './assets/bg9.jpg';
import bg10 from './assets/bg10.jpg';


function App() {
  const [selectedBg, setSelectedBg] = useState(bg1);
  const [events, setEvents] = useState([]);
  const userId = localStorage.getItem('userId');
  const notification = new Audio(notificationSound);

  const initialOptions = {
    "client-id": "Aasv0BWvuh2R2LNm5wFTQw0PROfLYbC8V6OZeLFDAJj5NiJafwIiQvy9J4z8HLhDL3EXlr5p6u_lewlX",
    "vault": true,
    "intent": "subscription",
  };

  const backgroundImages = {
    bg1: bg1,
    bg2: bg2,
    bg3: bg3,
    bg4: bg4,
    bg5: bg5,
    bg6: bg6,
    bg7: bg7,
    bg8: bg8,
    bg9: bg9,
    bg10: bg10,
  };

  const handleBackgroundChange = (bgKey) => {
    setSelectedBg(backgroundImages[bgKey]);
  };

  //Appointment Reminder
  useEffect(() => {
    document.title = "Daily Grids"; 

    const fetchEvents = async () => {
      try {
        const response = await fetch(`https://studyplanner1.onrender.com/api/events/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
    
        localStorage.setItem('events', JSON.stringify(data));
        
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
    const checkForUpcomingEvents = () => {
      const now = new Date();
      events.forEach((event) => {
        const eventStart = new Date(event.start);
        const diff = eventStart - now;
        console.log(`Checking event "${event.title}" - Starts in ${diff / 60000} minutes`);

        if (diff > 0 && diff <= 600000) { 
          alert(`Reminder: Your Appointment "${event.title}" is about to start!`);
          notification.play();
        }
      });
    };
    const interval = setInterval(checkForUpcomingEvents, 600000); 
    return () => clearInterval(interval);
  }, [events]);



  return (
    <PayPalScriptProvider options={initialOptions}>

    <RippleProvider>
      <BrowserRouter>
        <div className="content">
          <div className="App">
            <Sidebar />
            <Routes>
              <Route path="/" element={<HomePage bgImage={selectedBg} onBackgroundChange={handleBackgroundChange} />} />
              <Route path="/timer" element={<PomodoroTimer bgImage={selectedBg} />} />
              <Route path="/planner" element={<StudyPlanner bgImage={selectedBg} />} />
              <Route path="/whiteboard" element={<Whiteboard bgImage={selectedBg} />} />
              <Route path="/notes" element={<Notes bgImage={selectedBg} />} />
              <Route path="/account" element={<Account bgImage={selectedBg} />} />
              <Route path="/dashboard" element={<Dashboard bgImage={selectedBg} />} />
              <Route path="/stats" element={<Stats bgImage={selectedBg} />} />
              <Route path="/subscribe" element={<SubscriptionPage bgImage={selectedBg}/>} />
              <Route path="/payment" element={<PaymentPage bgImage={selectedBg}/>} />

            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </RippleProvider>
    </PayPalScriptProvider>

  );
}

export default App;
