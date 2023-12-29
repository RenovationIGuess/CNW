import React from 'react';
import { useNavigate } from 'react-router-dom';
import { images } from '~/constants';

const NotFound = ({ message }) => {
  const navigate = useNavigate();

  return (
    <div className="root-page-container">
      <div className="root-page-container__content">
        <div className="root-page-container__left">
          <div className="page-404">
            <div className="page-404__container">
              <img src={images.notfound} alt="404" className="page-404__img" />
              <p className="page-404__text">{message}</p>
              <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="button-primary">
                  <span>Go back</span>
                </button>
                <button
                  // onClick={() => navigate(-1)}
                  className="button-primary"
                >
                  <span>Go to Trash</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
