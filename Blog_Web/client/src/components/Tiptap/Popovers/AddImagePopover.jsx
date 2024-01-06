import React from 'react';
import { IoClose } from 'react-icons/io5';
import { authFieldsCheck, cn } from '~/utils';

const AddImagePopover = ({
  error,
  setError,
  imageUrl,
  setImageUrl,
  addImageThroughUrl,
  handleCancel,
}) => {
  return (
    <div className="tiptap-popover" style={{ width: 300 }}>
      <header className="dialog-header dialog-header__left">
        <p className="dialog-title">Upload Image</p>
        <div className="dialog-closed">
          <button className="dialog-closed__button" onClick={handleCancel}>
            <IoClose className="icon-dialog__closed" />
          </button>
        </div>
      </header>
      <div className="dialog-body">
        <input
          className={cn(
            'input-container',
            error &&
              (imageUrl.length === 0 ||
                !authFieldsCheck.validateUrl(imageUrl)) &&
              'error-border-color'
          )}
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Vui lòng nhập liên kết ảnh"
        />
        <p className="error-text font-normal text-sm">
          {error &&
            (imageUrl.length === 0
              ? 'URL cannot be empty'
              : !authFieldsCheck.validateUrl(imageUrl) &&
                'Has to be valid URL')}
        </p>
      </div>
      <footer className="dialog-footer">
        <div className="cancel-button" onClick={handleCancel}>
          <span>Cancel</span>
        </div>
        <div
          className="accept-button"
          onClick={() => {
            if (authFieldsCheck.validateUrl(imageUrl)) {
              addImageThroughUrl();
              handleCancel();
            } else setError(true);
          }}
        >
          <span>Confirm</span>
        </div>
      </footer>
    </div>
  );
};

export default AddImagePopover;
