import React from 'react';
import useComponentVisible from '~/hooks/useComponentVisible';
import { cn, shouldShowError } from '~/utils';

// Only use for title and description
const InputSection = ({
  item,
  setItem,
  field,
  title,
  placeholder,
  maxLength,
  errors,
}) => {
  const [inputRef, isInputFocused, setInputFocused] =
    useComponentVisible(false);

  return (
    <div className="edit-tag__item">
      <p className="edit-tag__title">{title}</p>
      <div className="social-input-title-text">
        <div
          onClick={() => setInputFocused(true)}
          ref={inputRef}
          className={cn(
            'social-input-container',
            isInputFocused && 'social-input-container--active',
            shouldShowError(errors, field, item[field]) &&
              'social-input-container--error'
          )}
        >
          <input
            type="text"
            maxLength={maxLength}
            placeholder={placeholder}
            value={item[field]}
            onChange={(e) =>
              field === 'title'
                ? setItem({ ...item, title: e.target.value })
                : setItem({ ...item, description: e.target.value })
            }
          />
          <span className="count-tip">
            {item[field].length}/{maxLength}
          </span>
        </div>
      </div>
      {shouldShowError(errors, field, item[field]) &&
        errors[field]?.map((error, index) => (
          <p key={index} className="error-text font-normal">
            {error}
          </p>
        ))}
    </div>
  );
};

export default InputSection;
