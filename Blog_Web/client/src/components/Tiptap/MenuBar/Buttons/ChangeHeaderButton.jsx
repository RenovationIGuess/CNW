import React from 'react';
import useComponentVisible from '~/hooks/useComponentVisible';
import { CgFormatHeading } from 'react-icons/cg';
import { RiArrowDropRightLine } from 'react-icons/ri';
import { Tooltip } from 'antd';
import InfoTooltip from './InfoTooltip/InfoTooltip';

const headerList = [
  {
    name: 'Heading 1',
    level: 1,
  },
  {
    name: 'Heading 2',
    level: 2,
  },
  {
    name: 'Heading 3',
    level: 3,
  },
  {
    name: 'Heading 4',
    level: 4,
  },
  {
    name: 'Heading 5',
    level: 5,
  },
  {
    name: 'Heading 6',
    level: 6,
  },
];

const ChangeHeaderButton = ({ editor }) => {
  const [toolbarHeaderRef, isToolbarHeaderVisible, setToolbarHeaderVisible] =
    useComponentVisible(false, 'toolbar-header');

  return (
    <>
      <div className="toolbar-item toolbar-header">
        <Tooltip
          placement="top"
          title={
            <InfoTooltip title={'Headings'} shortcut={'Ctrl + Alt + [0 ⇀ 6]'} />
          }
          arrow={false}
          rootClassName="custom-tooltip"
        >
          <button
            className={
              editor.isActive('heading')
                ? 'tool-button tool-button--active'
                : 'tool-button'
            }
            onClick={() => setToolbarHeaderVisible((prev) => !prev)}
            ref={toolbarHeaderRef}
          >
            <CgFormatHeading className="editor-icon" />
            <RiArrowDropRightLine className="editor-icon formats-list" />
          </button>
        </Tooltip>
        {isToolbarHeaderVisible && (
          <div className="toolbar-list editor-tool-popup">
            <Tooltip
              placement="right"
              title={
                <InfoTooltip title={'Paragraph'} shortcut={'Ctrl + Alt + 0'} />
              }
              arrow={false}
              rootClassName="custom-tooltip"
            >
              <span
                onClick={() => {
                  editor.chain().focus().setParagraph().run();
                }}
                className="toolbar-list__item"
              >
                Paragraph
              </span>
            </Tooltip>
            {headerList.map((header, index) => (
              <Tooltip
                key={index}
                placement="right"
                title={
                  <InfoTooltip
                    title={header.name}
                    shortcut={`Ctrl + Alt + ${header.level}`}
                  />
                }
                arrow={false}
                rootClassName="custom-tooltip"
              >
                <span
                  onClick={() => {
                    editor
                      .chain()
                      .focus()
                      .toggleHeading({ level: header.level })
                      .run();
                  }}
                  className={
                    editor.isActive('heading', { level: header.level })
                      ? 'toolbar-list__item toolbar-list__item--active'
                      : 'toolbar-list__item'
                  }
                >
                  {header.name}
                </span>
              </Tooltip>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ChangeHeaderButton;
