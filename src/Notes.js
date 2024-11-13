import React, { useState, useEffect } from 'react';
import './Notes.css';
import WaterWave from 'react-water-wave';
import { FaEye } from 'react-icons/fa6';
import { MdDelete } from "react-icons/md";
import { useRipple } from './RippleContext';

const Notes = ({ bgImage }) => {
  const { isRippleEnabled } = useRipple(); 
  const [note, setNote] = useState('');
  const [savedNotes, setSavedNotes] = useState([]);
  const [viewedNote, setViewedNote] = useState(''); 
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  // Load notes from localStorage when component mounts
  useEffect(() => {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    setSavedNotes(notes);
  }, []);

  // Save note to localStorage and state
  const saveNote = async() => {
    if (note.trim() === '') return;
    const updatedNotes = [...savedNotes, note];
    setSavedNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
    setNote('');

    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch('https://studyplanner1.onrender.com/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          notes: updatedNotes, 
          }),
      });
  
      if (response.ok) {
        console.log('Note saved successfully');
      } else {
        console.error('Failed to save note:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving note:', error);
    }
 
    

  };

  // Delete a note by its index
  const deleteNote = async(indexToDelete) => {
    const updatedNotes = savedNotes.filter((_, index) => index !== indexToDelete);
    setSavedNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
    
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch('https://studyplanner1.onrender.com/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          notes: updatedNotes, 
          }),
      });
  
      if (response.ok) {
        console.log('Note saved successfully');
      } else {
        console.error('Failed to save note:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const showPopup = (note) => {
    setViewedNote(note); 
    setIsPopupVisible(true); 
  };

  const closePopup = () => {
    setIsPopupVisible(false); 
  };

  return (
    <>
      {isRippleEnabled ? (
        <WaterWave
          imageUrl={bgImage}
          style={{ width: '100%', height: '100%', backgroundSize: 'cover' }}
        >
          {({ pause, play }) => (
            <div className="notes-container">
              <h2>Note Taking</h2>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Write your note here..."
                rows="5"
                cols="50"
              />
              <button onClick={saveNote}>Save Note</button>

              <div className="saved-notes">
                <h3>Saved Notes</h3>
                {savedNotes.length > 0 ? (
                  <ul>
                    {savedNotes.map((savedNote, index) => (
                      <li key={index}>
                        {savedNote.length > 30 ? savedNote.substring(0, 30) + '...' : savedNote}
                        <button className='ViewButton' onClick={() => showPopup(savedNote)}><FaEye /> </button> 
                        <button className='DelButton' onClick={() => deleteNote(index)}><MdDelete /></button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No notes saved yet.</p>
                )}
              </div>

              {isPopupVisible && (
                <div className="popup">
                  <div className="popup-content">
                    <h3>Note Details</h3>
                    <div className="saved-note">
                      <p>{viewedNote}</p>
                    </div>
                    <button onClick={closePopup}>Close</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </WaterWave>
      ) : (
        <div
          className="notes-container"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            width: '100%',
            height: '100%',
          }}
        >
          <h2>Note Taking</h2>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write your note here..."
            rows="5"
            cols="50"
          />
          <button onClick={saveNote}>Save Note</button>

          <div className="saved-notes">
            <h3>Saved Notes</h3>
            {savedNotes.length > 0 ? (
              <ul>
                {savedNotes.map((savedNote, index) => (
                  <li key={index}>
                    {savedNote.length > 30 ? savedNote.substring(0, 30) + '...' : savedNote}
                    <button className='ViewButton' onClick={() => showPopup(savedNote)}><FaEye /> </button> 
                    <button className='DelButton' onClick={() => deleteNote(index)}><MdDelete /></button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No notes saved yet.</p>
            )}
          </div>

          {isPopupVisible && (
            <div className="popup">
              <div className="popup-content">
                <h3>Note Details</h3>
                <div className="saved-note">
                  <p>{viewedNote}</p>
                </div>
                <button onClick={closePopup}>Close</button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Notes;
