import React, { useMemo, useRef, useState } from 'react';
import { cn } from '~/utils';

const NewFlashcardButton = ({ label, callback }) => {
  const [currentHoverX, setCurrentHoverX] = useState(0);
  const [currentHoverWidth, setCurrentHoverWidth] = useState(0);

  const labelRef = useRef();

  const labelRect = useMemo(() => {
    if (!labelRef.current)
      return {
        width: 0,
      };
    return labelRef.current.getBoundingClientRect();
  }, [labelRef.current]);

  const handleHovered = () => {
    const roundedValueWidth = Math.round(labelRect.width * 100) / 100;
    setCurrentHoverWidth(roundedValueWidth);
    setCurrentHoverX(0);
  };

  const handleUnhovered = () => {
    setCurrentHoverX(0);
    setCurrentHoverWidth(0);
  };

  return (
    <div
      className="new-fc-btn__container"
      onMouseOver={() => handleHovered()}
      onMouseOut={() => handleUnhovered()}
      onClick={() => callback()}
    >
      <div className="flex items-center px-6 h-[72px]">
        <p className="new-fc-btn__label ">{label}</p>
        <div className="flex-1 min-w-0 flex items-center justify-center">
          <div
            className="header__left"
            style={{
              '--ind-x': currentHoverX,
              '--ind-width': currentHoverWidth,
            }}
          >
            <div className="header-tab-wrapper relative">
              <div
                className={cn('header-tab mr-6')}
                ref={labelRef}
                data-active={'new-flashcard-btn'}
              >
                <p data-query={'new-flashcard-btn'} className="header-tab-name">
                  + ADD FLASHCARD
                </p>
              </div>
              <div className="tab-underline"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewFlashcardButton;
