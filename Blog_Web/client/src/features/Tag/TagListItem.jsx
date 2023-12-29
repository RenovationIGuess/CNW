import { ColorPicker, Tooltip } from 'antd';
import React, { useState } from 'react';
import { BsTrash } from 'react-icons/bs';
import { TbEdit } from 'react-icons/tb';
import EditTagModal from './EditTagModal';
import axiosClient from '~/axios';
import { toast } from 'sonner';
import useModalStore from '~/store/useModalStore';

const TagListItem = ({
  tag,
  tagIndex,
  tags,
  setTags,
  selected,
  selectedTags,
  setSelectedTags,
  loading,
  setLoading,
  errors,
  setErrors,
}) => {
  const [setConfirmModalLoading, setConfirmModalInfo, setConfirmModalOpen] =
    useModalStore((state) => [
      state.setConfirmModalLoading,
      state.setConfirmModalInfo,
      state.setConfirmModalOpen,
    ]);

  const [setActionToast] = useModalStore((state) => [state.setActionToast]);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleDeleteTag = () => {
    setConfirmModalLoading(true);
    axiosClient
      .delete(`/tags/${tag.id}`)
      .then(({ data }) => {
        setTags(tags.filter((prevTag) => prevTag.id !== tag.id));

        setActionToast({
          status: true,
          message: data.message,
        });

        setConfirmModalLoading(false);
        setTimeout(() => {
          setConfirmModalOpen(false);
        }, 0);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {});
  };

  const handleUpdateTag = (tagInfo, changeColors = false) => {
    const url = changeColors ? `/tags/${tag.id}/colors` : `/tags/${tag.id}`;

    setLoading(true);
    axiosClient
      .patch(url, tagInfo)
      .then(({ data }) => {
        tags[tagIndex] = data.data;
        setTags([...tags]);

        setActionToast({
          status: true,
          message: data.message,
        });

        setEditModalOpen(false);
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

          toast.error('Update tag failed!', {
            duration: 1500,
          });

          setErrors(errorsObj);
        }

        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <li
      onClick={() =>
        selected
          ? setSelectedTags(selectedTags.filter((item) => item.id !== tag.id))
          : setSelectedTags([tag, ...selectedTags])
      }
      className={`tag-list__item${selected ? ' tag-list__item--active' : ''}`}
    >
      <div className="tag-wrapper">
        <span className="tag-name">{tag.title}</span>
        <div className="tag-color-edit">
          <Tooltip placement="top" title="Text Color">
            <div>
              <ColorPicker
                size="small"
                value={tag.text_color}
                showText={<span>{tag.text_color}</span>}
                onChangeComplete={(value) => {
                  handleUpdateTag(
                    {
                      title: tag.title,
                      description: tag.description,
                      text_color: value.toHexString(),
                      background_color: tag.background_color,
                    },
                    true
                  );
                }}
              />
            </div>
          </Tooltip>
          <Tooltip placement="top" title="Background Color">
            <div>
              <ColorPicker
                size="small"
                value={tag.background_color}
                showText={<span>{tag.background_color}</span>}
                onChangeComplete={(value) => {
                  handleUpdateTag(
                    {
                      title: tag.title,
                      description: tag.description,
                      text_color: tag.text_color,
                      background_color: value.toHexString(),
                    },
                    true
                  );
                }}
              />
            </div>
          </Tooltip>
        </div>
        <div className="tag-actions">
          <Tooltip placement="top" title="Edit this tag">
            <TbEdit
              onClick={(e) => {
                e.stopPropagation();
                setEditModalOpen(true);
              }}
              className="icon"
            />
          </Tooltip>
          <Tooltip placement="top" title="Edit this tag">
            <BsTrash
              onClick={(e) => {
                e.stopPropagation();
                setConfirmModalOpen(true);
                setConfirmModalInfo({
                  title: 'Xác nhận xóa tag?',
                  message:
                    'Sau khi xóa tag sẽ không thể hoàn tác, bạn có chắc muốn xóa?',
                  callback: () => handleDeleteTag(),
                });
              }}
              className="icon"
            />
          </Tooltip>
        </div>
      </div>
      <div className="tag-description">
        {tag.description ? tag.description : 'No description'}
      </div>

      <EditTagModal
        editModalOpen={editModalOpen}
        setEditModalOpen={setEditModalOpen}
        type={'edit'}
        tag={tag}
        callback={handleUpdateTag}
        loading={loading}
        errors={errors}
        setErrors={setErrors}
      />
    </li>
  );
};

export default TagListItem;
