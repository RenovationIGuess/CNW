import { Tooltip } from 'antd';
import React from 'react';
import {
  AiOutlineBold,
  AiOutlineEnter,
  AiOutlineItalic,
  AiOutlineStrikethrough,
  AiOutlineUnderline,
} from 'react-icons/ai';
import { BiCodeBlock } from 'react-icons/bi';
import { BsQuote, BsSubscript, BsSuperscript } from 'react-icons/bs';
import { MdLayersClear, MdOutlineCode } from 'react-icons/md';
import InfoTooltip from '../MenuBar/Buttons/InfoTooltip/InfoTooltip';
import { FaRemoveFormat } from 'react-icons/fa';

const CustomBubbleMenu = ({ editor }) => {
  return (
    <>
      <div className="tool-tips bubble-menu" id="custom-bubble-menu">
        <div className="tool-tips__content">
          {/* Bold */}
          <Tooltip
            placement="top"
            title={<InfoTooltip title={'Bold'} shortcut={'Ctrl + B'} />}
            arrow={false}
            rootClassName="custom-tooltip"
          >
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`button-icon${
                editor.isActive('bold') ? ' button-icon--active' : ''
              }`}
            >
              <AiOutlineBold />
            </button>
          </Tooltip>

          {/* Italic */}
          <Tooltip
            placement="top"
            title={<InfoTooltip title={'Italic'} shortcut={'Ctrl + I'} />}
            arrow={false}
            rootClassName="custom-tooltip"
          >
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`button-icon${
                editor.isActive('italic') ? ' button-icon--active' : ''
              }`}
            >
              <AiOutlineItalic />
            </button>
          </Tooltip>

          {/* Strike */}
          <Tooltip
            placement="top"
            title={
              <InfoTooltip title={'Strike'} shortcut={'Ctrl + Shift + X'} />
            }
            arrow={false}
            rootClassName="custom-tooltip"
          >
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`button-icon${
                editor.isActive('strike') ? ' button-icon--active' : ''
              }`}
            >
              <AiOutlineStrikethrough />
            </button>
          </Tooltip>

          {/* Underline */}
          <Tooltip
            placement="top"
            title={<InfoTooltip title={'Underline'} shortcut={'Ctrl + U'} />}
            arrow={false}
            rootClassName="custom-tooltip"
          >
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              // disabled={!editor.can().chain().focus().toggleUnderline().run()}
              className={`button-icon${
                editor.isActive('underline') ? ' button-icon--active' : ''
              }`}
            >
              <AiOutlineUnderline />
            </button>
          </Tooltip>

          {/* Code */}
          <Tooltip
            placement="top"
            title={
              <InfoTooltip title={'Code block'} shortcut={'Ctrl + Alt + C'} />
            }
            arrow={false}
            rootClassName="custom-tooltip"
          >
            <button
              onClick={() => editor.chain().focus().toggleCode().run()}
              // disabled={!editor.can().chain().focus().toggleCode().run()}
              className={`button-icon${
                editor.isActive('code') ? ' button-icon--active' : ''
              }`}
            >
              <MdOutlineCode />
            </button>
          </Tooltip>

          {/* Code block */}
          <Tooltip
            placement="top"
            title={
              <InfoTooltip
                title={'Code block lowlight'}
                shortcut={'Ctrl + Alt + C'}
              />
            }
            arrow={false}
            rootClassName="custom-tooltip"
          >
            <button
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={`button-icon${
                editor.isActive('codeBlock') ? ' button-icon--active' : ''
              }`}
            >
              <BiCodeBlock />
            </button>
          </Tooltip>

          {/* Subscript */}
          <Tooltip
            placement="top"
            title={<InfoTooltip title={'Subscript'} shortcut={'Ctrl + ,'} />}
            arrow={false}
            rootClassName="custom-tooltip"
          >
            <button
              onClick={() => editor.chain().focus().toggleSubscript().run()}
              className={`button-icon${
                editor.isActive('subscript') ? ' button-icon--active' : ''
              }`}
            >
              <BsSubscript className="editor-icon" />
            </button>
          </Tooltip>

          {/* Superscript */}
          <Tooltip
            placement="top"
            title={<InfoTooltip title={'Superscript'} shortcut={'Ctrl + .'} />}
            arrow={false}
            rootClassName="custom-tooltip"
          >
            <button
              onClick={() => editor.chain().focus().toggleSuperscript().run()}
              className={`button-icon${
                editor.isActive('superscript') ? ' button-icon--active' : ''
              }`}
            >
              <BsSuperscript className="editor-icon" />
            </button>
          </Tooltip>

          {/* Blockquote */}
          <Tooltip
            placement="top"
            title={
              <InfoTooltip
                title={'Code block lowlight'}
                shortcut={'Ctrl + Shift + B'}
              />
            }
            arrow={false}
            rootClassName="custom-tooltip"
          >
            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`button-icon${
                editor.isActive('blockquote') ? ' button-icon--active' : ''
              }`}
            >
              <BsQuote className="editor-icon" />
            </button>
          </Tooltip>

          {/* Hard break */}
          <Tooltip
            placement="top"
            title={<InfoTooltip title={'Hard break'} shortcut={'Enter'} />}
            arrow={false}
            rootClassName="custom-tooltip"
          >
            <button
              className="button-icon"
              onClick={() => editor.chain().focus().setHardBreak().run()}
            >
              <AiOutlineEnter className="editor-icon" />
            </button>
          </Tooltip>

          {/* Clear marks - text style */}
          <Tooltip placement="top" title="Clear all applied styles">
            <button
              className="button-icon"
              onClick={() => editor.chain().focus().unsetAllMarks().run()}
            >
              <FaRemoveFormat className="editor-icon" />
            </button>
          </Tooltip>

          {/* Clear nodes - text type */}
          <Tooltip placement="top" title="Turn into a normal paragraph">
            <button
              className="button-icon"
              onClick={() => editor.chain().focus().clearNodes().run()}
            >
              <MdLayersClear className="editor-icon" />
            </button>
          </Tooltip>
        </div>
      </div>
    </>
  );
};

export default CustomBubbleMenu;
