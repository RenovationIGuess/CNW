import React, { useState } from 'react';
import { CgFormatHeading } from 'react-icons/cg';
import { RiArrowDropRightLine } from 'react-icons/ri';
import { Popover, Tooltip } from 'antd';
import InfoTooltip from './InfoTooltip/InfoTooltip';
import ChangeHeaderPopover from '../../Popovers/ChangeHeaderPopover';

const ChangeHeaderButton = ({ editor }) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <>
      <div className="toolbar-item toolbar-header">
        <Popover
          rootClassName="custom-popover"
          placement="bottomLeft"
          arrow={false}
          trigger="click"
          open={popoverOpen}
          onOpenChange={() => setPopoverOpen(!popoverOpen)}
          content={
            <ChangeHeaderPopover
              editor={editor}
              setPopoverOpen={setPopoverOpen}
            />
          }
        >
          <Tooltip
            placement="top"
            title={
              <InfoTooltip
                title={'Headings'}
                shortcut={'Ctrl + Alt + [0 ⇀ 6]'}
              />
            }
            arrow={false}
            rootClassName="custom-tooltip"
          >
            <button
              className={
                editor.isActive('heading')
                  ? 'tool-button tool-button--active'
                  : 'tool-button'
              }
            >
              <CgFormatHeading className="editor-icon" />
              <RiArrowDropRightLine className="editor-icon formats-list" />
            </button>
          </Tooltip>
        </Popover>
      </div>
    </>
  );
};

export default ChangeHeaderButton;
