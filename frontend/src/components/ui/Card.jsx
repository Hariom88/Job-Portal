import React from 'react';

export const Card = ({ children, className = '', hover = false }) => {
  return (
    <div className={`glass-panel rounded-2xl p-6 ${hover ? 'hover:premium-shadow hover:-translate-y-1 transition-all duration-300 cursor-pointer' : ''} ${className}`}>
      {children}
    </div>
  );
};
