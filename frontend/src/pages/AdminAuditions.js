import React, { useEffect, useState } from 'react';
import { getAuditions, updateAuditionStatus } from '../services/auditions';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminAuditions = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    if (user?.role === 'admin') {
      getAuditions().then(setSubmissions).catch(console.error);
    }
  }, [user]);

  const handleStatus = async (id, status) => {
    try {
      await updateAuditionStatus(id, status);
      toast.success(`Audition ${status}`);
      setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    } catch (err) {
      toast.error('Update failed');
    }
  };

  if (user?.role !== 'admin') return <Navigate to="/dashboard" />;

  return (
    <div>
      <h2>Audition Submissions</h2>
      <table className="admin-table">
        <thead>
          <tr><th>Name</th><th>Email</th><th>Video 1</th><th>Video 2</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {submissions.map(s => (
            <tr key={s.id}>
              <td>{s.full_name}</td>
              <td>{s.email}</td>
              <td><a href={s.video1_url} target="_blank" rel="noreferrer">Watch</a></td>
              <td><a href={s.video2_url} target="_blank" rel="noreferrer">Watch</a></td>
              <td className={`status-${s.status}`}>{s.status}</td>
              <td>
                <button onClick={() => handleStatus(s.id, 'approved')}>Approve</button>
                <button onClick={() => handleStatus(s.id, 'rejected')}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminAuditions;
