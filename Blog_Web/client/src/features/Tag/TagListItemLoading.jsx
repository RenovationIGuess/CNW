import React from 'react';
import { BsTrash } from 'react-icons/bs';
import { TbEdit } from 'react-icons/tb';

const TagListItemLoading = () => {
  return (
    <li className={`tag-list__item`}>
      <div className="tag-wrapper">
        <span className="tag-name">
          <p className="skeleton skeleton-loading-height-20-width-60"></p>
        </span>
        <div className="tag-actions">
          <TbEdit className="icon" />
          <BsTrash className="icon" />
        </div>
      </div>
    </li>
  );
};

export default TagListItemLoading;
