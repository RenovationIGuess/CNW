import { Popover, Tooltip } from 'antd';
import React, { useState } from 'react';
import { AiOutlineAlignLeft } from 'react-icons/ai';
import { RiArrowDropRightLine } from 'react-icons/ri';
import InfoTooltip from './InfoTooltip/InfoTooltip';
import ChangeTextAlignPopover from '../../Popovers/ChangeTextAlignPopover';

const ChangeTextAlignButton = ({ editor }) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <>
      <div className="toolbar-item toolbar-align">
        <Popover
          rootClassName="custom-popover"
          placement="bottomLeft"
          arrow={false}
          trigger="click"
          open={popoverOpen}
          onOpenChange={() => setPopoverOpen(!popoverOpen)}
          content={
            <ChangeTextAlignPopover
              editor={editor}
              setPopoverOpen={setPopoverOpen}
            />
          }
        >
          <Tooltip
            placement="top"
            title={
              <InfoTooltip
                title={'Text align'}
                shortcut={'Ctrl + Shift + [LREJ] '}
              />
            }
            arrow={false}
            rootClassName="custom-tooltip"
          >
            <button className="tool-button">
              <AiOutlineAlignLeft className="editor-icon align-icon--rotate" />
              <RiArrowDropRightLine className="editor-icon formats-list" />
            </button>
          </Tooltip>
        </Popover>
      </div>
    </>
  );
};

export default ChangeTextAlignButton;
