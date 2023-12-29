import React from 'react';
import { images } from '~/constants';
import './index.scss';

const Pinned = ({ content = 'Pinned' }) => {
  return (
    <div className="pinned-wrapper">
      <img src={images.pinned} alt="pinned-icon" />
      &nbsp;
      <span>{content}</span>
    </div>
  );
};

export default Pinned;
