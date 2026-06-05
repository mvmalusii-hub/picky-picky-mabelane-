import React, { useState } from 'react';
import { predictWinner } from '../../services/voting';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const PredictionWidget = ({ sessionId, contestants, onPrediction }) => {
  const { user } = useAuth();
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    if (!user) return toast.error('Login first');
    if (!selected) return toast.error('Pick a winner');
    setLoading(true);
    try {
      await predictWinner(sessionId, selected);
      toast.success('Prediction locked! Good luck.');
      if (onPrediction) onPrediction();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prediction-widget">
      <h4>🔮 Predict Winner (R5)</h4>
      <select value={selected} onChange={e => setSelected(e.target.value)}>
        <option value="">-- Choose contestant --</option>
        {contestants.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
      <button onClick={handlePredict} disabled={loading}>Submit Prediction</button>
      <small>Correct predictions earn Prophet badge + monthly draw entry</small>
    </div>
  );
};

export default PredictionWidget;
