import { Image, Modal, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import './AvatarImgModal.scss';
import '../UserInfoEditModal/UserInfoEditModal.scss';
import { images } from '~/constants';
import uploadFile from '~/firebase/uploadFile';
import { avatarImgArray } from '~/constants/avatarImgArray';
import removeFile from '~/firebase/removeFile';

const AvatarImgModal = ({
  userInfo,
  setUserInfo,
  avatarModalOpen,
  setAvatarModalOpen,
}) => {
  // Uploaded File
  const [image, setImage] = useState(null);
  // Image Url
  const [url, setUrl] = useState(userInfo.avatar);

  useEffect(() => {
    async function updateImg() {
      if (image) {
        const imageUrl = await uploadFile(image);
        setUrl(imageUrl);
      }
    }

    updateImg();
  }, [image]);

  const handleAvatarClick = (ind) => {
    setUrl(avatarImgArray[ind]);
  };

  const resetImage = () => {
    setImage(null);
    removeFile(url);
    setUrl(userInfo.avatar);
  };

  const handleCancel = () => {
    setAvatarModalOpen(!avatarModalOpen);
    setImage(null);
    removeFile(url);
    setUrl(userInfo.avatar);
  };

  const handleConfirm = () => {
    setAvatarModalOpen(!avatarModalOpen);
    setUserInfo({ ...userInfo, avatar: url });

    // In case its a user upload file => delete it
    removeFile(userInfo.avatar);
    setImage(null);
  };

  return (
    <Modal
      width={608}
      className="custom-modal"
      title="Edit public Info"
      open={avatarModalOpen}
      centered
      onCancel={() => {
        setAvatarModalOpen(!avatarModalOpen);
      }}
      footer={[
        <div className="flex items-center justify-center">
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
        </div>,
      ]}
    >
      <div className="avatar-modal-body">
        <div className="avatar-selector__current">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-6">
              <div className="account-avatar">
                <Tooltip placement="top" title="Click to preview">
                  <Image
                    src={url}
                    className="account-avatar__img"
                    alt="account-avatar__img"
                  />
                </Tooltip>
                {image && (
                  <div
                    onClick={resetImage}
                    className="account-avatar-delete-btn"
                  >
                    <img
                      className="avatar-delete-btn-img"
                      src={images.deleteiconblue}
                      alt="delete-btn"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="account-edit_btn__group">
              <div className="account-edit_btn__avatar">
                <label role="button" htmlFor="imgUpload">
                  Upload ảnh
                  <input
                    type="file"
                    id="imgUpload"
                    name="imgUpload"
                    className="hidden"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="avatar-selector__container">
          {avatarImgArray.map((img, ind) => (
            <div
              key={ind}
              // This will be replaced by the link to the image
              data-src={`avatar-${ind}`}
              onClick={() => handleAvatarClick(ind)}
              className={`avatar-selector__item${
                img === url ? ' avatar-selector__item--active' : ''
              }`}
            >
              <img src={img} alt="avatar-to-select" />
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default AvatarImgModal;
