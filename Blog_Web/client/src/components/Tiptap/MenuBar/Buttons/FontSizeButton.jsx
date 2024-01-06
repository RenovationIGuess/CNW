import { Popover, Tooltip } from 'antd';
import React, { useState } from 'react';
import { AiOutlineFontSize } from 'react-icons/ai';
import { RiArrowDropRightLine } from 'react-icons/ri';
import FontSizePopover from '../../Popovers/FontSizePopover';

const FontSizeButton = ({ editor }) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <>
      <div className="toolbar-item toolbar-font-size">
        <Popover
          rootClassName="custom-popover"
          placement="bottomLeft"
          arrow={false}
          trigger="click"
          open={popoverOpen}
          onOpenChange={() => setPopoverOpen(!popoverOpen)}
          content={
            <FontSizePopover editor={editor} setPopoverOpen={setPopoverOpen} />
          }
        >
          <Tooltip placement="top" title={'Change font size'} arrow={false}>
            <button className="tool-button">
              <AiOutlineFontSize className="editor-icon" />
              <RiArrowDropRightLine className="editor-icon formats-list" />
            </button>
          </Tooltip>
        </Popover>
      </div>
    </>
  );
};

export default FontSizeButton;
