import { Popover, Tooltip } from 'antd';
import React, { useState } from 'react';
import { BsYoutube } from 'react-icons/bs';
import AddYoutubeVideoPopover from '../../Popovers/AddYoutubeVideoPopover';

const AddYoutubeVideoButton = ({ editor }) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

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
    setYtbUrl('');
    setError(false);
    setPopoverOpen(false);
  };

  return (
    <>
      <div className="toolbar-item toolbar-youtube">
        <Popover
          rootClassName="custom-popover"
          placement="bottomLeft"
          arrow={false}
          trigger="click"
          open={popoverOpen}
          onOpenChange={() => setPopoverOpen(!popoverOpen)}
          content={
            <AddYoutubeVideoPopover
              error={error}
              setError={setError}
              ytbUrl={ytbUrl}
              setYtbUrl={setYtbUrl}
              addYoutubeVideo={addYoutubeVideo}
              handleCancel={handleCancel}
            />
          }
        >
          <Tooltip
            placement="top"
            title={'Insert youtube videos'}
            arrow={false}
          >
            <button className={'tool-button'}>
              <BsYoutube className="editor-icon" />
            </button>
          </Tooltip>
        </Popover>
      </div>
    </>
  );
};

export default AddYoutubeVideoButton;
