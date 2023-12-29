import { Tooltip } from 'antd';
import React from 'react';
import InfoTooltip from './InfoTooltip/InfoTooltip';
import { BsCardHeading } from 'react-icons/bs';

const AddTOCButton = ({ editor }) => {
  const handleAddTOC = () => {
    editor.commands.insertContent(`<toc></toc>`);
  };

  return (
    <Tooltip
      placement="top"
      title={
        <InfoTooltip title={'Table Of Contents'} shortcut={'No shortcut'} />
      }
      arrow={false}
      rootClassName="custom-tooltip"
    >
      <button className="tool-button" onClick={handleAddTOC}>
        <BsCardHeading className="editor-icon" />
      </button>
    </Tooltip>
  );
};

export default AddTOCButton;
