import { Tooltip } from 'antd';
import React, { useState } from 'react';
import { AiOutlineEdit } from 'react-icons/ai';
import Tag from '~/features/Tag/Tag';
import TagList from '~/features/Tag/TagList';

const AttachTagsSection = ({ selectedTags, setSelectedTags }) => {
  const [tagsModalOpen, setTagsModalOpen] = useState(false);

  return (
    <div className="edit-tag__item">
      <p className="edit-tag__title">
        Schedule Tags
        {selectedTags.length > 0 && (
          <Tooltip placement="top" title="Edit Tags">
            <AiOutlineEdit
              style={{
                display: 'inline-block',
                color: '#657ef8',
                cursor: 'pointer',
                marginLeft: 12,
                fontSize: 18,
              }}
              onClick={() => setTagsModalOpen(true)}
            />
          </Tooltip>
        )}
      </p>
      <div className="flex flex-wrap gap-[6px]">
        {selectedTags.length > 0 ? (
          selectedTags.map((tag) => (
            <Tag
              key={tag.id}
              tag={tag}
              deletable={true}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
            />
          ))
        ) : (
          <>
            <p className="no-item">
              No tag attached ~{' '}
              <span
                style={{ color: '#657ef8', cursor: 'pointer' }}
                onClick={() => setTagsModalOpen(true)}
              >
                Add Tags
              </span>
            </p>
          </>
        )}
      </div>

      <TagList
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        tagsModalOpen={tagsModalOpen}
        setTagsModalOpen={setTagsModalOpen}
      />
    </div>
  );
};

export default AttachTagsSection;
