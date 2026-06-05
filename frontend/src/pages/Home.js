import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Countdown from '../components/Common/Countdown';
import Modal from '../components/Common/Modal';

const Home = () => {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [regData, setRegData] = useState({ full_name: '', email: '', password: '', role: 'viewer' });

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(email, password);
    setShowLogin(false);
    navigate('/dashboard');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    await register(regData);
    setShowRegister(false);
    navigate('/dashboard');
  };

  if (user) {
    navigate('/dashboard');
    return null;
  }

  const nextSession = new Date();
  nextSession.setHours(12, 15, 0, 0);
  if (nextSession < new Date()) nextSession.setDate(nextSession.getDate() + 1);

  return (
    <div className="home-container">
      <div className="hero">
        <h1>Pick a date. <span className="accent">Gas your rivals.</span><br />Pay the fine.</h1>
        <p>Live 15min dating showdown. Gas Card = R100 fine if caught lying.</p>
        <Countdown targetDate={nextSession} />
        <div className="cta-group">
          <button className="primary" onClick={() => setShowRegister(true)}>Join as Picker (R50)</button>
          <button className="primary pink" onClick={() => setShowRegister(true)}>Join as Picked (R20)</button>
          <button className="outline" onClick={() => setShowRegister(true)}>Watch as VIP</button>
        </div>
      </div>

      <Modal isOpen={showLogin} onClose={() => setShowLogin(false)} title="Login">
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="primary">Login</button>
        </form>
      </Modal>

      <Modal isOpen={showRegister} onClose={() => setShowRegister(false)} title="Sign Up">
        <form onSubmit={handleRegister}>
          <input type="text" placeholder="Full Name" value={regData.full_name} onChange={e => setRegData({...regData, full_name: e.target.value})} required />
          <input type="email" placeholder="Email" value={regData.email} onChange={e => setRegData({...regData, email: e.target.value})} required />
          <input type="password" placeholder="Password" value={regData.password} onChange={e => setRegData({...regData, password: e.target.value})} required />
          <select value={regData.role} onChange={e => setRegData({...regData, role: e.target.value})}>
            <option value="viewer">VIP Viewer (R30/mo)</option>
            <option value="picker">Picker (R50/session)</option>
            <option value="picked">Picked (R20/session)</option>
            <option value="hybrid">Hybrid (R300/mo)</option>
          </select>
          <button type="submit" className="primary">Register & Pay</button>
        </form>
      </Modal>
    </div>
  );
};

export default Home;
