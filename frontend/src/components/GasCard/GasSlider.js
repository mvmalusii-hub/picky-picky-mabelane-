import React from 'react';

const GasSlider = ({ value, onChange, disabled = false }) => {
  const handleChange = (e) => {
    onChange(parseInt(e.target.value));
  };

  return (
    <div className="gas-slider">
      <label>Gas Card % (rest = Shela plea)</label>
      <div className="slider-container">
        <span className="shela-label">Shela {100-value}%</span>
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className="gas-range"
        />
        <span className="gas-label">Gas {value}%</span>
      </div>
      <div className="gas-warning">
        {value > 70 && <span className="warning">⚠️ High risk of disqualification if caught lying!</span>}
      </div>
    </div>
  );
};

export default GasSlider;
