import { Tooltip } from 'antd';
import React, { useState } from 'react';
import { BsYoutube } from 'react-icons/bs';
import { IoClose } from 'react-icons/io5';
import useComponentVisible from '~/hooks/useComponentVisible';
import { authFieldsCheck, cn } from '~/utils';

const AddYoutubeVideoButton = ({ editor }) => {
  const [toolbarYtbRef, isToolbarYtbVisible, setToolbarYtbVisible] =
    useComponentVisible(false, 'toolbar-youtube');

  const [error, setError] = useState(false);

  // For youtube inject
  const [ytbUrl, setYtbUrl] = useState('');

  const addYoutubeVideo = () => {
    if (ytbUrl) {
      editor.commands.setYoutubeVideo({
        src: ytbUrl,
      });
    }
  };

  const handleCancel = () => {
    setToolbarYtbVisible(false);
    setYtbUrl('');
    setError(false);
  };

  return (
    <>
      <div className="toolbar-item toolbar-youtube">
        <Tooltip placement="top" title={'Insert youtube videos'} arrow={false}>
          <button
            className={'tool-button'}
            ref={toolbarYtbRef}
            onClick={() => {
              if (!isToolbarYtbVisible) setToolbarYtbVisible(true);
              else handleCancel();
            }}
          >
            <BsYoutube className="editor-icon" />
          </button>
        </Tooltip>
        {isToolbarYtbVisible && (
          <div
            className="toolbar-list editor-tool-popup"
            style={{ width: 300 }}
          >
            <header className="dialog-header dialog-header__left">
              <p className="dialog-title">Upload Video</p>
              <div className="dialog-closed">
                <button
                  className="dialog-closed__button"
                  onClick={handleCancel}
                >
                  <IoClose className="icon-dialog__closed" />
                </button>
              </div>
            </header>
            <div className="dialog-body">
              <input
                className={cn(
                  'input-container',
                  error &&
                    (ytbUrl.length === 0 ||
                      !authFieldsCheck.validateYouTubeUrl(ytbUrl)) &&
                    'error-border-color'
                )}
                type="text"
                value={ytbUrl}
                onChange={(e) => setYtbUrl(e.target.value)}
                placeholder="Vui lòng nhập liên kết video YouTube"
              />
              <p className="error-text font-normal text-sm">
                {error &&
                  (ytbUrl.length === 0
                    ? 'URL cannot be empty'
                    : !authFieldsCheck.validateYouTubeUrl(ytbUrl) &&
                      'Has to be valid Youtube URL')}
              </p>
            </div>
            <footer className="dialog-footer">
              <div className="cancel-button" onClick={handleCancel}>
                <span>Cancel</span>
              </div>
              <div
                className="accept-button"
                onClick={() => {
                  if (authFieldsCheck.validateYouTubeUrl(ytbUrl)) {
                    addYoutubeVideo();
                    handleCancel();
                  } else setError(true);
                }}
              >
                <span>Confirm</span>
              </div>
            </footer>
          </div>
        )}
      </div>
    </>
  );
};

export default AddYoutubeVideoButton;
