import React, { useState } from 'react';
import { AiOutlineBgColors } from 'react-icons/ai';
import ColorPicker from '~/components/ColorPicker/ColorPicker';
import { Popover, Tooltip } from 'antd';
import { RiArrowDropRightLine } from 'react-icons/ri';

const ChangeTextBackgroundButton = ({ editor }) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const [bgColor, setBgColor] = useState('#ffffff');

  const setTextBgColor = (colorCode) => {
    if (colorCode) {
      editor.chain().focus().setHighlight({ color: colorCode }).run();
    } else editor.chain().focus().setHighlight({ color: bgColor }).run();
  };

  const unsetBgColor = () => {
    editor.chain().focus().unsetHighlight().run();
    setBgColor('#ffffff');
  };

  return (
    <>
      <div className="toolbar-item toolbar-bg-color">
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
                color={bgColor}
                setColor={setBgColor}
                setTextColor={setTextBgColor}
                unsetTextColor={unsetBgColor}
                type={'background'}
                editor={editor}
                setToolbarColorVisible={setPopoverOpen}
              />
            </div>
          }
        >
          <Tooltip
            placement="top"
            title={'Change text background color'}
            arrow={false}
          >
            <button className="tool-button">
              <AiOutlineBgColors className="editor-icon" />
              <RiArrowDropRightLine className="editor-icon formats-list" />
            </button>
          </Tooltip>
        </Popover>
      </div>
    </>
  );
};

export default ChangeTextBackgroundButton;
