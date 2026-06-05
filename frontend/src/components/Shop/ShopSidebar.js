import React, { useEffect, useState } from 'react';
import { getShopItems, buyItem } from '../../services/shop';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ShopSidebar = ({ sessionId, contestants, onPurchase }) => {
  const { user, token } = useAuth();
  const [items, setItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedContestant, setSelectedContestant] = useState('');

  useEffect(() => {
    getShopItems().then(data => {
      setItems(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleBuy = async (itemKey, item) => {
    if (!user) {
      toast.error('Login required');
      return;
    }
    let targetId = selectedContestant;
    if (!targetId && itemKey !== 'insider_tip') {
      toast.error('Select a contestant first');
      return;
    }
    try {
      const result = await buyItem(itemKey, sessionId, targetId);
      toast.success(`Bought ${item.name}! New balance: R${result.newBalance}`);
      if (onPurchase) onPurchase(result);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Purchase failed');
    }
  };

  if (loading) return <div className="shop-loading">Loading shop...</div>;

  return (
    <div className="shop-sidebar">
      <h3>🛒 Power-Ups & Drama</h3>
      <div className="contestant-selector">
        <label>Target Contestant:</label>
        <select value={selectedContestant} onChange={e => setSelectedContestant(e.target.value)}>
          <option value="">-- Choose --</option>
          {contestants.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div className="shop-items-grid">
        {Object.entries(items).map(([key, item]) => (
          <div key={key} className="shop-item">
            <h4>{item.name}</h4>
            <p>{item.description}</p>
            <div className="price">R{item.price}</div>
            <button onClick={() => handleBuy(key, item)} className="buy-btn">
              Buy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopSidebar;
