import React, { useState } from 'react';
import useComponentVisible from '~/hooks/useComponentVisible';
import { AiOutlineFontColors } from 'react-icons/ai';
import ColorPicker from '~/components/ColorPicker/ColorPicker';
import { Tooltip } from 'antd';
import { RiArrowDropRightLine } from 'react-icons/ri';

const ChangeTextColorButton = ({ editor }) => {
  const [toolbarColorRef, isToolbarColorVisible, setToolbarColorVisible] =
    useComponentVisible(false, 'toolbar-color');

  const [color, setColor] = useState('#000000d9');

  const setTextColor = (colorCode) => {
    if (colorCode) {
      editor.chain().focus().setColor(colorCode).run();
    } else editor.chain().focus().setColor(color).run();
    // setToolbarColorVisible(false);
  };

  const unsetTextColor = () => {
    editor.chain().focus().unsetColor().run();
    setColor('#000000d9');
    // setToolbarColorVisible(false);
  };

  return (
    <>
      <div
        className="toolbar-item toolbar-color"
        // className={
        //   editor.isActive("underline")
        //     ? "tool-button tool-button--active"
        //     : "tool-button"
        // }
      >
        <Tooltip placement="top" title={'Change text color'} arrow={false}>
          <button
            className="tool-button"
            ref={toolbarColorRef}
            onClick={() => setToolbarColorVisible((prev) => !prev)}
          >
            <AiOutlineFontColors className="editor-icon" />
            <RiArrowDropRightLine className="editor-icon formats-list" />
          </button>
        </Tooltip>
        {isToolbarColorVisible && (
          <div className="toolbar-list editor-tool-popup toolbar-list--color">
            <ColorPicker
              color={color}
              setColor={setColor}
              setTextColor={setTextColor}
              unsetTextColor={unsetTextColor}
              type={'text'}
              editor={editor}
              setToolbarColorVisible={setToolbarColorVisible}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ChangeTextColorButton;
