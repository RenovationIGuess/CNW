import { Tooltip } from 'antd';
import React from 'react';

const OtherTools = () => {
  return (
    <div className="other-tools-container">
      <Tooltip placement="top" title="Add">
        <div className="other-tools__item"></div>
      </Tooltip>
    </div>
  );
};

export default OtherTools;
