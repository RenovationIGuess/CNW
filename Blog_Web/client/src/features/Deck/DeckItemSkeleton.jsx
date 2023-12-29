import React from 'react';

const DeckItemSkeleton = () => {
  return (
    <div className="deck-item">
      <div className="deck-item__header">
        <div className="deck-info">
          <div className="deck-icon__wrapper">
            <div className="skeleton-avatar skeleton"></div>
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <p className="skeleton h-[18px] w-[196px] rounded-[3px]"></p>
            <p className="skeleton h-[14px] w-[96px] mt-2 rounded-[3px]"></p>
          </div>
        </div>
      </div>

      {/* Streak section */}
      <div className="deck-item__header"></div>

      <div className="deck-item__header justify-end"></div>

      <div className="deck-item__footer"></div>

      {/* Last learn */}
      <div className="deck-item__footer"></div>

      <div className="deck-item__footer"></div>
    </div>
  );
};

export default DeckItemSkeleton;
