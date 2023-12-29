import React from 'react';

const DirectoryNoItem = ({ level }) => {
  return (
    <div
      className="elements-header disable-pointer-events"
      style={{ paddingLeft: level > 0 ? `${level * 24 + 4}px` : '12px' }}
    >
      <div className="sidebar-no-item">No data inside :/</div>
    </div>
  );
};

export default DirectoryNoItem;
