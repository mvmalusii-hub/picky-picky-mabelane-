import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { Layout, DashboardLayout } from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import LiveSession from './pages/LiveSession';
import Audition from './pages/Audition';
import AdminAuditions from './pages/AdminAuditions';
import { Toaster } from 'react-hot-toast';

function App() {
  const { user, loading } = useAuth();
  if (loading) return <div className="loader-container"><div className="loader"></div></div>;

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/dashboard" element={user ? <DashboardLayout><Dashboard /></DashboardLayout> : <Navigate to="/" />} />
        <Route path="/live/:sessionId" element={user ? <DashboardLayout><LiveSession /></DashboardLayout> : <Navigate to="/" />} />
        <Route path="/audition" element={<Layout><Audition /></Layout>} />
        <Route path="/admin/auditions" element={user?.role === 'admin' ? <DashboardLayout><AdminAuditions /></DashboardLayout> : <Navigate to="/dashboard" />} />
      </Routes>
    </>
  );
}

export default App;
