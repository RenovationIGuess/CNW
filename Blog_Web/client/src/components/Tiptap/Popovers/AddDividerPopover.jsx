import React from 'react';
import { AiOutlineDash } from 'react-icons/ai';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { images } from '~/constants';

const AddDividerPopover = ({ editor, addDividerImage, setPopoverOpen }) => {
  return (
    <div className="tiptap-popover">
      <div className="toolbar-list__item toolbar-insert-item toolbar-list__item--divider">
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
                  setPopoverOpen(false);
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
                  setPopoverOpen(false);
                }}
              >
                <img src={images.divider3} alt="divider-type-3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDividerPopover;
