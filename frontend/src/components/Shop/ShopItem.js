import React, { useState } from 'react';
import { buyItem } from '../../services/shop';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ShopItem = ({ item, itemKey, sessionId, targetId, onPurchase }) => {
  const { user } = useAuth();
  const [buying, setBuying] = useState(false);

  const handleBuy = async () => {
    if (!user) return toast.error('Login required');
    if (!targetId && itemKey !== 'insider_tip') return toast.error('No target selected');
    setBuying(true);
    try {
      const result = await buyItem(itemKey, sessionId, targetId);
      toast.success(`Bought ${item.name}! New balance: R${result.newBalance}`);
      if (onPurchase) onPurchase(result);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Purchase failed');
    } finally {
      setBuying(false);
    }
  };

  return (
    <div className="shop-item">
      <h4>{item.name}</h4>
      <p>{item.description}</p>
      <div className="price">R{item.price}</div>
      <button onClick={handleBuy} disabled={buying} className="buy-btn">
        {buying ? 'Buying...' : 'Buy'}
      </button>
    </div>
  );
};

export default ShopItem;
