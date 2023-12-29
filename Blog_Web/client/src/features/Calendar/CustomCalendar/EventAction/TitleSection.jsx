import React from 'react';
import useComponentVisible from '~/hooks/useComponentVisible';
import { cn, shouldShowError } from '~/utils';

const TitleSection = ({ event, setEvent, errors }) => {
  const [titleInputRef, isTitleInputFocused, setTitleInputFocused] =
    useComponentVisible(false);

  return (
    <div className="edit-tag__item">
      <p className="edit-tag__title">Event Title</p>
      <div className="social-input-title-text">
        <div
          onClick={() => setTitleInputFocused(true)}
          ref={titleInputRef}
          className={cn(
            'social-input-container',
            isTitleInputFocused && 'social-input-container--active',
            shouldShowError(errors, 'title', event.title) &&
              'social-input-container--error'
          )}
        >
          <input
            type="text"
            maxLength="48"
            placeholder="Please enter title (required)"
            value={event.title}
            onChange={(e) => setEvent({ ...event, title: e.target.value })}
          />
          <span className="count-tip">{event.title.length}/48</span>
        </div>
      </div>
      {shouldShowError(errors, 'title', event.title) &&
        errors['title']?.map((error, index) => (
          <p key={index} className="error-text font-normal">
            {error}
          </p>
        ))}
    </div>
  );
};

export default TitleSection;
