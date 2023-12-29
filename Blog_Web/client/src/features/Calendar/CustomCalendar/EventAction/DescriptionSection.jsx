import React from 'react';
import useComponentVisible from '~/hooks/useComponentVisible';

const DescriptionSection = ({ event, setEvent }) => {
  const [descInputRef, isDescInputFocused, setDescInputFocused] =
    useComponentVisible(false);

  return (
    <div className="edit-tag__item">
      <p className="edit-tag__title">Event Description</p>
      <div className="social-input-title-text">
        <div
          onClick={() => setDescInputFocused(true)}
          ref={descInputRef}
          className={`social-input-container${
            isDescInputFocused ? ' social-input-container--active' : ''
          }`}
        >
          <input
            type="text"
            maxLength="100"
            placeholder="Description..."
            value={event.description}
            onChange={(e) =>
              setEvent({ ...event, description: e.target.value })
            }
          />
          <span className="count-tip">{event.description.length}/100</span>
        </div>
      </div>
    </div>
  );
};

export default DescriptionSection;
