import React from 'react';
import { submitVote } from '../../services/voting';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const BestGasVote = ({ sessionId, gasCards, contestants }) => {
  const { user } = useAuth();
  const [selected, setSelected] = useState('');
  const [voting, setVoting] = useState(false);

  const handleVote = async () => {
    if (!user) return toast.error('Login required');
    if (!selected) return toast.error('Select a Gas Card');
    setVoting(true);
    try {
      await submitVote(sessionId, selected, 'best_gas', 1);
      toast.success('Vote for Best Gas Card recorded!');
    } catch (err) {
      toast.error(err.response?.data?.error);
    } finally {
      setVoting(false);
    }
  };

  return (
    <div className="best-gas-vote">
      <h4>🏆 Best Gas Card</h4>
      <select value={selected} onChange={e => setSelected(e.target.value)}>
        <option value="">-- Choose a Gas Card moment --</option>
        {gasCards.map(gc => (
          <option key={gc.id} value={gc.thrower_id}>
            {gc.thrower_name} → {gc.target_name} ({gc.percentage}% Gas)
          </option>
        ))}
      </select>
      <button onClick={handleVote} disabled={voting}>Vote</button>
    </div>
  );
};

export default BestGasVote;
