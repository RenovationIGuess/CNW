import { Popover, Tooltip } from 'antd';
import React, { useState } from 'react';
import { AiOutlineUnorderedList } from 'react-icons/ai';
import { RiArrowDropRightLine } from 'react-icons/ri';
import InfoTooltip from './InfoTooltip/InfoTooltip';
import AddTextOrderPopover from '../../Popovers/AddTextOrderPopover';

const AddTextOrderButton = ({ editor }) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <>
      <div className="toolbar-item toolbar-lists">
        <Popover
          rootClassName="custom-popover"
          placement="bottomLeft"
          arrow={false}
          trigger="click"
          open={popoverOpen}
          onOpenChange={() => setPopoverOpen(!popoverOpen)}
          content={
            <AddTextOrderPopover
              editor={editor}
              setPopoverOpen={setPopoverOpen}
            />
          }
        >
          <Tooltip
            placement="top"
            title={
              <InfoTooltip title={'List'} shortcut={'Ctrl + Shift + [7 ⇀ 9]'} />
            }
            arrow={false}
            rootClassName="custom-tooltip"
          >
            <button className="tool-button">
              <AiOutlineUnorderedList className="editor-icon" />
              <RiArrowDropRightLine className="editor-icon formats-list" />
            </button>
          </Tooltip>
        </Popover>
      </div>
    </>
  );
};

export default AddTextOrderButton;
