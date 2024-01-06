import React from 'react';
import { IoClose } from 'react-icons/io5';
import { authFieldsCheck, cn } from '~/utils';

const AddLinkPopover = ({
  editor,
  error,
  setError,
  urlLabel,
  setUrlLabel,
  url,
  setUrl,
  setLink,
  handleCancel,
}) => {
  return (
    <div className="tiptap-popover" style={{ width: 300 }}>
      <header className="dialog-header dialog-header__left">
        <p className="dialog-title">Add Link</p>
        <div className="dialog-closed">
          <button className="dialog-closed__button" onClick={handleCancel}>
            <IoClose className="icon-dialog__closed" />
          </button>
        </div>
      </header>
      <div className="dialog-body">
        {editor.view.state.selection.empty && (
          <input
            className="input-container"
            type="text"
            value={urlLabel}
            onChange={(e) => setUrlLabel(e.target.value)}
            placeholder="Nhập văn bản mô tả liên kết"
          />
        )}
        <input
          className={cn(
            'input-container',
            error &&
              (url.length === 0 || !authFieldsCheck.validateUrl(url)) &&
              'error-border-color'
          )}
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Dán / nhập liên kết bắt đầu bằng https"
        />
        <p className="error-text font-normal text-sm">
          {error &&
            (url.length === 0
              ? 'URL cannot be empty'
              : !authFieldsCheck.validateUrl(url) && 'Has to be valid URL')}
        </p>
      </div>
      <footer className="dialog-footer">
        <div className="cancel-button" onClick={handleCancel}>
          <span>Cancel</span>
        </div>
        <div
          className="accept-button"
          onClick={() => {
            if (authFieldsCheck.validateUrl(url)) {
              setLink(editor.view.state.selection.empty);
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

export default AddLinkPopover;
