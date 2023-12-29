import React, { useCallback, useEffect, useState } from 'react';
import { images } from '~/constants';
import { cn } from '~/utils';

const FloatMenu = ({ containerRef, showCreate, handleCreate }) => {
  const [showFloatMenu, setShowFloatMenu] = useState(false);

  useEffect(() => {
    const current = containerRef.current;

    if (!current) return;

    current.addEventListener('scroll', scrollEvent);

    return () => {
      current.removeEventListener('scroll', scrollEvent);
    };
  }, [containerRef.current]);

  const scrollEvent = useCallback(() => {
    if (!containerRef) return;

    if (containerRef.current.scrollTop > 80) {
      setShowFloatMenu(true);
    } else {
      setShowFloatMenu(false);
    }
  }, [containerRef.current]);

  return (
    <div className={cn('float-menu', !showFloatMenu && 'hidden')}>
      {showCreate && (
        <div className="float-menu-list">
          <div className="menu-list-container">
            <ul className="menu-list-wrapper"></ul>
            <li className="menu-btn" onClick={handleCreate}>
              <img className="img-icon" src={images.create} alt="create-btn" />
            </li>
          </div>
        </div>
      )}
      <div className="rocket">
        <div
          onClick={() => {
            if (containerRef.current) containerRef.current.scrollTop = 0;
          }}
          className={cn('rocket__rocket', 'rocket__rocket--visible')}
        >
          <img src={images.to_top} alt="to-top-btn" className="img-icon" />
        </div>
      </div>
    </div>
  );
};

export default FloatMenu;
