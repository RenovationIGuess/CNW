import { Popover, Tooltip } from 'antd';
import React, { useState } from 'react';
import { RiArrowDownSFill } from 'react-icons/ri';
import FontFamilyPopover from '../../Popovers/FontFamilyPopover';

const FontFamilyButton = ({ editor }) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  // Font family
  const [fontFamily, setFontFamily] = useState('Roboto');

  return (
    <>
      <div className="toolbar-item toolbar-font-family">
        <Popover
          rootClassName="custom-popover"
          placement="bottomLeft"
          arrow={false}
          trigger="click"
          open={popoverOpen}
          onOpenChange={() => setPopoverOpen(!popoverOpen)}
          content={
            <FontFamilyPopover
              editor={editor}
              setPopoverOpen={setPopoverOpen}
              setFontFamily={setFontFamily}
            />
          }
        >
          <Tooltip placement="top" title={fontFamily} arrow={false}>
            <div className="editor-font-family-container">
              <div className="font-name">
                {fontFamily.length > 10
                  ? fontFamily.slice(0, 10) + '...'
                  : fontFamily}
              </div>
              <RiArrowDownSFill
                className={
                  popoverOpen
                    ? 'font-menu-arrow font-menu-arrow--active'
                    : 'font-menu-arrow'
                }
              />
            </div>
          </Tooltip>
        </Popover>
      </div>
    </>
  );
};

export default FontFamilyButton;
