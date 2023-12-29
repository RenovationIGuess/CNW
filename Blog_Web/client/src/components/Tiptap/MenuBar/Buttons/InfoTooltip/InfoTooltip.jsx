import React from 'react';
import './InfoTooltip.scss';

const InfoTooltip = ({ title, shortcut }) => {
  return (
    <div className="info-tooltip">
      <div className="info-title">{title}</div>
      <div className="short-cut-wrapper">{shortcut}</div>
    </div>
  );
};

export default InfoTooltip;
