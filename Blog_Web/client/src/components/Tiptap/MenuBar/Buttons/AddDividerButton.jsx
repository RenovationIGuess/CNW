import { Popover, Tooltip } from 'antd';
import React, { useState } from 'react';
import { AiOutlineAppstoreAdd } from 'react-icons/ai';
import { RiArrowDropRightLine } from 'react-icons/ri';
import AddDividerPopover from '../../Popovers/AddDividerPopover';

const AddDividerButton = ({ editor }) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const addDividerImage = (src) => {
    editor.commands.insertContent(
      `
      <img
        draggable="true"
        contenteditable="false"
        src=${src}
        class="auto-centered"
      />
    `,
      {
        parseOptions: {
          preserveWhitespace: false,
        },
      }
    );
  };

  return (
    <>
      <div className="toolbar-item toolbar-insert">
        <Popover
          rootClassName="custom-popover"
          placement="bottomLeft"
          arrow={false}
          trigger="click"
          open={popoverOpen}
          onOpenChange={() => setPopoverOpen(!popoverOpen)}
          content={
            <AddDividerPopover
              editor={editor}
              addDividerImage={addDividerImage}
              setPopoverOpen={setPopoverOpen}
            />
          }
        >
          <Tooltip placement="top" title={'Insert dividers'} arrow={false}>
            <button className="tool-button">
              <AiOutlineAppstoreAdd className="editor-icon" />
              <RiArrowDropRightLine className="editor-icon formats-list" />
            </button>
          </Tooltip>
        </Popover>
      </div>
    </>
  );
};

export default AddDividerButton;
