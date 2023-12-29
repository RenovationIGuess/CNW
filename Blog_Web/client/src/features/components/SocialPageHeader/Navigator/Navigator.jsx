import React, { useEffect, useRef, useState } from 'react';
import './Navigator.scss';
import { useNavigate } from 'react-router-dom';

const Navigator = () => {
  const [currentHoverX, setCurrentHoverX] = useState(0);
  const [currentHoverWidth, setCurrentHoverWidth] = useState(0);
  const [currentActive, setCurrentActive] = useState({});

  const timeRef = useRef();

  useEffect(() => {
    setCurrentHoverWidth(
      Math.round(
        document.querySelector('[data-query="home"]').getBoundingClientRect()
          .width * 100
      ) / 100
    );
    setCurrentActive({
      active_name: 'home',
      element_tag: document.querySelector('[data-query="home"]'),
    });
  }, []);

  const handleHovered = (e) => {
    if (timeRef.current) clearTimeout(timeRef.current);
    const firstElement = document.querySelector('.header-tab-name');
    const firstElementRect = firstElement.getBoundingClientRect();
    const currentHoveredElement = e.target;
    const currentElementRect = currentHoveredElement.getBoundingClientRect();
    const roundedValueWidth = Math.round(currentElementRect.width * 100) / 100;
    setCurrentHoverWidth(roundedValueWidth);
    const roundedValueX =
      Math.round((currentElementRect.left - firstElementRect.left) * 100) / 100;
    setCurrentHoverX(roundedValueX);
  };

  const handleClicked = (e, activeName) => {
    setCurrentActive({
      active_name: activeName,
      element_tag: e.currentTarget,
    });
  };

  const handleUnhovered = () => {
    timeRef.current = setTimeout(() => {
      if (currentActive.element_tag) {
        const firstElement = document.querySelector('.header-tab-name');
        const firstElementRect = firstElement.getBoundingClientRect();
        const currentElementRect =
          currentActive.element_tag.getBoundingClientRect();
        const roundedValueWidth =
          Math.round(currentElementRect.width * 100) / 100;
        setCurrentHoverWidth(roundedValueWidth);
        const roundedValueX =
          Math.round((currentElementRect.left - firstElementRect.left) * 100) /
          100;
        setCurrentHoverX(roundedValueX);
      } else {
        setCurrentHoverX(0);
        setCurrentHoverWidth(0);
      }
    }, 1000);
  };

  return (
    <>
      <div
        className="header__left"
        style={{
          '--ind-x': currentHoverX,
          '--ind-width': currentHoverWidth,
        }}
      >
        <div className="header-tab-wrapper relative">
          <div
            className={`header-tab mr-6${
              currentActive.active_name === 'home' ? ' header-tab--active' : ''
            }`}
            data-active="home"
            onClick={(e) => handleClicked(e, 'home')}
            onMouseOver={(e) => handleHovered(e)}
            onMouseOut={() => handleUnhovered()}
          >
            <p data-query="home" className="header-tab-name">
              Home
            </p>
            {/* <div className="header-tab__underline"></div> */}
          </div>
          <div
            className={`header-tab${
              currentActive.active_name === 'group' ? ' header-tab--active' : ''
            }`}
            data-active="group"
            onClick={(e) => handleClicked(e, 'group')}
            onMouseOver={(e) => handleHovered(e)}
            onMouseOut={() => handleUnhovered()}
          >
            <p data-query="group" className="header-tab-name">
              Group
            </p>
            {/* <div className="header-tab__underline"></div> */}
          </div>
          <div className="tab-underline"></div>
        </div>
      </div>
    </>
  );
};

export default Navigator;
