import { Tooltip } from 'antd';
import React from 'react';
import { AiOutlineFontSize } from 'react-icons/ai';
import { RiArrowDropRightLine } from 'react-icons/ri';
import useComponentVisible from '~/hooks/useComponentVisible';

const FontSizeButton = ({ editor }) => {
  const [
    toolbarFontSizeRef,
    isToolbarFontSizeVisible,
    setToolbarFontSizeVisible,
  ] = useComponentVisible(false, 'toolbar-font-size');

  return (
    <>
      <div className="toolbar-item toolbar-font-size">
        <Tooltip placement="top" title={'Change font size'} arrow={false}>
          <button
            className="tool-button"
            ref={toolbarFontSizeRef}
            onClick={() => setToolbarFontSizeVisible((prev) => !prev)}
          >
            <AiOutlineFontSize className="editor-icon" />
            <RiArrowDropRightLine className="editor-icon formats-list" />
          </button>
        </Tooltip>
        {isToolbarFontSizeVisible && (
          <div className="toolbar-list editor-tool-popup toolbar-list--font-size">
            <span
              onClick={() => {
                setToolbarFontSizeVisible(false);
                editor.isActive('textStyle', { fontSize: '12px' })
                  ? editor.chain().focus().unsetFontSize().run()
                  : editor.chain().focus().setFontSize(12).run();
              }}
              className={
                editor.isActive('textStyle', { fontSize: '12px' })
                  ? 'toolbar-list__item toolbar-list__item--active'
                  : 'toolbar-list__item'
              }
            >
              12px
            </span>
            <span
              onClick={() => {
                setToolbarFontSizeVisible(false);
                editor.isActive('textStyle', { fontSize: '14px' })
                  ? editor.chain().focus().unsetFontSize().run()
                  : editor.chain().focus().setFontSize(14).run();
              }}
              className={
                editor.isActive('textStyle', { fontSize: '14px' })
                  ? 'toolbar-list__item toolbar-list__item--active'
                  : 'toolbar-list__item'
              }
            >
              14px
            </span>
            <span
              onClick={() => {
                setToolbarFontSizeVisible(false);
                editor.isActive('textStyle', { fontSize: '16px' })
                  ? editor.chain().focus().unsetFontSize().run()
                  : editor.chain().focus().setFontSize(16).run();
              }}
              className={
                editor.isActive('textStyle', { fontSize: '16px' })
                  ? 'toolbar-list__item toolbar-list__item--active'
                  : 'toolbar-list__item'
              }
            >
              16px
            </span>
            <span
              onClick={() => {
                setToolbarFontSizeVisible(false);
                editor.isActive('textStyle', { fontSize: '20px' })
                  ? editor.chain().focus().unsetFontSize().run()
                  : editor.chain().focus().setFontSize(20).run();
              }}
              className={
                editor.isActive('textStyle', { fontSize: '20px' })
                  ? 'toolbar-list__item toolbar-list__item--active'
                  : 'toolbar-list__item'
              }
            >
              20px
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default FontSizeButton;
