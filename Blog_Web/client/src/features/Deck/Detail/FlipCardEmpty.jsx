import React from 'react';
import { images } from '~/constants';
import { cn } from '~/utils';

const FlipCardEmpty = ({}) => {
  return (
    <div className={cn('fc-container')}>
      <div
        className={'fc-wrapper'}
        onClick={(e) => e.currentTarget.classList.toggle('fc-wrapper--flipped')}
      >
        <div className={cn('fc-front')}>
          {/* Card Content */}
          <div
            className={cn(
              'flex flex-col items-center justify-center relative flex-1 min-h-0 overflow-y-auto gap-4'
            )}
          >
            <img
              className="w-[224px] h-auto"
              alt="no-card"
              src={images.find_what}
            />
            <p>This deck has no cards inside, how about create some?</p>
          </div>
        </div>
        <div className={cn('fc-back')}>
          {/* Card Content */}
          <div className="flex flex-col items-center justify-center relative flex-1 min-h-0 overflow-y-auto gap-4">
            <img
              className="w-[224px] h-auto"
              alt="no-card"
              src={images.whats_there}
            />
            <p>
              Or instead of creating by yourself, consider to copy other people
              works {':)'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipCardEmpty;
