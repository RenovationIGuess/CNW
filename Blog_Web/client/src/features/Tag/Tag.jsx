import { Tooltip } from 'antd';
import React from 'react';
import { images } from '~/constants';

const Tag = ({
  tag,
  selectedTags,
  setSelectedTags,
  deletable,
  mouseEvent = true,
}) => {
  return (
    <Tooltip
      placement="top"
      title={tag.description ? tag.description : 'No description'}
    >
      <div
        className="status-tag"
        style={{
          color: tag.text_color,
          backgroundColor: tag.background_color,
        }}
      >
        <span>{tag.title}</span>
        {deletable && (
          <div
            className="delete-tag-icon"
            onClick={() =>
              mouseEvent &&
              setSelectedTags(selectedTags.filter((item) => item.id !== tag.id))
            }
          >
            <img
              className="img-icon"
              src={images.deleteiconblue}
              alt="delete-tag-icon"
            />
          </div>
        )}
      </div>
    </Tooltip>
  );
};

export default Tag;
