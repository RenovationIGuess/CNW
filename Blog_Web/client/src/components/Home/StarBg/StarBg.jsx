import React, { useState, useEffect } from 'react';
import { images } from '~/constants';
import './StarBg.scss';

const StarBg = ({ children, styles, minVh }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const layers = document.querySelectorAll('div.bg__layer');
    const stars = document.querySelectorAll('img.bg');
    layers.forEach((layer) => {
      layer.classList.add('show');
    });
    stars.forEach((star) => {
      star.classList.add('loaded');
    });
  }, []);

  useEffect(() => {
    // Add a listener for changes to the screen size
    const mediaQuery = window.matchMedia('(max-width: 739px)');

    // Set the initial value of the 'isMobile' state variable
    setIsMobile(mediaQuery.matches);

    // Define a callback function to handle changes to the media query
    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    // Add the callback function as a listener for chagnes to the meida query
    mediaQuery.addEventListener('change', handleMediaQueryChange);

    // Remove the listener when the component is unmounted
    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, []);

  return (
    <>
      <div className={`bg__header ${styles}`}>
        <div className="bg__absolute-fill">
          <div className="bg__wrapper">
            <div
              className={`bg__viewport ${
                isMobile && minVh ? 'bg--half-height' : ''
              }`}
            >
              <div className="bg__container">
                <div className="bg__scene">
                  <div className={`bg__layer`}>
                    <img
                      src={images.starBg1}
                      alt="star-bg-1"
                      className={`bg ${isMobile && 'bg--pc-only'}`}
                    />
                  </div>
                  <div className="bg__layer">
                    <img
                      className="bg bg__star layer-inner"
                      src={isMobile ? images.starBgY2 : images.starBg2}
                      alt="star-bg-2"
                    />
                  </div>
                  <div className="bg__layer">
                    <img
                      className="bg bg__star layer-inner"
                      src={isMobile ? images.starBgY1 : images.starBg3}
                      alt="star-bg-3"
                    />
                  </div>
                  <div className="bg__layer">
                    <img
                      className="star layer-inner"
                      src={images.starDot4}
                      alt="star-dot-4"
                    />
                  </div>
                  <div className="bg__layer">
                    <img
                      className="star layer-inner"
                      src={images.starDot5}
                      alt="star-dot-5"
                    />
                  </div>
                  <div className="bg__layer">
                    <img
                      className="star layer-inner"
                      src={images.starDot6}
                      alt="star-dot-6"
                    />
                  </div>
                  <div className="bg__layer">
                    <img
                      className="star layer-inner"
                      src={images.starDot7}
                      alt="star-dot-7"
                    />
                  </div>
                  <div className="bg__layer">
                    <img
                      className="star layer-inner"
                      src={images.starDot8}
                      alt="star-dot-8"
                    />
                  </div>
                  <div className="bg__layer">
                    <img
                      className="star layer-inner"
                      src={images.starDot9}
                      alt="star-dot-9"
                    />
                  </div>
                  <div className="bg__layer"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {children}

        {/* {props.isFirst && <MouseScroll />} */}
      </div>
    </>
  );
};

export default StarBg;
