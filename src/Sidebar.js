import React from 'react';
import './Sidebar.css';
import { FaClock, FaCalendarAlt, FaChalkboard, FaTasks, FaChartBar, FaHome } from 'react-icons/fa';
import { MdAccountCircle } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem('token');  

  return (
    <div className="sidebar">
      <div className="sidebar-icon" onClick={() => navigate('/')}>
        <FaHome />
      </div>
      <div className="sidebar-icon" onClick={() => navigate(isLoggedIn ? '/timer' : '/account')}>
        <FaClock />
      </div>
      <div className="sidebar-icon" onClick={() => navigate(isLoggedIn ? '/planner' : '/account')}>
        <FaCalendarAlt />
      </div>
      <div className="sidebar-icon whiteboard-icon" onClick={() => navigate(isLoggedIn ? '/whiteboard' : '/account')}>
        <FaChalkboard />
      </div>
      <div className="sidebar-icon" onClick={() => navigate(isLoggedIn ? '/notes' : '/account')}>
        <FaTasks />
      </div>
      <div className="sidebar-icon" onClick={() => navigate(isLoggedIn ? '/stats' : '/account')}>
        <FaChartBar />
      </div>
      <div className="sidebar-icon" onClick={() => navigate(isLoggedIn ? '/dashboard' : '/account')}>
        <MdAccountCircle />
      </div>
    </div>
  );
};

export default Sidebar;
