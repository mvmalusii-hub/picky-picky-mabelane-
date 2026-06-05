import React from 'react';

const GasButton = ({ onClick, disabled, loading }) => {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled || loading} 
      className="gas-button"
    >
      {loading ? 'Throwing Gas...' : '💨 Use Gas Card'}
    </button>
  );
};

export default GasButton;
