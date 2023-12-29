import { Tooltip } from 'antd';
import React from 'react';
import { AiOutlineRedo, AiOutlineUndo } from 'react-icons/ai';

const HistoryButtons = ({ editor }) => {
  return (
    <>
      <div className="editor-history-container">
        <Tooltip placement="top" title={'Undo'} arrow={false}>
          <div className="undo">
            <button
              className="tool-button undo-icon"
              aria-label="Undo - Ctrl + Z"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().chain().focus().undo().run()}
            >
              <AiOutlineUndo className="editor-icon" />
            </button>
          </div>
        </Tooltip>

        <Tooltip placement="top" title={'Redo'} arrow={false}>
          <div className="redo">
            <button
              className="tool-button redo-icon"
              aria-label="Redo - Ctrl + Shift + Z"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().chain().focus().redo().run()}
            >
              <AiOutlineRedo className="editor-icon" />
            </button>
          </div>
        </Tooltip>
      </div>
    </>
  );
};

export default HistoryButtons;
