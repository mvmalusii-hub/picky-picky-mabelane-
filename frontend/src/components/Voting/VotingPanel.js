import React, { useState, useEffect } from 'react';
import { submitVote, getVoteTallies } from '../../services/voting';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const VotingPanel = ({ sessionId, contestants }) => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('fan_favorite');
  const [selectedTarget, setSelectedTarget] = useState('');
  const [tallies, setTallies] = useState({});
  const [voting, setVoting] = useState(false);

  const categories = [
    { value: 'best_gas', label: '🏆 Best Gas Card', desc: 'Most savage Gas Card' },
    { value: 'fan_favorite', label: '❤️ Fan Favorite', desc: 'Most liked contestant' },
    { value: 'next_picker', label: '🎤 Next Picker', desc: 'Who should pick next session?' },
  ];

  useEffect(() => {
    const fetchTallies = async () => {
      try {
        const data = await getVoteTallies(sessionId, selectedCategory);
        const tallyMap = {};
        data.forEach(v => { tallyMap[v.target_id] = v.total; });
        setTallies(tallyMap);
      } catch (err) { console.error(err); }
    };
    fetchTallies();
    const interval = setInterval(fetchTallies, 5000);
    return () => clearInterval(interval);
  }, [sessionId, selectedCategory]);

  const handleVote = async () => {
    if (!user) return toast.error('Login to vote');
    if (!selectedTarget) return toast.error('Select a contestant');
    setVoting(true);
    try {
      await submitVote(sessionId, selectedTarget, selectedCategory, 1);
      toast.success('Vote recorded!');
      // Refresh tallies
      const data = await getVoteTallies(sessionId, selectedCategory);
      const tallyMap = {};
      data.forEach(v => { tallyMap[v.target_id] = v.total; });
      setTallies(tallyMap);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Vote failed');
    } finally {
      setVoting(false);
    }
  };

  return (
    <div className="voting-panel">
      <h3>🗳️ Viewer Voting</h3>
      <div className="category-selector">
        {categories.map(cat => (
          <button
            key={cat.value}
            className={selectedCategory === cat.value ? 'active' : ''}
            onClick={() => setSelectedCategory(cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <div className="contestant-list">
        {contestants.map(c => (
          <label key={c.id} className="contestant-option">
            <input
              type="radio"
              name="voteTarget"
              value={c.id}
              checked={selectedTarget === c.id}
              onChange={() => setSelectedTarget(c.id)}
            />
            <span>{c.name}</span>
            <span className="vote-count">{tallies[c.id] || 0} votes</span>
          </label>
        ))}
      </div>
      <button onClick={handleVote} disabled={voting} className="vote-btn">
        {voting ? 'Voting...' : 'Submit Vote'}
      </button>
      <small>Super Votes (x10) available in Shop →</small>
    </div>
  );
};

export default VotingPanel;
