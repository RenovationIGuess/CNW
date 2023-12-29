import React from 'react';
import './BackgroundSection.scss';

const BackgroundSection = ({ image, hidden, loading }) => {
  return (
    <div className={`page-center-bg`}>
      <div className="page-center-bg__wrapper">
        {loading ? (
          <div className="skeleton skeleton-background-image"></div>
        ) : (
          <img src={image} alt="background-image" />
        )}
        <div className="page-center-bg-mask"></div>
      </div>
      <div className={`page-center-bg-button__grp ${hidden && 'hidden'}`}>
        <div className="button-item-left__wrp one-button-only">
          <span>Change cover</span>
        </div>
        {/* <div className="button-item-right__wrp">
          <span>Reposition</span>
        </div> */}
      </div>
    </div>
  );
};

export default BackgroundSection;
