import React, { useState } from 'react';
import { AiOutlineLink } from 'react-icons/ai';
import { Popover, Tooltip } from 'antd';
import AddLinkPopover from '../../Popovers/AddLinkPopover';

const AddLinkButton = ({ editor }) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const [error, setError] = useState(false);

  // For links func
  const [urlLabel, setUrlLabel] = useState('');
  const [url, setUrl] = useState('');

  const setLink = (selectTextState) => {
    // console.log(selectTextState);
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
    setError(false);
    setPopoverOpen(false);
  };

  return (
    <>
      <div className="toolbar-item toolbar-link">
        <Popover
          rootClassName="custom-popover"
          placement="bottomLeft"
          arrow={false}
          trigger="click"
          open={popoverOpen}
          onOpenChange={() => setPopoverOpen(!popoverOpen)}
          content={
            <AddLinkPopover
              editor={editor}
              error={error}
              setError={setError}
              urlLabel={urlLabel}
              setUrlLabel={setUrlLabel}
              url={url}
              setUrl={setUrl}
              setLink={setLink}
              handleCancel={handleCancel}
            />
          }
        >
          <Tooltip placement="top" title={'Insert links'} arrow={false}>
            <button
              className={
                editor.isActive('link')
                  ? 'tool-button--active tool-button'
                  : 'tool-button'
              }
            >
              <AiOutlineLink className="editor-icon" />
            </button>
          </Tooltip>
        </Popover>
      </div>
    </>
  );
};

export default AddLinkButton;
