import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LiveKitRoom from '../components/LiveKit/LiveKitRoom';
import ShopSidebar from '../components/Shop/ShopSidebar';
import VotingPanel from '../components/Voting/VotingPanel';
import PredictionWidget from '../components/Voting/PredictionWidget';
import GasSlider from '../components/GasCard/GasSlider';
import GasButton from '../components/GasCard/GasButton';
import { submitGasCard } from '../services/sessions';
import toast from 'react-hot-toast';

const LiveSession = () => {
  const { sessionId } = useParams();
  const { user } = useAuth();
  const [contestants, setContestants] = useState([]);
  const [top3, setTop3] = useState([]);
  const [gasPercent, setGasPercent] = useState(0);
  const [round, setRound] = useState('intro');

  useEffect(() => {
    // Fetch contestants for this session from backend
    // Mock for now
    setContestants([
      { id: 'c1', name: 'Lerato' }, { id: 'c2', name: 'Sipho' }, { id: 'c3', name: 'Thandi' },
      { id: 'c4', name: 'Musa' }, { id: 'c5', name: 'Naledi' }
    ]);
    setTop3(['c1', 'c3', 'c5']);
  }, [sessionId]);

  const handleGasCard = async () => {
    if (!user) return toast.error('Login required');
    const target = prompt('Enter contestant name or ID to gas:');
    if (!target) return;
    try {
      await submitGasCard(sessionId, target, gasPercent);
      toast.success(`Gas card thrown at ${gasPercent}%`);
    } catch (err) {
      toast.error(err.response?.data?.error);
    }
  };

  return (
    <div className="live-session-container">
      <div className="live-header">
        <span>🔴 LIVE: Session {sessionId}</span>
      </div>
      <div className="live-grid">
        <div className="video-section">
          <LiveKitRoom sessionId={sessionId} userId={user?.id} userName={user?.full_name} userRole={user?.role} />
        </div>
        <div className="interaction-panel">
          {top3.includes(user?.id) && round === 'plea' && (
            <div className="gas-control">
              <GasSlider value={gasPercent} onChange={setGasPercent} />
              <GasButton onClick={handleGasCard} />
            </div>
          )}
          <ShopSidebar sessionId={sessionId} contestants={contestants} />
          <VotingPanel sessionId={sessionId} contestants={contestants} />
          <PredictionWidget sessionId={sessionId} contestants={contestants} />
        </div>
      </div>
    </div>
  );
};

export default LiveSession;
