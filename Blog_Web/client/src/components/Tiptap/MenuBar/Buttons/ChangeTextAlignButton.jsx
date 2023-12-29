import { Tooltip } from 'antd';
import React from 'react';
import {
  AiOutlineAlignCenter,
  AiOutlineAlignLeft,
  AiOutlineAlignRight,
} from 'react-icons/ai';
import { BsJustify } from 'react-icons/bs';
import { RiArrowDropRightLine } from 'react-icons/ri';
import useComponentVisible from '~/hooks/useComponentVisible';
import InfoTooltip from './InfoTooltip/InfoTooltip';

const ChangeTextAlignButton = ({ editor }) => {
  const [toolbarAlignRef, isToolbarAlignVisible, setToolbarAlignVisible] =
    useComponentVisible(false, 'toolbar-align');

  return (
    <>
      <div className="toolbar-item toolbar-align">
        <Tooltip
          placement="top"
          title={
            <InfoTooltip
              title={'Text align'}
              shortcut={'Ctrl + Shift + [LREJ] '}
            />
          }
          arrow={false}
          rootClassName="custom-tooltip"
        >
          <button
            className="tool-button"
            onClick={() => setToolbarAlignVisible((prev) => !prev)}
            ref={toolbarAlignRef}
          >
            <AiOutlineAlignLeft className="editor-icon align-icon--rotate" />
            <RiArrowDropRightLine className="editor-icon formats-list" />
          </button>
        </Tooltip>
        {isToolbarAlignVisible && (
          <div className="toolbar-list editor-tool-popup">
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
                  setToolbarAlignVisible(false);
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
                  setToolbarAlignVisible(false);
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
                  setToolbarAlignVisible(false);
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
                  setToolbarAlignVisible(false);
                  editor.chain().focus().setTextAlign('justify').run();
                }}
              >
                <BsJustify className="editor-icon" />
              </span>
            </Tooltip>
          </div>
        )}
      </div>
    </>
  );
};

export default ChangeTextAlignButton;
