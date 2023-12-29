import React from 'react';
import IconSelector from '~/components/IconSelector/IconSelector';
import { Popover, Tooltip } from 'antd';
import { BsFillEmojiWinkFill } from 'react-icons/bs';

const EmojiButton = ({ editor }) => {
  return (
    <>
      <Popover
        rootClassName="custom-popover"
        placement="bottomLeft"
        trigger="click"
        content={
          <IconSelector
            callback={(icon) => {
              if (!editor) return;
              editor.commands.insertContent(icon);
            }}
          />
        }
      >
        <Tooltip placement="top" title={'Insert Emojis'} arrow={false}>
          <button className={'toolbar-emoticon toolbar-first tool-button'}>
            <BsFillEmojiWinkFill className="editor-icon" />
          </button>
        </Tooltip>
      </Popover>
    </>
  );
};

export default EmojiButton;
