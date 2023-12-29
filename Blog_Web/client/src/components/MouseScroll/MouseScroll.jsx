import React, { useEffect } from 'react';
import './MouseScroll.scss';
import { CgMouse } from 'react-icons/cg';

const MouseScroll = () => {
  useEffect(() => {
    window.addEventListener('scroll', scrollTrack);
  }, []);

  const scrollTrack = () => {
    const mouseScroll = document.querySelector('div.mouse__scroll');
    if (window.scrollY >= 80) {
      mouseScroll.classList.add('scrolled');
    } else {
      if (mouseScroll.classList.contains('scrolled')) {
        mouseScroll.classList.remove('scrolled');
      }
    }
  };

  return (
    <div className="mouse__scroll">
      <div>
        <CgMouse className="mouse__scroll-logo" />
      </div>
      <div className="mouse__scroll-line" />
    </div>
  );
};

export default MouseScroll;
