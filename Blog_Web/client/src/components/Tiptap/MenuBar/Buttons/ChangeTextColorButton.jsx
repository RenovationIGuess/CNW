import React, { useState } from 'react';
import { AiOutlineFontColors } from 'react-icons/ai';
import ColorPicker from '~/components/ColorPicker/ColorPicker';
import { Popover, Tooltip } from 'antd';
import { RiArrowDropRightLine } from 'react-icons/ri';

const ChangeTextColorButton = ({ editor }) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const [color, setColor] = useState('#000000d9');

  const setTextColor = (colorCode) => {
    if (colorCode) {
      editor.chain().focus().setColor(colorCode).run();
    } else editor.chain().focus().setColor(color).run();
  };

  const unsetTextColor = () => {
    editor.chain().focus().unsetColor().run();
    setColor('#000000d9');
  };

  return (
    <>
      <div className="toolbar-item toolbar-color">
        <Popover
          rootClassName="custom-popover"
          placement="bottomLeft"
          arrow={false}
          trigger="click"
          open={popoverOpen}
          onOpenChange={() => setPopoverOpen(!popoverOpen)}
          content={
            <div className="tiptap-popover px-3" style={{ width: '240px' }}>
              <ColorPicker
                color={color}
                setColor={setColor}
                setTextColor={setTextColor}
                unsetTextColor={unsetTextColor}
                type={'text'}
                editor={editor}
                setToolbarColorVisible={setPopoverOpen}
              />
            </div>
          }
        >
          <Tooltip placement="top" title={'Change text color'} arrow={false}>
            <button className="tool-button">
              <AiOutlineFontColors className="editor-icon" />
              <RiArrowDropRightLine className="editor-icon formats-list" />
            </button>
          </Tooltip>
        </Popover>
      </div>
    </>
  );
};

export default ChangeTextColorButton;
