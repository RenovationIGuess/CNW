import React from 'react';
import AddDividerButton from '../MenuBar/Buttons/AddDividerButton';
import AddLinkButton from '../MenuBar/Buttons/AddLinkButton';
import AddYoutubeVideoButton from '../MenuBar/Buttons/AddYoutubeVideoButton';
import AddImageButton from '../MenuBar/Buttons/AddImageButton';
import EmojiButton from '../MenuBar/Buttons/EmojiButton';
import HistoryButtons from '../MenuBar/Buttons/HistoryButtons';
import { AiOutlineBold, AiOutlineItalic, AiOutlineStrikethrough, AiOutlineUnderline } from 'react-icons/ai';
import FontSizeButton from '../MenuBar/Buttons/FontSizeButton';
import ChangeTextColorButton from '../MenuBar/Buttons/ChangeTextColorButton';
import ChangeHeaderButton from '../MenuBar/Buttons/ChangeHeaderButton';
import ChangeTextAlignButton from '../MenuBar/Buttons/ChangeTextAlignButton';
import AddTextOrderButton from '../MenuBar/Buttons/AddTextOrderButton';
import ChangeTextBackgroundButton from '../MenuBar/Buttons/ChangeTextBackgroundButton';

const NewPostMenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div id="toolbar" className="editor-toolbar post-editor-toolbar">
      <HistoryButtons editor={editor} />
      <EmojiButton editor={editor} />
      <AddImageButton editor={editor} />
      <AddYoutubeVideoButton editor={editor} />
      <AddLinkButton editor={editor} />
      <AddDividerButton editor={editor} />

      {/* Bold text */}
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

      {/* Italic */}
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

      {/* Strike */}
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

      {/* Underline */}
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

      <FontSizeButton editor={editor} />
      <ChangeTextColorButton editor={editor} />
      <ChangeTextBackgroundButton editor={editor} />
      <ChangeHeaderButton editor={editor} />
      <ChangeTextAlignButton editor={editor} />
      <AddTextOrderButton editor={editor} />
    </div>
  );
};

export default NewPostMenuBar;
