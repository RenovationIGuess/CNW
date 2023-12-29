import React, { useState } from 'react';
import { AiOutlineBgColors } from 'react-icons/ai';
import useComponentVisible from '~/hooks/useComponentVisible';
import ColorPicker from '~/components/ColorPicker/ColorPicker';
import { Tooltip } from 'antd';
import { RiArrowDropRightLine } from 'react-icons/ri';

const ChangeTextBackgroundButton = ({ editor }) => {
  const [toolbarBgColorRef, isToolbarBgColorVisible, setToolbarBgColorVisible] =
    useComponentVisible(false, 'toolbar-bg-color');

  const [bgColor, setBgColor] = useState('#ffffff');

  const setTextBgColor = (colorCode) => {
    if (colorCode) {
      editor.chain().focus().setHighlight({ color: colorCode }).run();
    } else editor.chain().focus().setHighlight({ color: bgColor }).run();
    // setToolbarBgColorVisible(false);
  };

  const unsetBgColor = () => {
    editor.chain().focus().unsetHighlight().run();
    setBgColor('#ffffff');
    // setToolbarBgColorVisible(false);
  };

  return (
    <>
      <div className="toolbar-item toolbar-bg-color">
        <Tooltip
          placement="top"
          title={'Change text background color'}
          arrow={false}
        >
          <button
            className="tool-button"
            ref={toolbarBgColorRef}
            onClick={() => setToolbarBgColorVisible((prev) => !prev)}
          >
            <AiOutlineBgColors className="editor-icon" />
            <RiArrowDropRightLine className="editor-icon formats-list" />
          </button>
        </Tooltip>
        {isToolbarBgColorVisible && (
          <div className="toolbar-list editor-tool-popup toolbar-list--color">
            <ColorPicker
              color={bgColor}
              setColor={setBgColor}
              setTextColor={setTextBgColor}
              unsetTextColor={unsetBgColor}
              type={'background'}
              editor={editor}
              setToolbarColorVisible={setToolbarBgColorVisible}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ChangeTextBackgroundButton;
