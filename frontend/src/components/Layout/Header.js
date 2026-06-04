import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        🍑 PICKY PICKY MABELANE
      </div>
      <div className="header-right">
        {user ? (
          <>
            <span className="user-info">
              👤 {user.full_name} | Wallet: R{user.wallet_balance}
            </span>
            <button onClick={handleLogout} className="btn-outline">
              Logout
            </button>
          </>
        ) : (
          <button onClick={() => navigate('/')} className="btn-primary">
            Login / Sign Up
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
