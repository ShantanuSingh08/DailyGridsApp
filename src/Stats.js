import React, { useEffect, useState } from 'react';
import './Stats.css';
import WaterWave from 'react-water-wave';
import { useRipple } from './RippleContext';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LinearScale, CategoryScale, BarElement, Title, Tooltip, Legend);

const FocusTimeStats = ({ bgImage }) => {
  const [dailyTime, setDailyTime] = useState(0);
  const [weeklyTime, setWeeklyTime] = useState(0);
  const [monthlyTime, setMonthlyTime] = useState(0);
  const [last7DaysData, setLast7DaysData] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [last4WeeksData, setLast4WeeksData] = useState([0, 0, 0, 0]);


  const { isRippleEnabled } = useRipple();
  
  const weeklyGoal = 50 * 3600; 

  const fetchAndSaveFocusTime = async (userId) => {
    try {
      // Fetch focus time data from the backend
      const response = await fetch(`https://studyplanner1.onrender.com/api/focus-time/${userId}`);
      const data = await response.json();
  
      if (response.ok) {
        // Check if data exists in localStorage
        const storedData = JSON.parse(localStorage.getItem('focusTimeData')) || {};
        
        // Compare the dates of the data in localStorage and the latest data from the database
        const storedDates = Object.keys(storedData);
        const latestStoredDate = storedDates.length ? storedDates[storedDates.length - 1] : null;
        const latestFetchedDate = Object.keys(data).length ? Object.keys(data)[Object.keys(data).length - 1] : null;
  
        if (!latestStoredDate || latestStoredDate < latestFetchedDate) {
          // If localStorage data is outdated, update it with the latest fetched data
          localStorage.setItem('focusTimeData', JSON.stringify(data));
          console.log('Focus time data updated in localStorage:', data);
        } else {
          console.log('LocalStorage already has the latest focus time data.');
        }
      } else {
        console.error('Error fetching focus time:', data.message);
      }
    } catch (error) {
      console.error('Error fetching focus time:', error);
    }
  };

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('focusTimeData')) || {};
    const todayDate = new Date();
    const today = todayDate.toISOString().slice(0, 10);
    const userId = localStorage.getItem('userId');
    fetchAndSaveFocusTime(userId);



    let daily = 0,
      weekly = 0,
      monthly = 0;

    const past7Days = Array(7).fill(0); // Array for the last 7 days
    const past4Weeks = Array(4).fill(0); // Array for the last 4 weeks

    for (let date in storedData) {
      const sessionDate = new Date(date);
      const sessionTime = storedData[date];

      // Track daily time (in seconds)
      if (date === today) daily += sessionTime;

      const dayDifference = (todayDate - sessionDate) / (1000 * 60 * 60 * 24);

      // Track last 7 days
      if (dayDifference < 7) past7Days[6 - Math.floor(dayDifference)] += sessionTime;

      // Track last 4 weeks
      if (dayDifference < 7) past4Weeks[3] += sessionTime;
      else if (dayDifference >= 7 && dayDifference < 14) past4Weeks[2] += sessionTime;
      else if (dayDifference >= 7 && dayDifference < 21) past4Weeks[1] += sessionTime;
      else if (dayDifference >= 7 && dayDifference < 28) past4Weeks[0] += sessionTime;

      // Monthly and weekly calculations
      if (dayDifference >= 0 && dayDifference < 7) weekly += sessionTime;
      if (todayDate.getMonth() === sessionDate.getMonth() && todayDate.getFullYear() === sessionDate.getFullYear()) {
        monthly += sessionTime;
      }
    }

    setDailyTime(daily);
    setWeeklyTime(weekly);
    setMonthlyTime(monthly);
    setLast7DaysData(past7Days);
    setLast4WeeksData(past4Weeks);
  }, []);

  const formatTime = (secs) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  };

  const remainingTime = Math.max(weeklyGoal - weeklyTime, 0);
  const goalPercentage = (weeklyTime / weeklyGoal) * 100;
  const isGoalMet = weeklyTime >= weeklyGoal;
  const WeekTime = weeklyTime < weeklyGoal ? weeklyTime : weeklyGoal;




  const last7DaysChartData = {
    labels: ['6 Days Ago', '5 Days Ago', '4 Days Ago', '3 Days Ago', '2 Days Ago', 'Yesterday', 'Today'],
    datasets: [
      {
        label: 'Daily Focus Time (hrs)',
        data: last7DaysData.map((time) => time / 3600),
        backgroundColor: 'rgba(153, 102, 255, 0.8)',
      },
    ],
  };

  const last4WeeksChartData = {
    labels: ['3 Weeks Ago', '2 Weeks Ago', 'Last Week', 'This Week'],
    datasets: [
      {
        label: 'Weekly Focus Time (hrs)',
        data: last4WeeksData.map((time) => time / 3600),
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.3)', 
        },
        ticks: {
          color: '#ffffff', 
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.3)',
        },
        ticks: {
          color: '#ffffff',
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: '#ffffff', 
        },
      },
    },
  };

  return (
    <>
      {isRippleEnabled ? (
        <WaterWave imageUrl={bgImage} style={{ width: '100%', height: '100%', backgroundSize: 'cover' }}>
          {() => (
            <div className="focus-time-stats">
              <div className="stats-text">
                <h2>Focus Time Stats</h2>
                <p>Daily Focus Time: {formatTime(dailyTime)}</p>
                <p>Weekly Focus Time: {formatTime(weeklyTime)}</p>
                <p>Monthly Focus Time: {formatTime(monthlyTime)}</p>
                </div>
                {/* Progress Bar for Weekly Goal */}
                <div className="progress-container">
                  <div
                    className="progress-bar goal"
                    style={{ width: `${goalPercentage > 100 ? 100 : goalPercentage}%` }} 
                  ></div>
                  <div
                    className="progress-bar remaining"
                    style={{ width: `${(remainingTime / weeklyGoal) * 100}%`, backgroundColor: 'rgba(255, 99, 132, 0.5)' }} 
                  ></div>
                  <div>
                <p id='Weekly'>Weekly Goal: {formatTime(WeekTime)} / {formatTime(weeklyGoal)}  </p>
                {isGoalMet && <button className="goal-met">Congratulations!</button>}
                </div>
              </div>

              <div className="charts">
                <Bar data={last7DaysChartData} options={chartOptions} />
                <Bar data={last4WeeksChartData} options={chartOptions} />
              </div>
            </div>
          )}
        </WaterWave>
      ) : (
        <div
          className="focus-time-stats"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            width: '100%',
            height: '100%',
          }}
        >
               <div className="stats-text">
                <h2>Focus Time Stats</h2>
                <p>Daily Focus Time: {formatTime(dailyTime)}</p>
                <p>Weekly Focus Time: {formatTime(weeklyTime)}</p>
                <p>Monthly Focus Time: {formatTime(monthlyTime)}</p>
                </div>
                {/* Progress Bar for Weekly Goal */}
                <div className="progress-container">
                  <div
                    className="progress-bar goal"
                    style={{ width: `${goalPercentage > 100 ? 100 : goalPercentage}%` }} 
                  ></div>
                  <div
                    className="progress-bar remaining"
                    style={{ width: `${(remainingTime / weeklyGoal) * 100}%`, backgroundColor: 'rgba(255, 99, 132, 0.5)' }} 
                  ></div>
                  <div>
                <p id='Weekly'> Weekly Goal: {formatTime(WeekTime)} / {formatTime(weeklyGoal)}  </p>
                {isGoalMet && <button className="goal-met">Congratulations!</button>}
                </div>
              </div>

              <div className="charts">
                <Bar data={last7DaysChartData} options={chartOptions} />
                <Bar data={last4WeeksChartData} options={chartOptions} />
              </div>
            </div>
      )}
    </>
  );
};

export default FocusTimeStats;
