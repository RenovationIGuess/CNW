import { Tooltip } from 'antd';
import React from 'react';
import { AiOutlineOrderedList, AiOutlineUnorderedList } from 'react-icons/ai';
import {
  BsListTask,
  BsTextIndentLeft,
  BsTextIndentRight,
} from 'react-icons/bs';
import { RiArrowDropRightLine } from 'react-icons/ri';
import useComponentVisible from '~/hooks/useComponentVisible';
import InfoTooltip from './InfoTooltip/InfoTooltip';

const AddTextOrderButton = ({ editor }) => {
  const [toolbarListRef, isToolbarListVisible, setToolbarListVisible] =
    useComponentVisible(false, 'toolbar-lists');

  return (
    <>
      <div className="toolbar-item toolbar-lists">
        <Tooltip
          placement="top"
          title={
            <InfoTooltip title={'List'} shortcut={'Ctrl + Shift + [7 ⇀ 9]'} />
          }
          arrow={false}
          rootClassName="custom-tooltip"
        >
          <button
            className="tool-button"
            onClick={() => setToolbarListVisible((prev) => !prev)}
            ref={toolbarListRef}
          >
            <AiOutlineUnorderedList className="editor-icon" />
            <RiArrowDropRightLine className="editor-icon formats-list" />
          </button>
        </Tooltip>
        {isToolbarListVisible && (
          <div className="toolbar-list editor-tool-popup">
            <Tooltip
              placement="right"
              title={
                <InfoTooltip
                  title={'Ordered list'}
                  shortcut={'Ctrl + Shift + 7'}
                />
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
                  setToolbarListVisible(false);
                  editor.chain().focus().toggleOrderedList().run();
                }}
              >
                <AiOutlineOrderedList className="editor-icon" />
              </span>
            </Tooltip>
            <Tooltip
              placement="right"
              title={
                <InfoTooltip
                  title={'Bullet list'}
                  shortcut={'Ctrl + Shift + 8'}
                />
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
                  setToolbarListVisible(false);
                  editor.chain().focus().toggleBulletList().run();
                }}
              >
                <AiOutlineUnorderedList className="editor-icon" />
              </span>
            </Tooltip>
            <Tooltip
              placement="right"
              title={
                <InfoTooltip
                  title={'Todos list'}
                  shortcut={'Ctrl + Shift + 9'}
                />
              }
              arrow={false}
              rootClassName="custom-tooltip"
            >
              <span
                onClick={() => {
                  setToolbarListVisible(false);
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
        )}
      </div>
    </>
  );
};

export default AddTextOrderButton;
