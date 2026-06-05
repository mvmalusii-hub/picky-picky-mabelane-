import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUpcomingSessions, joinSession } from '../services/sessions';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUpcomingSessions().then(data => {
      setSessions(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleJoin = async (sessionId, role) => {
    try {
      const result = await joinSession(sessionId, role);
      toast.success(`Joined! New balance: R${result.new_balance}`);
      sessionStorage.setItem('livekit_token', result.livekit_token);
      sessionStorage.setItem('room_name', result.room_name);
      sessionStorage.setItem('session_id', sessionId);
      navigate(`/live/${sessionId}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Join failed');
    }
  };

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">Times Picked: {user?.stats_times_picked || 0}</div>
        <div className="stat-card">Dates Won: {user?.stats_dates_won || 0}</div>
        <div className="stat-card">Gas Thrown: {user?.stats_gas_thrown || 0}</div>
        <div className="stat-card">Fines Paid: R{user?.stats_fines_paid || 0}</div>
      </div>
      <h3>Upcoming Sessions</h3>
      {loading ? <p>Loading...</p> : sessions.map(s => (
        <div key={s.id} className="session-row">
          <span>{new Date(s.scheduled_start).toLocaleString()}</span>
          <button onClick={() => handleJoin(s.id, 'picker')}>Join as Picker (R50)</button>
          <button onClick={() => handleJoin(s.id, 'picked')}>Join as Picked (R20)</button>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
