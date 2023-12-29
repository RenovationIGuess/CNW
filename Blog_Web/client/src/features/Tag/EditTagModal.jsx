import { ColorPicker, Modal, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import useComponentVisible from '~/hooks/useComponentVisible';
import useModalStore from '~/store/useModalStore';
import { cn, objUtils, shouldShowError } from '~/utils';

const defaultTagValue = {
  title: 'New Tag',
  description: 'No description',
  background_color: '#657ef8',
  text_color: '#fff',
};

// type could be edit | create
const EditTagModal = ({
  tag,
  editModalOpen,
  setEditModalOpen,
  callback,
  type,
  loading,
  errors,
  setErrors,
}) => {
  const [titleInputRef, isTitleInputFocused, setTitleInputFocused] =
    useComponentVisible(false);
  const [descInputRef, isDescInputFocused, setDescInputFocused] =
    useComponentVisible(false);

  const [setConfirmModalInfo, setConfirmModalOpen] = useModalStore((state) => [
    state.setConfirmModalInfo,
    state.setConfirmModalOpen,
  ]);

  const [tagInfo, setTagInfo] = useState({
    title: tag ? tag.title : 'New Tag',
    description: tag ? tag.description : 'No description',
    background_color: tag ? tag.background_color : '#657ef8',
    text_color: tag ? tag.text_color : '#fff',
  });

  useEffect(() => {
    if (type === 'edit') {
      setTagInfo({
        title: tag.title,
        description: tag.description,
        background_color: tag.background_color,
        text_color: tag.text_color,
      });
    }
  }, [tag?.id]);

  const resetFields = () => {
    setTagInfo({
      title: tag ? tag.title : 'New Tag',
      description: tag ? tag.description : 'No description',
      background_color: tag ? tag.background_color : '#657ef8',
      text_color: tag ? tag.text_color : '#fff',
    });
  };

  const handleCancel = () => {
    if (
      !objUtils.compareObj(tagInfo, type === 'edit' ? tag : defaultTagValue)
    ) {
      setConfirmModalOpen(true);
      setConfirmModalInfo({
        title: 'Xác nhận hủy chỉnh sửa?',
        message: 'Những thay đổi của bạn sẽ không được lưu',
        callback: () => {
          setConfirmModalOpen(false);
          resetFields();
          setEditModalOpen(!editModalOpen);
        },
      });
    } else {
      setEditModalOpen(!editModalOpen);
    }
  };

  const handleConfirm = () => {
    callback(tagInfo);
  };

  return (
    <Modal
      centered
      width={438}
      title={type === 'edit' ? 'Edit tag' : 'Add tag'}
      open={editModalOpen}
      onCancel={handleCancel}
      afterClose={() => {
        resetFields();
        setErrors({ state: false });
      }}
      className="custom-modal"
      footer={[
        <footer
          key={'edit-tag-modal-footer'}
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
            {!loading ? (
              <>Confirm</>
            ) : (
              <>
                <span className="my-loader account-bg-loader"></span>
                Loading...
              </>
            )}
          </button>
        </footer>,
      ]}
    >
      <div className="edit-tag-container">
        <div className="edit-tag__item">
          <p className="edit-tag__title">Tag Title</p>
          <div className="social-input-title-text">
            <div
              onClick={() => setTitleInputFocused(true)}
              ref={titleInputRef}
              className={cn(
                'social-input-container',
                isTitleInputFocused && ' social-input-container--active',
                shouldShowError(errors, 'title', tagInfo.title) &&
                  'social-input-container--error'
              )}
            >
              <input
                type="text"
                maxLength="16"
                placeholder="Please enter title (required)"
                value={tagInfo.title}
                onChange={(e) =>
                  setTagInfo({ ...tagInfo, title: e.target.value })
                }
              />
              <span className="count-tip">{tagInfo.title.length}/16</span>
            </div>
          </div>
          {shouldShowError(errors, 'title', tagInfo.title) &&
            errors['title']?.map((error, index) => (
              <p key={index} className="error-text font-normal">
                {error}
              </p>
            ))}
        </div>
        <div className="edit-tag__item">
          <p className="edit-tag__title">Tag Description</p>
          <div className="social-input-title-text">
            <div
              onClick={() => setDescInputFocused(true)}
              ref={descInputRef}
              className={`social-input-container${
                isDescInputFocused ? ' social-input-container--active' : ''
              }`}
            >
              <input
                type="text"
                maxLength="32"
                placeholder="Please enter title (required)"
                value={tagInfo.description}
                onChange={(e) =>
                  setTagInfo({ ...tagInfo, description: e.target.value })
                }
              />
              <span className="count-tip">{tagInfo.description.length}/32</span>
            </div>
          </div>
        </div>
        <div className="edit-tag__item">
          <p className="edit-tag__title">Tag Color</p>
          <div className="tag-color-edit">
            <div>
              <ColorPicker
                // size="small"
                showText={(color) => (
                  <span>Text Color: {color.toHexString()}</span>
                )}
                value={tagInfo.text_color}
                onChangeComplete={(value) => {
                  setTagInfo({ ...tagInfo, text_color: value.toHexString() });
                }}
              />
            </div>
            <div>
              <ColorPicker
                // size="small"
                showText={(color) => (
                  <span>Background Color: {color.toHexString()}</span>
                )}
                value={tagInfo.background_color}
                onChangeComplete={(value) => {
                  setTagInfo({
                    ...tagInfo,
                    background_color: value.toHexString(),
                  });
                }}
              />
            </div>
          </div>
        </div>
        <div className="edit-tag__item">
          <p className="edit-tag__title">Preview</p>
          <div className="tag-preview">
            <Tooltip placement="top" title={tagInfo.description}>
              <div
                className="status-tag"
                style={{
                  color: tagInfo.text_color,
                  backgroundColor: tagInfo.background_color,
                }}
              >
                <span>{tagInfo.title}</span>
              </div>
            </Tooltip>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditTagModal;
