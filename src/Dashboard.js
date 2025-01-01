import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import WaterWave from 'react-water-wave';
import { useRipple } from './RippleContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ bgImage }) => {
  const { isRippleEnabled } = useRipple();
  const [isSubscribed, setIsSubscribed] = useState(true); // true if subscribed, false if not
  const [activeSection, setActiveSection] = useState(''); // To keep track of the active section
  const [showEmailModal, setShowEmailModal] = useState(false); // State to toggle the modal
  const [newEmail, setNewEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false); // State to track if OTP is sent
  const navigate = useNavigate(); // Hook for redirection

  const [name,setName] = useState(localStorage.getItem('name') || 'ABC');
  const [dob] = useState(localStorage.getItem('dob'));
  const [classOrCourse,setClassOrCourse] = useState(localStorage.getItem('classOrCourse') || 'CS');
  const [school, setSchool] = useState(localStorage.getItem('school') || 'UMSL');

  const toggleSubscription = () => {
    setIsSubscribed(!isSubscribed);
  };

  const handleInputChange = (e, setter) => {
    setter(e.target.value);
  };
  
  const handleSaveChanges = async () => {
    try {
      const userId = localStorage.getItem('userId'); 
      const token = localStorage.getItem('token'); 
      
 
      const updatedData = {
        name: name, 
        classOrCourse: classOrCourse, 
        school: school,
      };
      
  
      const response = await fetch(`https://studyplanner1.onrender.com/api/edit/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Response Data:', data); 
        alert('Changes saved successfully');
        
        // Update localStorage with new values
        localStorage.setItem('name', name);
        localStorage.setItem('classOrCourse', classOrCourse);
        localStorage.setItem('school', school);
      } else {
        console.log('Updated data:', JSON.stringify(updatedData));

        const errorData = await response.json();
        console.log('Error Response:', errorData); 
        alert(`Failed to save changes: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error updating data:', error);
      alert('An error occurred. Please try again later.');
    }
  };


  const handleContactSupport = () => {
    window.open('https://dailygrids.com/contact-us', '_blank'); 
  };

  const handleReportProblem = () => {
    window.open( 'https://dailygrids.com/report-problem', '_blank'); 
  };

  const handleEmailEdit = () => {
    setShowEmailModal(true); 
  };

  const handleSendOtp = async () => {
    try {
      const response = await fetch('https://studyplanner1.onrender.com/api/otp/request-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newEmail }), // Sends newEmail as JSON payload
      });
  
      if (response.ok) {
        console.log('OTP sent to:', newEmail);
        setOtpSent(true); // Set OTP sent state
      } else {
        console.error('Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };
  

  const handleVerifyOtp = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch('https://studyplanner1.onrender.com/api/otp/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          otp: otp,              // OTP entered by the user
          newEmail: newEmail,      // The new email address to verify
          userId: userId
        }),
      });
  
      // Log the raw response to inspect the status and content
      console.log('Raw response:', response);
  
      if (!response.ok) {
        // Log if response is not OK (404, 500, etc.)
        console.error('Failed response:', await response.text());
        console.log('Invalid OTP');
        return;
      }
  
      const result = await response.json();
      console.log('OTP verified');
      setShowEmailModal(false); // Close the modal after successful verification
    } catch (error) {
      console.error('Error verifying OTP:', error);
    }
  };
  
  

  async function handleChangePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
  
    if (newPassword !== confirmNewPassword) {
      alert('New passwords do not match.');
      return;
    }
  
    try {
      const response = await fetch('https://studyplanner1.onrender.com/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token for authentication
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
  
      const result = await response.json();
      if (response.ok) {
        alert('Password changed successfully');
      } else {
        alert(result.message || 'Failed to change password');
      }
    } catch (error) {
      alert('Error changing password. Please try again.');
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    localStorage.removeItem('dob'); 
    localStorage.removeItem('name'); 
    localStorage.removeItem('email'); 
    localStorage.removeItem('userId'); 
    localStorage.removeItem('school'); 
    localStorage.removeItem('hashedPassword'); 
    localStorage.removeItem('hashedEmail'); 
    localStorage.removeItem('classOrCourse'); 
    localStorage.removeItem('notes'); 
    localStorage.removeItem('focusTimeData'); 
    localStorage.removeItem('events'); 
    navigate('/account'); 
  };
  
  // Scroll detection using Intersection Observer API
  useEffect(() => {
    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id); 
        }
      });
    }, {
      threshold: 1, 
    });

    sections.forEach(section => observer.observe(section));

    return () => {
      sections.forEach(section => observer.unobserve(section)); 
    };
  }, []);

  return (
    <>
      {isRippleEnabled ? (
        <WaterWave imageUrl={bgImage} style={{ width: '100%', height: '100%', backgroundSize: 'cover' }}>
          {({ pause, play }) => (
            <div className="dashboard">
              {/* Sidebar */}
              <aside className="menu">
                <h2>Account Management</h2>
                <ul>
                  <li className={activeSection === 'personal-info' ? 'active' : ''}>Personal Information</li>
                  <li className={activeSection === 'account-signin' ? 'active' : ''}>Account Sign-In</li>
                  <li className={activeSection === 'subscription-billing' ? 'active' : ''}>Subscription & Billing</li>
                  <li className={activeSection === 'help-support' ? 'active' : ''}>Help & Support</li>
                </ul>
              </aside>

              <main className="main-content">
                {/* Personal Information Section */}
                  <section className="section" id="personal-info">
                    <h3>Personal Information</h3>
                    <p>This information is private and will not be shared with other players.</p>
                    <div className="input-group">
                    <label>Full Name</label>
                    <input className="custom-placeholder" type="text" placeholder={localStorage.getItem('name')} value={name} onChange={(e) => handleInputChange(e, setName)}  /> 
                    <label>Date of Birth</label>
                    <input className="custom-placeholder" type="text"name="dob" value={localStorage.getItem('dob') ? new Date(localStorage.getItem('dob')).toLocaleDateString() : '1999'}/>  
                    <label>Class/Course</label>
                    <input className="custom-placeholder" type="text" placeholder={localStorage.getItem('classOrCourse') || ''} value={classOrCourse} onChange={(e) => handleInputChange(e, setClassOrCourse)}/>
                    <label>School</label>
                    <input className="custom-placeholder" type="text" placeholder={localStorage.getItem('school') || ''} value={school} onChange={(e) => handleInputChange(e, setSchool)} />
                   </div>
                    <button onClick={handleSaveChanges}>Save Changes</button>
                  </section>

                  {/* Account Sign-In Section */}
                  <section className="section" id="account-signin">
                    <h3>Account Sign-In</h3>
                    <p>We recommend that you periodically update your password to help prevent unauthorized access to your account.</p>
                    <div className="input-group">
                      <label>Email Address</label>
                      <div className="email-input-wrapper">
                      <input 
                        type="text" 
                        value={localStorage.getItem('email') ? localStorage.getItem('email').replace(/(.{2})(.*)(@.*)/, '$1********$3') : ''} 
                        readOnly 
                        className="readonly-input" 
                      />
                      <button onClick={handleEmailEdit} className="edit-email-button">Edit</button>
                      </div>
                      <h4>Change Password</h4>
                      <label>Current Password</label>
                      <input type="password" placeholder="Enter current password" />
                      <label>New Password</label>
                      <input type="password" placeholder="Enter new password" />
                      <label>Confirm New Password</label>
                      <input type="password" placeholder="Confirm new password" />
                    </div>
                    <button className="save-button" onClick={handleChangePassword}>Confirm Change Pasword</button>
                  </section>


                {/* Help & Support Section */}
                <section className="section" id="help-support">
                  <h3>Help & Support</h3>
                  <div className="input-group support-group">
                    <h4>Contact Support <span className='hspace'>&nbsp;|&nbsp;</span> Report a Problem</h4>
                  </div>
                  <button className="Contact" onClick={handleContactSupport}>Contact Us</button>
                  <button className="Report" onClick={handleReportProblem}>Report Issue</button>
                </section>
                <button className="Logout" onClick={handleLogout}>Logout</button>
                <button className="DelUser">Delete Account</button>
              </main>
            </div>
          )}
        </WaterWave>
      ) : (
        <div className="dashboard" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', width: '100%', height: '100%' }}>
          {/* Sidebar */}
          <aside className="menu">
            <h2>Account Management</h2>
            <ul>
              <li className={activeSection === 'personal-info' ? 'active' : ''}>Personal Information</li>
              <li className={activeSection === 'account-signin' ? 'active' : ''}>Account Sign-In</li>
              <li className={activeSection === 'subscription-billing' ? 'active' : ''}>Subscription & Billing</li>
              <li className={activeSection === 'help-support' ? 'active' : ''}>Help & Support</li>
            </ul>
          </aside>

          <main className="main-content">
            {/* Personal Information Section */}
            <section className="section" id="personal-info">
              <h3>Personal Information</h3>
              <p>This information is private and will not be shared with other players.</p>
              <div className="input-group">
                    <label>Full Name</label>
                    <input className="custom-placeholder" type="text" placeholder={localStorage.getItem('name')} value={name} onChange={(e) => handleInputChange(e, setName)}  /> 
                    <label>Date of Birth</label>
                    <input className="custom-placeholder" type="text"name="dob" value={localStorage.getItem('dob') ? new Date(localStorage.getItem('dob')).toLocaleDateString() : '1999'}/>  
                    <label>Class/Course</label>
                    <input className="custom-placeholder" type="text" placeholder={localStorage.getItem('classOrCourse') || ''} value={classOrCourse} onChange={(e) => handleInputChange(e, setClassOrCourse)}/>
                    <label>School</label>
                    <input className="custom-placeholder" type="text" placeholder={localStorage.getItem('school') || ''} value={school} onChange={(e) => handleInputChange(e, setSchool)} />
                   </div>
              <button onClick={handleSaveChanges}>Save Changes</button>
            </section>

            {/* Account Sign-In Section */}
            <section className="section" id="account-signin">
                    <h3>Account Sign-In</h3>
                    <p>We recommend that you periodically update your password to help prevent unauthorized access to your account.</p>
                    <div className="input-group">
                      <label>Email Address</label>
                      <div className="email-input-wrapper">
                      <input 
                        type="text" 
                        value={localStorage.getItem('email') ? localStorage.getItem('email').replace(/(.{2})(.*)(@.*)/, '$1********$3') : ''} 
                        readOnly 
                        className="readonly-input" 
                      />
                      <button onClick={handleEmailEdit} className="edit-email-button">Edit</button>
                      </div>
                      <h4>Change Password</h4>
                      <label>Current Password</label>
                      <input type="password" placeholder="Enter current password" id="currentPassword" />
                      <label>New Password</label>
                      <input type="password" placeholder="Enter new password" id="newPassword" />
                      <label>Confirm New Password</label>
                      <input type="password" placeholder="Confirm new password" id="confirmNewPassword" />
                      </div>
                    <button className="save-button" onClick={handleChangePassword}>Confirm Change Pasword</button>
                  </section>


            {/* Help & Support Section */}
            <section className="section" id="help-support">
              <h3>Help & Support</h3>
              <div className="input-group support-group">
                <h4>Contact Support <span className='hspace'>&nbsp;|&nbsp;</span> Report a Problem</h4>
              </div>
              <button className="Contact" onClick={handleContactSupport}>Contact Us</button>
              <button className="Report" onClick={handleReportProblem}>Report Issue</button>
            </section>

            <button className="Logout" onClick={handleLogout}>Logout</button>
            <button className="DelUser">Delete Account</button>
          </main>
        </div>
      )}

                {/* Modal for editing email */}
                {showEmailModal && (
                  <div className="modal">
                    <div className="modal-content">
                      <h3>Edit Email Address</h3>
                      <input
                        type="email"
                        placeholder="Enter new email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)
                          
                        }
                      />
                      <button 
                        onClick={handleSendOtp} 
                        disabled={!newEmail} 
                      >
                        Send OTP
                      </button>

                      {/* Show OTP input only if OTP is sent */}
                      {otpSent && (
                        <>
                          <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                          />
                          <button onClick={handleVerifyOtp}>Verify OTP</button>
                        </>
                      )}
                      <button onClick={() => setShowEmailModal(false)}>Cancel</button>
                    </div>
                  </div>
                )}


    </>
  );
};

export default Dashboard;
