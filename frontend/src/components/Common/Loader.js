import React from 'react';

const Loader = ({ size = 'medium', color = '#05d9e8' }) => {
  const sizeClass = {
    small: 'loader-small',
    medium: 'loader-medium',
    large: 'loader-large',
  }[size];

  return (
    <div className={`loader ${sizeClass}`} style={{ borderTopColor: color }}>
      <div className="loader-inner"></div>
    </div>
  );
};

export default Loader;
