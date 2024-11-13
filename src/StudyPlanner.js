import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Select from 'react-select'; 
import './StudyPlanner.css';
import WaterWave from 'react-water-wave';
import { useRipple } from './RippleContext';

// Generate time options (in 30-minute intervals)
const generateTimeOptions = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      times.push({ value: time, label: time });
    }
  }
  return times;
};

// Modal component for entering session details
const EventModal = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState(generateTimeOptions()[0]); 
  const [endTime, setEndTime] = useState(generateTimeOptions()[1]); 

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && startTime && endTime) {
      onSave({ title, startTime: startTime.value, endTime: endTime.value });
      onClose(); 
    }
  };

  if (!isOpen) return null; 

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <h2>Add Study Session</h2>
        <label>
          Name: &nbsp;
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <div className="time-input-start">
          <label>Start Time:</label>
          <Select
            options={generateTimeOptions()}
            value={startTime}
            onChange={setStartTime}
            required
          />
        </div>
        <div className="time-input-end">
          <label>End Time: </label>
          <Select
            options={generateTimeOptions()}
            value={endTime}
            onChange={setEndTime}
            required
          />
        </div>
        <button id='submit' type="submit">Save</button>
        <button id='cancel' type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

const generateEventId = (userId) => {
  const randomNumber = Math.floor(1000 + Math.random() * 9000); 
  return `${userId}${randomNumber}`;
};

  const StudyPlanner = ({ bgImage }) => {
  const userId = localStorage.getItem('userId');
  const { isRippleEnabled } = useRipple();
  const [events, setEvents] = useState(() => {
  const savedEvents = localStorage.getItem('studyEvents');
  return savedEvents ? JSON.parse(savedEvents) : [];
    
  });

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const fetchEvents = async () => {
    try {
      const response = await fetch(`https://studyplanner1.onrender.com/api/events/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
  
      // Save fetched events to localStorage
      localStorage.setItem('events', JSON.stringify(data));
      
      // Update state with the fetched events
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };
  

  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('studyEvents', JSON.stringify(events));
    fetchEvents();
  }, [events]);

  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr); 
    setModalOpen(true); 
  };

  const handleEventClick = (info) => {
    const eventId = info.event._def.extendedProps.eventId; 
    const confirmDelete = window.confirm(`Delete study session '${info.event.title}'?`);
    if (confirmDelete) {
      const filteredEvents = events.filter(event => event.eventId !== eventId);
      setEvents(filteredEvents);
      
      fetch(`https://studyplanner1.onrender.com/api/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(data => {
        if (data.message === "Event deleted successfully") {
          console.log("Event deleted successfully.");
        } else {
          alert("No internet connection found");
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('No internet connection found');
      });
    }
  };

  const handleSaveEvent = async ({ title, startTime, endTime }) => {
    const eventId = generateEventId(userId);
    const newEvent = {
      eventId: eventId,
      userId: userId,
      id: Date.now().toString(),
      title,
      start: `${selectedDate}T${startTime}:00`,
      end: `${selectedDate}T${endTime}:00`,
      color: '#FF5733',
      allDay: false,
    };
  
    try {
      const response = await fetch('https://studyplanner1.onrender.com/api/events/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      });
  
      const result = await response.json();
      if (result.success) {
        setEvents((prevEvents) => [...prevEvents, result.event]);
        console.log('Event saved successfully.');
      } 
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Error saving event, Please connect to Internet!!');
    }
  };
  

  return (
    <>
      {isRippleEnabled ? (
        <WaterWave
          imageUrl={bgImage}
          style={{ width: '100%', height: '100%', backgroundSize: 'cover' }}
        >
          {({ pause, play }) => (
            <div className="planner-container">
              <h2>Study Planner</h2>
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridDay', 
                }}
                events={events}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                // Use a different view for daily tasks
                views={{
                  dayGridMonth: {
                    eventClassNames: 'all-day-event',
                    eventContent: (eventInfo) => (
                      <div>{eventInfo.event.title}</div>
                    ),
                  },
                  timeGridDay: {
                    eventClassNames: 'time-specific-event',
                  },
                }}
              />
              <EventModal 
                isOpen={isModalOpen} 
                onClose={() => setModalOpen(false)} 
                onSave={handleSaveEvent} 
              />
            </div>
          )}
        </WaterWave>
      ) : (
        <div className="planner-container" style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          width: '100%',
          height: '100%',
        }}>
          <h2>Study Planner</h2>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridDay', 
            }}
            events={events}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            // Use a different view for daily tasks
            views={{
              dayGridMonth: {
                eventClassNames: 'all-day-event',
                eventContent: (eventInfo) => (
                  <div>{eventInfo.event.title}</div>
                ),
              },
              timeGridDay: {
                eventClassNames: 'time-specific-event',
              },
            }}
          />
          <EventModal 
            isOpen={isModalOpen} 
            onClose={() => setModalOpen(false)} 
            onSave={handleSaveEvent} 
          />
        </div>
      )}
    </>
  );
};

export default StudyPlanner;
