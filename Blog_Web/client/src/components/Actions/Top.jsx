import React from 'react';
import { images } from '~/constants';

const Top = ({ content = 'Top Comment' }) => {
  return (
    <div className="top-brand">
      <div className="brand-icon">
        <img src={images.topfire} alt="topfire-icon" />
      </div>
      <div className="brand-text">{content}</div>
    </div>
  );
};

export default Top;
