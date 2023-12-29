import { Image, Modal, Tooltip } from 'antd';
import React, { useState } from 'react';
import './UserInfoEditModal.scss';
import AvatarImgModal from '../AvatarImgModal/AvatarImgModal';
import { userStateContext } from '~/contexts/ContextProvider';
import axiosClient from '~/axios';
import { toast as sonnerToast } from 'sonner';
import { toast } from 'react-toastify';
import { cn, objUtils, shouldShowError } from '~/utils';
import useModalStore from '~/store/useModalStore';

const UserInfoEditModal = ({
  user,
  setUser,
  userInfo,
  setUserInfo,
  editModalOpen,
  setEditModalOpen,
  isCurrentUser,
}) => {
  const { setCurrentUser } = userStateContext();

  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  // Loading when performing request
  const [loading, setLoading] = useState(false);
  // Confirm Modal
  const [setConfirmModalInfo, setConfirmModalOpen] = useModalStore((state) => [
    state.setConfirmModalInfo,
    state.setConfirmModalOpen,
  ]);

  const [errors, setErrors] = useState({ state: true });

  const handleCancel = () => {
    if (objUtils.compareObj(userInfo, user.profile))
      setEditModalOpen(!editModalOpen);
    else {
      setConfirmModalOpen(true);
      setConfirmModalInfo({
        title: 'Xác nhận hủy chỉnh sửa?',
        message: 'Những thay đổi sẽ không được lưu lại',
        callback: () => {
          handleResetInfo();
          setConfirmModalOpen(false);
        },
      });
    }
  };

  const handleResetInfo = () => {
    setUserInfo({
      name: user.profile.name,
      sign: user.profile.sign ?? '',
      avatar: user.profile.avatar,
      background_image: user.profile.background_image,
    });
    setEditModalOpen(!editModalOpen);
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await axiosClient
        .patch(`/profile/${user.id}`, {
          ...userInfo,
          user_id: user.id,
        })
        .then(({ data }) => {
          setEditModalOpen(!editModalOpen);
          setUser(data.data);
          isCurrentUser && setCurrentUser(data.data);

          toast.success('Update profile successfully!');
        })
        .catch((err) => {
          if (err.response && err.response.status === 422) {
            const responseErrors = err.response.data.errors;
            const errorsObj = {
              state: false, // This will tell us do we have errors or not
            };

            for (const key of Object.keys(responseErrors)) {
              if (key === 'name') {
                errorsObj.name = responseErrors[key];
                errorsObj.state = true;
              }
            }

            setErrors(errorsObj);
          }

          sonnerToast.error('Update profile failed!', {
            duration: 1500,
          });

          console.log(err);
        })
        .finally(() => setLoading(false));
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  return (
    <>
      <Modal
        className="custom-modal"
        title="Edit public Info"
        open={editModalOpen}
        onCancel={handleCancel}
        afterClose={() => {
          setErrors({ state: false });
        }}
        centered
        footer={[
          <div
            key={'user-public-info-edit-modal'}
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
                  <Image
                    src={userInfo.avatar}
                    className="account-avatar__img"
                    alt="account-avatar__img"
                  />
                </Tooltip>
              </div>
              <div className="account-edit_btn__group">
                <div
                  className="account-edit_btn__avatar"
                  onClick={() => setAvatarModalOpen(true)}
                >
                  <span role="button">Đổi ảnh đại diện</span>
                </div>
              </div>
            </div>

            {/* Nickname */}
            <div className="account-edit__form">
              <div className="account-edit__form-item">
                <div className="account-edit__label">Nickname</div>
                <div className="account-edit-input-container">
                  <input
                    type="text"
                    maxLength="20"
                    spellCheck={false}
                    value={userInfo.name}
                    placeholder="Enter profile name (required)"
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, name: e.target.value })
                    }
                    className={cn(
                      'account-edit-input',
                      shouldShowError(errors, 'name', userInfo.title) &&
                        'error-border-color'
                    )}
                  />
                  <span className="account-edit-input-maxtip">
                    {userInfo.name.length}/20
                  </span>
                </div>
              </div>
              {shouldShowError(errors, 'name', userInfo.title) &&
                errors?.name?.map((error, index) => (
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
                    value={userInfo.sign}
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, sign: e.target.value })
                    }
                  />
                  <span className="account-edit-input-maxtip">
                    {userInfo.sign?.length ?? 0}/48
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <AvatarImgModal
        userInfo={userInfo}
        setUserInfo={setUserInfo}
        avatarModalOpen={avatarModalOpen}
        setAvatarModalOpen={setAvatarModalOpen}
      />
    </>
  );
};

export default UserInfoEditModal;
