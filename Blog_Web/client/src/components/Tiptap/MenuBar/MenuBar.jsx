import React from 'react';
import { BsSuperscript, BsSubscript, BsQuote } from 'react-icons/bs';
import { BiCodeBlock } from 'react-icons/bi';
import {
  AiOutlineBold,
  AiOutlineItalic,
  AiOutlineUnderline,
  AiOutlineStrikethrough,
  AiOutlineEnter,
} from 'react-icons/ai';
import { MdLayersClear, MdOutlineCode } from 'react-icons/md';
import FontFamilyButton from './Buttons/FontFamilyButton';
import EmojiButton from './Buttons/EmojiButton';
import AddImageButton from './Buttons/AddImageButton';
import AddLinkButton from './Buttons/AddLinkButton';
import AddYoutubeVideoButton from './Buttons/AddYoutubeVideoButton';
import AddDividerButton from './Buttons/AddDividerButton';
import FontSizeButton from './Buttons/FontSizeButton';
import ChangeTextColorButton from './Buttons/ChangeTextColorButton';
import ChangeHeaderButton from './Buttons/ChangeHeaderButton';
import ChangeTextAlignButton from './Buttons/ChangeTextAlignButton';
import AddTextOrderButton from './Buttons/AddTextOrderButton';
import HistoryButtons from './Buttons/HistoryButtons';
import ChangeTextBackgroundButton from './Buttons/ChangeTextBackgroundButton';
import { Tooltip } from 'antd';
import InfoTooltip from './Buttons/InfoTooltip/InfoTooltip';
import { FaRemoveFormat } from 'react-icons/fa';
import ExportToPDFButton from './Buttons/ExportToPDFButton';
import AddPaperButton from './Buttons/AddPaperButton';
import AddTOCButton from './Buttons/AddTOCButton';
import AddDraggableButton from './Buttons/AddDraggableButton';
import AddTableButton from './Buttons/AddTableButton';
// import ExportToPDFButton from './Buttons/ExportToPDFButton';

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div id="toolbar" className="editor-toolbar">
      {/* Font Family */}
      <FontFamilyButton editor={editor} />

      {/* History */}
      <HistoryButtons editor={editor} />

      {/* Emoji */}
      <EmojiButton editor={editor} />

      {/* Images */}
      <AddImageButton editor={editor} />

      {/* Youtube */}
      <AddYoutubeVideoButton editor={editor} />

      {/* Links */}
      <AddLinkButton editor={editor} />

      {/* Divider */}
      <AddDividerButton editor={editor} />

      {/* Bold text */}
      <Tooltip
        placement="top"
        title={<InfoTooltip title={'Bold'} shortcut={'Ctrl + B'} />}
        arrow={false}
        rootClassName="custom-tooltip"
      >
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={
            editor.isActive('bold')
              ? 'tool-button tool-button--active'
              : 'tool-button'
          }
        >
          <AiOutlineBold className="editor-icon" />
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
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={
            editor.isActive('italic')
              ? 'tool-button tool-button--active'
              : 'tool-button'
          }
        >
          <AiOutlineItalic className="editor-icon" />
        </button>
      </Tooltip>

      {/* Strike */}
      <Tooltip
        placement="top"
        title={<InfoTooltip title={'Strike'} shortcut={'Ctrl + Shift + X'} />}
        arrow={false}
        rootClassName="custom-tooltip"
      >
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={
            editor.isActive('strike')
              ? 'tool-button tool-button--active'
              : 'tool-button'
          }
        >
          <AiOutlineStrikethrough className="editor-icon" />
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
          className={
            editor.isActive('underline')
              ? 'tool-button tool-button--active'
              : 'tool-button'
          }
        >
          <AiOutlineUnderline className="editor-icon" />
        </button>
      </Tooltip>

      <FontSizeButton editor={editor} />
      <ChangeTextColorButton editor={editor} />
      <ChangeTextBackgroundButton editor={editor} />

      {/* Code */}
      <Tooltip
        placement="top"
        title={<InfoTooltip title={'Code block'} shortcut={'Ctrl + Alt + C'} />}
        arrow={false}
        rootClassName="custom-tooltip"
      >
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          // disabled={!editor.can().chain().focus().toggleCode().run()}
          className={
            editor.isActive('code')
              ? 'tool-button tool-button--active'
              : 'tool-button'
          }
        >
          <MdOutlineCode className="editor-icon" />
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
          className={
            editor.isActive('codeBlock')
              ? 'tool-button tool-button--active'
              : 'tool-button'
          }
        >
          <BiCodeBlock className="editor-icon" />
        </button>
      </Tooltip>

      <ChangeHeaderButton editor={editor} />
      <ChangeTextAlignButton editor={editor} />
      <AddTextOrderButton editor={editor} />

      {/* Subscript */}
      <Tooltip
        placement="top"
        title={<InfoTooltip title={'Subscript'} shortcut={'Ctrl + ,'} />}
        arrow={false}
        rootClassName="custom-tooltip"
      >
        <button
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          className={
            editor.isActive('subscript')
              ? 'tool-button tool-button--active'
              : 'tool-button'
          }
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
          className={
            editor.isActive('superscript')
              ? 'tool-button tool-button--active'
              : 'tool-button'
          }
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
          className={
            editor.isActive('blockquote')
              ? 'tool-button tool-button--active'
              : 'tool-button'
          }
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
          className="tool-button"
          onClick={() => editor.chain().focus().setHardBreak().run()}
        >
          <AiOutlineEnter className="editor-icon" />
        </button>
      </Tooltip>

      {/* Clear marks - text style */}
      <Tooltip placement="top" title="Clear all applied styles">
        <button
          className={'tool-button'}
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
        >
          <FaRemoveFormat className="editor-icon" />
        </button>
      </Tooltip>

      {/* Clear nodes - text type */}
      <Tooltip placement="top" title="Turn into a normal paragraph">
        <button
          className={'tool-button'}
          onClick={() => editor.chain().focus().clearNodes().run()}
        >
          <MdLayersClear className="editor-icon" />
        </button>
      </Tooltip>

      {/* Export to PDF */}
      <ExportToPDFButton editor={editor} />

      {/* Add Draggable Item */}
      <AddDraggableButton editor={editor} />

      {/* Add Paper */}
      <AddPaperButton editor={editor} />

      {/* Add TOC */}
      <AddTOCButton editor={editor} />

      {/* Add table */}
      <AddTableButton editor={editor} />
    </div>
  );
};

export default MenuBar;
