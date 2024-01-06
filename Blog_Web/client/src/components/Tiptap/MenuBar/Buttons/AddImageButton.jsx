import { Popover, Tooltip } from 'antd';
import React, { useState } from 'react';
import { BsFillImageFill } from 'react-icons/bs';
import AddImagePopover from '../../Popovers/AddImagePopover';

const AddImageButton = ({ editor }) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const [error, setError] = useState(false);

  // For image inject
  const [imageUrl, setImageUrl] = useState('');

  const addImageThroughUrl = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
    }
  };

  const handleCancel = () => {
    setImageUrl('');
    setError(false);
    setPopoverOpen(false);
  };

  return (
    <>
      <div className="toolbar-item toolbar-image">
        <Popover
          rootClassName="custom-popover"
          placement="bottomLeft"
          arrow={false}
          trigger="click"
          open={popoverOpen}
          onOpenChange={() => setPopoverOpen(!popoverOpen)}
          content={
            <AddImagePopover
              error={error}
              setError={setError}
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
              addImageThroughUrl={addImageThroughUrl}
              handleCancel={handleCancel}
            />
          }
        >
          <Tooltip placement="top" title={'Insert Images'} arrow={false}>
            <button className={'tool-button'}>
              <BsFillImageFill className="editor-icon" />
            </button>
          </Tooltip>
        </Popover>
      </div>
    </>
  );
};

export default AddImageButton;
