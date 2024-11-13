import React, { useState } from 'react';
import './Account.css';
import WaterWave from 'react-water-wave';
import { useRipple } from './RippleContext';
import { useNavigate } from 'react-router-dom';

const Account = ({ bgImage }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isRecoveringPassword, setIsRecoveringPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    dob: '',
    classOrCourse: '',
    school: ''
  });

  
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { isRippleEnabled } = useRipple();
  const [rememberMe, setRememberMe] = useState(false);
  const [savedNotes, setSavedNotes] = useState([]);
  const navigate = useNavigate();
  
  const fetchNotes = async (userId) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.error('User ID not found in localStorage');
        return;
      }
      
      const response = await fetch(`https://studyplanner1.onrender.com/api/notes/${userId}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.notes) {
          setSavedNotes(data.notes); 
          localStorage.setItem('notes', JSON.stringify(data.notes));
        } else {
          console.error('No notes found for this user');
        }
      } else {
        console.error('Failed to fetch notes:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };
  

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setErrorMessage('');
    setFormData({
      email: '',
      password: '',
      name: '',
      dob: '',
      classOrCourse: '',
      school: ''
    });
    setRememberMe(false);
    setIsRecoveringPassword(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value}));
  };

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const baseUrl = 'https://studyplanner1.onrender.com'; 
    const endpoint = isLogin ? `${baseUrl}/api/login` : `${baseUrl}/api/register`;
    const payload = isLogin ? { email: formData.email, password: formData.password } : { ...formData};
  
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log(data.message || 'Success');
        if (isLogin) {
          // Store the token, userId, and additional user details in localStorage
          if (data.token && data.userId) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId);  
            localStorage.setItem('name', data.name); 
            localStorage.setItem('email', data.email); 
            localStorage.setItem('dob', data.dob);  
            localStorage.setItem('classOrCourse', data.classOrCourse);  
            localStorage.setItem('school', data.school);  
          }
          fetchNotes();
          navigate('/dashboard');
        }
      } else {
        setErrorMessage(data.message || 'Error occurred');
      }
    } catch (error) {
      setErrorMessage('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  

  const handlePasswordRecovery = async (e) => {
    e.preventDefault();
    setLoading(true);
    const baseUrl = 'https://studyplanner1.onrender.com';
    const endpoint = `${baseUrl}/api/auth/forgot-password`; 
  
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log(data.message || 'Recovery email sent successfully.');
        setIsRecoveringPassword(false);
        setErrorMessage('Recovery email sent. Please check your inbox.');
      } else {
        setErrorMessage(data.message || 'Error occurred while sending recovery email.');
      }
    } catch (error) {
      setErrorMessage('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    {isRippleEnabled ? (
    <WaterWave imageUrl={bgImage} style={{ width: '100%', height: '100%', backgroundSize: 'cover' }}>
      {({ pause, play }) => (
        <div className="account-container">
          <h2>{isRecoveringPassword ? 'Recover Password' : isLogin ? 'Login' : 'Register'}</h2>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {!isRecoveringPassword ? (
            <form onSubmit={handleSubmit}>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />

              <label>Password:</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />

              {!isLogin && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Name:</label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        pattern="[A-Za-z\s]+"
                        title="Name should only contain alphabets and spaces"
                      />
                    </div>

                    <div className="form-group">
                      <label>Date of Birth:</label>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Class/Course:</label>
                      <input
                        type="text"
                        name="classOrCourse"
                        placeholder="Enter your class or course"
                        value={formData.classOrCourse}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>School:</label>
                      <input
                        type="text"
                        name="school"
                        placeholder="Enter your school name"
                        value={formData.school}
                        onChange={handleInputChange}
                        required
                        minLength="10"
                      />
                    </div>
                  </div>
                </>
              )}

              {isLogin && (
                <div className="remember-me">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={handleRememberMeChange}
                  />
                  <label htmlFor="rememberMe">Remember Me</label>
                </div>
              )}

              <button type="submit" disabled={loading}>
                {loading ? 'Loading...' : isLogin ? 'Login' : 'Register'}
              </button>
              <div className="toggle-link">
                <button onClick={() => setIsRecoveringPassword(true)}>Forgot Password?</button>
                <button onClick={toggleForm}>{isLogin ? 'Create an Account' : 'Back to Login'}</button>
              </div>
            </form>
          ) : (
            <form onSubmit={handlePasswordRecovery}>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Loading...' : 'Send Recovery Email'}
              </button>
              <div className="toggle-link">
                <button onClick={() => setIsRecoveringPassword(false)}>Back to Login</button>
              </div>
            </form>
          )}
        </div>
        
      )}
    </WaterWave>
  ) : (
    <div className='account' style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', width: '100%', height: '100%' }}>
    <div className="account-container">
    <h2>{isRecoveringPassword ? 'Recover Password' : isLogin ? 'Login' : 'Register'}</h2>
    {errorMessage && <div className="error-message">{errorMessage}</div>}
    {!isRecoveringPassword ? (
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />

        <label>Password:</label>
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />

        {!isLogin && (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  pattern="[A-Za-z\s]+"
                  title="Name should only contain alphabets and spaces"
                />
              </div>

              <div className="form-group">
                <label>Date of Birth:</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Class/Course:</label>
                <input
                  type="text"
                  name="classOrCourse"
                  placeholder="Enter your class or course"
                  value={formData.classOrCourse}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>School:</label>
                <input
                  type="text"
                  name="school"
                  placeholder="Enter your school name"
                  value={formData.school}
                  onChange={handleInputChange}
                  required
                  minLength="10"
                />
              </div>
            </div>
          </>
        )}

        {isLogin && (
          <div className="remember-me">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={handleRememberMeChange}
            />
            <label htmlFor="rememberMe">Remember Me</label>
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : isLogin ? 'Login' : 'Register'}
        </button>
        <div className="toggle-link">
          <button onClick={() => setIsRecoveringPassword(true)}>Forgot Password?</button>
          <button onClick={toggleForm}>{isLogin ? 'Create an Account' : 'Back to Login'}</button>
        </div>
      </form>
    ) : (
      <form onSubmit={handlePasswordRecovery}>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Send Recovery Email'}
        </button>
        <div className="toggle-link">
          <button onClick={() => setIsRecoveringPassword(false)}>Back to Login</button>
        </div>
      </form>
    )}
  </div>
  </div>
)}
  
  </>
);
};



export default Account;
