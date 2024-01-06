import React from 'react';
import { Tooltip } from 'antd';
import InfoTooltip from '../MenuBar/Buttons/InfoTooltip/InfoTooltip';

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

const ChangeHeaderPopover = ({ editor, setPopoverOpen }) => {
  return (
    <div className="tiptap-popover">
      <Tooltip
        placement="right"
        title={<InfoTooltip title={'Paragraph'} shortcut={'Ctrl + Alt + 0'} />}
        arrow={false}
        rootClassName="custom-tooltip"
      >
        <span
          onClick={() => {
            editor.chain().focus().setParagraph().run();
            setPopoverOpen(false);
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
              setPopoverOpen(false);
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
  );
};

export default ChangeHeaderPopover;
