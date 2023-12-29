import React from 'react';

import {
  BsFillEmojiWinkFill,
  BsFillImageFill,
  BsYoutube,
  BsSuperscript,
  BsSubscript,
  BsQuote,
} from 'react-icons/bs';
import { BiCodeBlock } from 'react-icons/bi';
import {
  AiOutlineUndo,
  AiOutlineRedo,
  AiOutlineAppstoreAdd,
  AiOutlineBold,
  AiOutlineItalic,
  AiOutlineUnderline,
  AiOutlineStrikethrough,
  AiOutlineUnorderedList,
  AiOutlineAlignLeft,
  AiOutlineFontColors,
  AiOutlineBgColors,
  AiOutlineLink,
  AiOutlineEnter,
  AiOutlineFontSize,
} from 'react-icons/ai';
import { RiArrowDropRightLine, RiArrowDownSFill } from 'react-icons/ri';
import { MdOutlineCode } from 'react-icons/md';
import { CgFormatHeading } from 'react-icons/cg';

const TiptapSkeletonLoading = () => {
  return (
    <div className="editor-container">
      <div id="toolbar" className="editor-toolbar">
        <div className="toolbar-item toolbar-font-family">
          <div className="editor-font-family-container">
            <div className="font-name">Roboto</div>
            <RiArrowDownSFill className={'font-menu-arrow'} />
          </div>
        </div>
        <div className="editor-history-container">
          <div className="undo">
            <button className="tool-button undo-icon">
              <AiOutlineUndo className="editor-icon" />
            </button>
          </div>
          <div className="redo">
            <button className="tool-button redo-icon">
              <AiOutlineRedo className="editor-icon" />
            </button>
          </div>
        </div>

        <button className={'toolbar-emoticon toolbar-first tool-button'}>
          <BsFillEmojiWinkFill className="editor-icon" />
        </button>
        <div className="toolbar-item toolbar-image">
          <button className={'tool-button'}>
            <BsFillImageFill className="editor-icon" />
          </button>
        </div>
        <div className="toolbar-item toolbar-youtube">
          <button className={'tool-button'}>
            <BsYoutube className="editor-icon" />
          </button>
        </div>
        <div className="toolbar-item toolbar-link">
          <button className={'tool-button'}>
            <AiOutlineLink className="editor-icon" />
          </button>
        </div>
        <div className="toolbar-item toolbar-insert">
          <button className="tool-button">
            <AiOutlineAppstoreAdd className="editor-icon" />
            <RiArrowDropRightLine className="editor-icon formats-list" />
          </button>
        </div>
        <button className={'tool-button'}>
          <AiOutlineBold className="editor-icon" />
        </button>
        <button className={'tool-button'}>
          <AiOutlineItalic className="editor-icon" />
        </button>
        <button className={'tool-button'}>
          <AiOutlineStrikethrough className="editor-icon" />
        </button>
        <button className={'tool-button'}>
          <AiOutlineUnderline className="editor-icon" />
        </button>
        <div className="toolbar-item toolbar-font-size">
          <button className="tool-button">
            <AiOutlineFontSize className="editor-icon" />
          </button>
        </div>
        <div className="toolbar-item toolbar-color">
          <button className="tool-button">
            <AiOutlineFontColors className="editor-icon" />
          </button>
        </div>
        <div className="toolbar-item toolbar-bg-color">
          <button className="tool-button">
            <AiOutlineBgColors className="editor-icon" />
          </button>
        </div>
        <button className={'tool-button'}>
          <MdOutlineCode className="editor-icon" />
        </button>
        <button className={'tool-button'}>
          <BiCodeBlock className="editor-icon" />
        </button>

        <div className="toolbar-item toolbar-header">
          <button className={'tool-button'}>
            <CgFormatHeading className="editor-icon" />
            <RiArrowDropRightLine className="editor-icon formats-list" />
          </button>
        </div>
        <div className="toolbar-item toolbar-align">
          <button className="tool-button">
            <AiOutlineAlignLeft className="editor-icon align-icon--rotate" />
            <RiArrowDropRightLine className="editor-icon formats-list" />
          </button>
        </div>
        <div className="toolbar-item toolbar-lists">
          <button className="tool-button">
            <AiOutlineUnorderedList className="editor-icon" />
            <RiArrowDropRightLine className="editor-icon formats-list" />
          </button>
        </div>
        <button className={'tool-button'}>
          <BsSubscript className="editor-icon" />
        </button>
        <button className={'tool-button'}>
          <BsSuperscript className="editor-icon" />
        </button>
        <button className={'tool-button'}>
          <BsQuote className="editor-icon" />
        </button>
        <button className="tool-button">
          <AiOutlineEnter className="editor-icon" />
        </button>
      </div>

      <div className="flex flex-col gap-4 pt-4 px-6">
        <div className="skeleton-change-row skeleton"></div>
        <div className="skeleton-change-row skeleton"></div>
        <div className="skeleton-change-row-80 skeleton"></div>
      </div>
    </div>
  );
};

export default TiptapSkeletonLoading;
