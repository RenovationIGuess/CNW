import { Modal, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { FaTags } from 'react-icons/fa';
import NoAnimateSearchBar from '~/components/SearchBar/NoAnimateSearchBar';
import './ModifyTagModal.scss';
import { images } from '~/constants';
import TagListItem from './TagListItem';
import axiosClient from '~/axios';
import Tag from './Tag';
import EditTagModal from './EditTagModal';
import TagListItemLoading from './TagListItemLoading';
import { toast } from 'sonner';
import useModalStore from '~/store/useModalStore';

const TagList = ({
  selectedTags,
  setSelectedTags,
  tagsModalOpen,
  setTagsModalOpen,
}) => {
  const [setActionToast] = useModalStore((state) => [state.setActionToast]);

  // const [searchValue, setSearchValue] = useState('');
  const [fetchTagsLoading, setFetchTagsLoading] = useState(true);
  const [newTagModalOpen, setNewTagModalOpen] = useState(false);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ state: false });

  useEffect(() => {
    axiosClient
      .get(`/tags`)
      .then(({ data }) => {
        setTags(data.data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setFetchTagsLoading(false);
      });
  }, []);

  const handleCancel = () => {
    setTagsModalOpen(!tagsModalOpen);
    // setSelectedTags([]);
  };

  const handleConfirm = () => {
    setTagsModalOpen(!tagsModalOpen);
  };

  const createNewTag = (tagInfo) => {
    setLoading(true);
    axiosClient
      .post(`/tags`, tagInfo)
      .then(({ data }) => {
        setTags([data.data, ...tags]);

        setActionToast({
          status: true,
          message: data.message,
        });

        setNewTagModalOpen(false);
      })
      .catch((err) => {
        if (err.response && err.response.status === 422) {
          const responseErrors = err.response.data.message;
          const errorsObj = {
            state: false, // This will tell us do we have errors or not
          };

          for (const key of Object.keys(responseErrors)) {
            if (key === 'title') {
              errorsObj.title = responseErrors[key];
              errorsObj.state = true;
            }
          }

          setErrors(errorsObj);
        }

        toast.error('Add tag failed!', {
          duration: 1500,
        });

        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal
      className="custom-modal"
      width={480}
      centered
      open={tagsModalOpen}
      title="Edit tags"
      onCancel={handleCancel}
      footer={[
        <footer
          key={'tag-list-modal'}
          className="flex items-center justify-center pt-1 pb-2"
        >
          <button
            onClick={handleCancel}
            className="account-edit-btn account-edit-cancel-btn"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="account-edit-btn account-edit-confirm-btn"
          >
            Confirm
          </button>
        </footer>,
      ]}
    >
      <div className="tag-edit-container">
        <header className="tags-edit-header">
          <div className="search-bar-container">
            <NoAnimateSearchBar
              // searchValue={searchValue}
              // setSearchValue={setSearchValue}
              styles={{ width: '100%' }}
              id={'tag-search-bar'}
              placeholder={'Enter tag name...'}
            />
          </div>
          <div className="other-tag-actions">
            <Tooltip placement="top" title="Add new tag">
              <div
                onClick={() => setNewTagModalOpen(true)}
                className="action-icon__wrapper"
                role="button"
              >
                <FaTags className="icon" />
              </div>
            </Tooltip>
          </div>
        </header>
        <main className="tags-edit-body">
          <div className="current-tags-container">
            <p className="current-tags__title">Current Tags</p>
            <div className="flex flex-wrap gap-[6px] mt-3">
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
                  <p className="no-item">No tag selected ~</p>
                </>
              )}
            </div>
          </div>
          <div className="tag-list-container">
            <p className="current-tags__title">Tags List</p>
            <ul className="tag-list">
              {fetchTagsLoading ? (
                <>
                  <TagListItemLoading />
                  <TagListItemLoading />
                  <TagListItemLoading />
                </>
              ) : tags.length > 0 ? (
                tags.map((tag, index) => (
                  <TagListItem
                    tag={tag}
                    key={tag.id}
                    tagIndex={index}
                    tags={tags}
                    setTags={setTags}
                    selected={selectedTags.includes(tag)}
                    selectedTags={selectedTags}
                    setSelectedTags={setSelectedTags}
                    loading={loading}
                    setLoading={setLoading}
                    errors={errors}
                    setErrors={setErrors}
                  />
                ))
              ) : (
                <div className="flex flex-col pt-7 pb-10 items-center justify-center">
                  <img
                    src={images.nothing}
                    alt="nothing"
                    className="w-[248px]"
                  />
                  <p className="note-comment__empty--title">
                    There are no tags found ~.~
                  </p>
                </div>
              )}
            </ul>
          </div>
        </main>
      </div>

      <EditTagModal
        editModalOpen={newTagModalOpen}
        setEditModalOpen={setNewTagModalOpen}
        type={'new'}
        callback={createNewTag}
        loading={loading}
        errors={errors}
        setErrors={setErrors}
      />
    </Modal>
  );
};

export default TagList;
