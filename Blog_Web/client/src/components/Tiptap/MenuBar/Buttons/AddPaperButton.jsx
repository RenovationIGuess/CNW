import { Tooltip } from 'antd';
import React from 'react';
import InfoTooltip from './InfoTooltip/InfoTooltip';
import { MdDraw } from 'react-icons/md';

const AddPaperButton = ({ editor }) => {
  const handleAddPaper = () => {};

  return (
    <Tooltip
      placement="top"
      title={<InfoTooltip title={'Drawable'} shortcut={'No shortcut'} />}
      arrow={false}
      rootClassName="custom-tooltip"
    >
      <button className="tool-button" onClick={handleAddPaper}>
        <MdDraw className="editor-icon" />
      </button>
    </Tooltip>
  );
};

export default AddPaperButton;
