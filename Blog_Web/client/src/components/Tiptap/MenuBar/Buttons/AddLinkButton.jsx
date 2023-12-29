import React, { useState } from 'react';
import useComponentVisible from '~/hooks/useComponentVisible';
import { AiOutlineLink } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';
import { Tooltip } from 'antd';
import { authFieldsCheck, cn } from '~/utils';

const AddLinkButton = ({ editor }) => {
  const [toolbarLinkRef, isToolbarLinkVisible, setToolbarLinkVisible] =
    useComponentVisible(false, 'toolbar-link');

  const [error, setError] = useState(false);

  // For links func
  const [urlLabel, setUrlLabel] = useState('');
  const [url, setUrl] = useState('');

  const setLink = (selectTextState) => {
    console.log(selectTextState);
    // If there is no selected text => true because we're using empty
    if (selectTextState) {
      editor.commands.insertContent(
        `
          <a
            target="_blank"
            rel="noopener noreferrer"
            href=${url}
          >
            ${urlLabel || url}
          </a>
        `,
        {
          parseOptions: {
            preserveWhitespace: false,
          },
        }
      );
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run();
    }
  };

  const handleCancel = () => {
    setUrl('');
    setUrlLabel('');
    setToolbarLinkVisible(false);
    setError(false);
  };

  return (
    <>
      <div className="toolbar-item toolbar-link">
        <Tooltip placement="top" title={'Insert links'} arrow={false}>
          <button
            ref={toolbarLinkRef}
            className={
              editor.isActive('link')
                ? 'tool-button--active tool-button'
                : 'tool-button'
            }
            onClick={() => {
              if (!isToolbarLinkVisible) setToolbarLinkVisible(true);
              else handleCancel();
            }}
          >
            <AiOutlineLink className="editor-icon" />
          </button>
        </Tooltip>
        {isToolbarLinkVisible && (
          <div
            className="toolbar-list editor-tool-popup"
            style={{ width: 300 }}
          >
            <header className="dialog-header dialog-header__left">
              <p className="dialog-title">Add Link</p>
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
                    : !authFieldsCheck.validateUrl(url) &&
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
        )}
      </div>
    </>
  );
};

export default AddLinkButton;
