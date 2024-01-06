import React from 'react';
import {
  BsListTask,
  BsTextIndentLeft,
  BsTextIndentRight,
} from 'react-icons/bs';
import { AiOutlineOrderedList, AiOutlineUnorderedList } from 'react-icons/ai';
import { Tooltip } from 'antd';
import InfoTooltip from '../MenuBar/Buttons/InfoTooltip/InfoTooltip';

const AddTextOrderPopover = ({ editor, setPopoverOpen }) => {
  return (
    <div className="tiptap-popover">
      <Tooltip
        placement="right"
        title={
          <InfoTooltip title={'Ordered list'} shortcut={'Ctrl + Shift + 7'} />
        }
        arrow={false}
        rootClassName="custom-tooltip"
      >
        <span
          className={
            editor.isActive('orderedList')
              ? 'toolbar-list__item toolbar-list__item--active'
              : 'toolbar-list__item'
          }
          onClick={() => {
            setPopoverOpen(false);
            editor.chain().focus().toggleOrderedList().run();
          }}
        >
          <AiOutlineOrderedList className="editor-icon" />
        </span>
      </Tooltip>
      <Tooltip
        placement="right"
        title={
          <InfoTooltip title={'Bullet list'} shortcut={'Ctrl + Shift + 8'} />
        }
        arrow={false}
        rootClassName="custom-tooltip"
      >
        <span
          className={
            editor.isActive('bulletList')
              ? 'toolbar-list__item toolbar-list__item--active'
              : 'toolbar-list__item'
          }
          onClick={() => {
            setPopoverOpen(false);
            editor.chain().focus().toggleBulletList().run();
          }}
        >
          <AiOutlineUnorderedList className="editor-icon" />
        </span>
      </Tooltip>
      <Tooltip
        placement="right"
        title={
          <InfoTooltip title={'Todos list'} shortcut={'Ctrl + Shift + 9'} />
        }
        arrow={false}
        rootClassName="custom-tooltip"
      >
        <span
          onClick={() => {
            setPopoverOpen(false);
            editor.chain().focus().toggleTaskList().run();
          }}
          className={
            editor.isActive('taskList')
              ? 'toolbar-list__item toolbar-list__item--active'
              : 'toolbar-list__item'
          }
        >
          <BsListTask className="editor-icon" />
        </span>
      </Tooltip>
      <Tooltip
        placement="right"
        title={<InfoTooltip title={'Indent left'} shortcut={'Tab'} />}
        arrow={false}
        rootClassName="custom-tooltip"
      >
        <span className="toolbar-list__item">
          <BsTextIndentLeft className="editor-icon" />
        </span>
      </Tooltip>
      <Tooltip
        placement="right"
        title={<InfoTooltip title={'Indent right'} shortcut={'Tab'} />}
        arrow={false}
        rootClassName="custom-tooltip"
      >
        <span className="toolbar-list__item">
          <BsTextIndentRight className="editor-icon" />
        </span>
      </Tooltip>
    </div>
  );
};

export default AddTextOrderPopover;
