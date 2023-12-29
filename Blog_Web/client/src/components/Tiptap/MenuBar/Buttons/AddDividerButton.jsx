import { Tooltip } from 'antd';
import React from 'react';
import { AiOutlineAppstoreAdd, AiOutlineDash } from 'react-icons/ai';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { RiArrowDropRightLine } from 'react-icons/ri';
import { images } from '~/constants';
import useComponentVisible from '~/hooks/useComponentVisible';

const AddDividerButton = ({ editor }) => {
  const [toolbarInsertRef, isToolbarInsertVisible, setToolbarInsertVisible] =
    useComponentVisible(false, 'toolbar-insert');

  const addDividerImage = (src) => {
    editor.commands.insertContent(
      `
      <img
        draggable="true"
        contenteditable="false"
        src=${src}
        class="auto-centered"
      />
    `,
      {
        parseOptions: {
          preserveWhitespace: false,
        },
      }
    );
  };

  return (
    <>
      <div className="toolbar-item toolbar-insert">
        <Tooltip placement="top" title={'Insert dividers'} arrow={false}>
          <button
            className="tool-button"
            onClick={() => setToolbarInsertVisible((prev) => !prev)}
            ref={toolbarInsertRef}
          >
            <AiOutlineAppstoreAdd className="editor-icon" />
            <RiArrowDropRightLine className="editor-icon formats-list" />
          </button>
        </Tooltip>

        {isToolbarInsertVisible && (
          <div className="toolbar-list editor-tool-popup">
            <div
              className="toolbar-list__item toolbar-insert-item toolbar-list__item--divider"
              // onClick={() => {
              //   setToolbarInsertVisible(false);
              //   editor.chain().focus().setHorizontalRule().run();
              // }}
            >
              <AiOutlineDash className="editor-icon" />
              <div className="item-name">Horizontal Line</div>
              <MdOutlineKeyboardArrowRight className="item-arrow" />
              <div className="divider-container">
                <div className="divider-box editor-tool-popup">
                  <div className="divider-box__list">
                    <div
                      className="divider-box__item"
                      onClick={() => {
                        addDividerImage(images.divider1);
                        setToolbarInsertVisible(false);
                      }}
                    >
                      <img src={images.divider1} alt="divider-type-1" />
                    </div>
                    <div
                      className="divider-box__item"
                      onClick={() => {
                        addDividerImage(images.divider2);
                        setToolbarInsertVisible(false);
                      }}
                    >
                      <img src={images.divider2} alt="divider-type-2" />
                    </div>
                    <div
                      className="divider-box__item"
                      onClick={() => {
                        addDividerImage(images.divider3);
                        setToolbarInsertVisible(false);
                      }}
                    >
                      <img src={images.divider3} alt="divider-type-3" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AddDividerButton;
