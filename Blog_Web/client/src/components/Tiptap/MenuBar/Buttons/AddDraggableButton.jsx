import { Tooltip } from 'antd';
import React from 'react';
import InfoTooltip from './InfoTooltip/InfoTooltip';
import { MdOutlineDragIndicator } from 'react-icons/md';

const AddDraggableButton = ({ editor }) => {
  const handleAddDraggable = () => {
    editor
      .chain()
      .focus()
      .insertContent({
        type: 'draggableItem',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Default content',
              },
            ],
          },
        ],
      })
      .run();
  };

  return (
    <Tooltip
      placement="top"
      title={
        <InfoTooltip title={'Add Draggable Item'} shortcut={'No shortcut'} />
      }
      arrow={false}
      rootClassName="custom-tooltip"
    >
      <button className="tool-button" onClick={handleAddDraggable}>
        <MdOutlineDragIndicator className="editor-icon" />
      </button>
    </Tooltip>
  );
};

export default AddDraggableButton;
