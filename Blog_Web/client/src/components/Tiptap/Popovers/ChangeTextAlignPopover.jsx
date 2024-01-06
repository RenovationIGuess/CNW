import React from 'react';
import {
  AiOutlineAlignCenter,
  AiOutlineAlignLeft,
  AiOutlineAlignRight,
} from 'react-icons/ai';
import { BsJustify } from 'react-icons/bs';
import { Tooltip } from 'antd';
import InfoTooltip from '../MenuBar/Buttons/InfoTooltip/InfoTooltip';

const ChangeTextAlignPopover = ({ editor, setPopoverOpen }) => {
  return (
    <div className="tiptap-popover">
      <Tooltip
        placement="right"
        title={
          <InfoTooltip
            title={'Text align left'}
            shortcut={'Ctrl + Shift + L'}
          />
        }
        arrow={false}
        rootClassName="custom-tooltip"
      >
        <span
          className={
            editor.isActive({ textAlign: 'left' })
              ? 'toolbar-list__item toolbar-list__item--active'
              : 'toolbar-list__item'
          }
          onClick={() => {
            setPopoverOpen(false);
            editor.chain().focus().setTextAlign('left').run();
          }}
        >
          <AiOutlineAlignLeft className="editor-icon" />
        </span>
      </Tooltip>
      <Tooltip
        placement="right"
        title={
          <InfoTooltip
            title={'Text align center'}
            shortcut={'Ctrl + Shift + E'}
          />
        }
        arrow={false}
        rootClassName="custom-tooltip"
      >
        <span
          className={
            editor.isActive({ textAlign: 'center' })
              ? 'toolbar-list__item toolbar-list__item--active'
              : 'toolbar-list__item'
          }
          onClick={() => {
            setPopoverOpen(false);
            editor.chain().focus().setTextAlign('center').run();
          }}
        >
          <AiOutlineAlignCenter className="editor-icon" />
        </span>
      </Tooltip>
      <Tooltip
        placement="right"
        title={
          <InfoTooltip
            title={'Text align right'}
            shortcut={'Ctrl + Shift + R'}
          />
        }
        arrow={false}
        rootClassName="custom-tooltip"
      >
        <span
          className={
            editor.isActive({ textAlign: 'right' })
              ? 'toolbar-list__item toolbar-list__item--active'
              : 'toolbar-list__item'
          }
          onClick={() => {
            setPopoverOpen(false);
            editor.chain().focus().setTextAlign('right').run();
          }}
        >
          <AiOutlineAlignRight className="editor-icon" />
        </span>
      </Tooltip>
      <Tooltip
        placement="right"
        title={
          <InfoTooltip
            title={'Text align justify'}
            shortcut={'Ctrl + Shift + J'}
          />
        }
        arrow={false}
        rootClassName="custom-tooltip"
      >
        <span
          className={
            editor.isActive({ textAlign: 'justify' })
              ? 'toolbar-list__item toolbar-list__item--active'
              : 'toolbar-list__item'
          }
          onClick={() => {
            setPopoverOpen(false);
            editor.chain().focus().setTextAlign('justify').run();
          }}
        >
          <BsJustify className="editor-icon" />
        </span>
      </Tooltip>
    </div>
  );
};

export default ChangeTextAlignPopover;
