import { Image, Modal, Popover, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import axiosClient from '~/axios';
import './NoteInfoEditModal.scss';
import { cn, objUtils, shouldShowError } from '~/utils';
import useSidebarStore from '~/store/useSidebarStore';
import useModalStore from '~/store/useModalStore';
import IconSelector from '~/components/IconSelector/IconSelector';
import { toast as sonnerToast } from 'sonner';
import { toast } from 'react-toastify';

const NoteInfoEditModal = ({
  noteInfo,
  setNoteInfo,
  editModalOpen,
  setEditModalOpen,
  setHistories,
}) => {
  const [handleUpdateItems] = useSidebarStore((state) => [
    state.handleUpdateItems,
  ]);

  const [setConfirmModalInfo, setConfirmModalOpen] = useModalStore((state) => [
    state.setConfirmModalInfo,
    state.setConfirmModalOpen,
  ]);

  // This will store what changes in the modal
  const [newNoteInfo, setNewNoteInfo] = useState({ ...noteInfo });
  // Loading when performing request
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    state: false,
  });

  const handleCancel = () => {
    if (objUtils.compareObj(noteInfo, newNoteInfo))
      setEditModalOpen(!editModalOpen);
    else {
      setConfirmModalOpen(true);
      setConfirmModalInfo({
        title: 'Xác nhận hủy chỉnh sửa?',
        message: 'Những thay đổi sẽ không được lưu lại',
        callback: () => {
          setConfirmModalOpen(false);
          handleResetInfo();
        },
      });
    }
  };

  const handleResetInfo = () => {
    setNewNoteInfo({ ...noteInfo });
    setEditModalOpen(!editModalOpen);
  };

  const handleConfirm = async () => {
    if (objUtils.compareObj(noteInfo, newNoteInfo)) {
      setEditModalOpen(!editModalOpen);
      return;
    }

    setLoading(true);
    try {
      await axiosClient
        .patch(`/notes/${noteInfo.id}`, {
          ...newNoteInfo,
        })
        .then(({ data }) => {
          const newNote = data.data;
          const newHistory = data.history;
          const belongsToPublic = newNote.path[0].title === 'Public';

          if (belongsToPublic) {
            handleUpdateItems(newNote, false);
          } else {
            handleUpdateItems(newNote);
          }

          setEditModalOpen(!editModalOpen);
          setNoteInfo({ ...data.data });
          newHistory !== null && setHistories((prev) => [newHistory, ...prev]);

          toast.success('Update note successfully!');
        })
        .catch((err) => {
          console.log(err);

          if (err.response && err.response.status === 422) {
            const responseErrors = err.response.data.errors;
            const errorsObj = {
              // title: [],
              state: false, // This will tell us do we have errors or not
            };

            for (const key of Object.keys(responseErrors)) {
              if (key === 'title') {
                errorsObj.title = responseErrors[key];
                errorsObj.state = true;
              } else continue;
            }

            setErrors(errorsObj);
          }

          sonnerToast.error('Update note failed!', {
            duration: 1500,
          });
        })
        .finally(() => setLoading(false));
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  // If the note has update => update the state of new note
  useEffect(() => {
    setNewNoteInfo(noteInfo);
  }, [noteInfo]);

  return (
    <>
      <Modal
        className="custom-modal"
        title="Edit note Info"
        open={editModalOpen}
        onCancel={handleCancel}
        afterClose={() => {
          setErrors({ state: false });
          // setNewNoteInfo({ ...noteInfo });
        }}
        centered
        footer={[
          <div
            key={'note-edit-modal--footer'}
            className="flex items-center justify-center"
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
          </div>,
        ]}
      >
        <div className="account-edit-content">
          <div className="account-edit-content-container">
            {/* Avatar */}
            <div className="account-edit__avatar">
              <div className="account-avatar">
                <Tooltip placement="top" title="Click to preview">
                  {/* Neu string khong chua / thi la emoji :)) */}
                  {!newNoteInfo.icon.includes('/') ? (
                    <p className="note-emoji-icon">{newNoteInfo.icon}</p>
                  ) : (
                    <Image
                      src={newNoteInfo.icon}
                      className="account-avatar__img"
                      alt="account-avatar__img"
                    />
                  )}
                </Tooltip>
              </div>
              <div className="account-edit_btn__group">
                <Popover
                  rootClassName="custom-popover"
                  trigger="click"
                  className="custom-popover"
                  content={
                    <IconSelector
                      callback={(icon) =>
                        setNewNoteInfo({ ...newNoteInfo, icon: icon })
                      }
                    />
                  }
                  placement="bottom"
                >
                  <div className="account-edit_btn__avatar">
                    <span role="button">Đổi icon / ảnh</span>
                  </div>
                </Popover>
              </div>
            </div>

            {/* Title */}
            <div className="account-edit__form">
              <div className="account-edit__form-item">
                <div className="account-edit__label">Title</div>
                <div className="account-edit-input-container">
                  <input
                    type="text"
                    maxLength="20"
                    spellCheck={false}
                    placeholder="Please enter title (required)"
                    value={newNoteInfo.title}
                    onChange={(e) =>
                      setNewNoteInfo({ ...newNoteInfo, title: e.target.value })
                    }
                    className={cn(
                      'account-edit-input',
                      shouldShowError(errors, 'title', newNoteInfo.title) &&
                        'error-border-color'
                    )}
                  />
                  <span className="account-edit-input-maxtip">
                    {newNoteInfo.title.length}/20
                  </span>
                </div>
              </div>
              {shouldShowError(errors, 'title', newNoteInfo.title) &&
                errors.title.map((error, index) => (
                  <p key={index} className="error-text font-normal">
                    {error}
                  </p>
                ))}

              <div className="account-edit__form-item">
                <div className="account-edit__label">Ký tên</div>
                <div className="account-edit-input-container account-edit-textarea-container">
                  <textarea
                    className="account-edit-input"
                    spellCheck="false"
                    maxLength="48"
                    placeholder="Chữ ký mặc định của hệ thống đã được cấp cho mọi người"
                    value={newNoteInfo.description}
                    onChange={(e) =>
                      setNewNoteInfo({
                        ...newNoteInfo,
                        description: e.target.value,
                      })
                    }
                  />
                  <span className="account-edit-input-maxtip">
                    {newNoteInfo.description.length}/48
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default NoteInfoEditModal;
