import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Link, useLocation } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/live', label: 'Live Session', icon: '🔴' },
    { path: '/audition', label: 'Presenter Audition', icon: '🎤' },
    { path: '/admin/auditions', label: 'Admin', icon: '🛡️', adminOnly: true },
  ];

  return (
    <div className="dashboard-layout">
      <Header />
      <div className="dashboard-container">
        <aside className="dashboard-sidebar">
          <nav>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="sidebar-icon">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="dashboard-content">{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
