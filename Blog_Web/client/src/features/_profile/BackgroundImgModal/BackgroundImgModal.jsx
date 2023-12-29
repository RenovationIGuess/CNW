import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { images } from '~/constants';
import './BackgroundImgModal.scss';
import uploadFile from '~/firebase/uploadFile';
import axiosClient from '~/axios';
import { toast } from 'react-toastify';
import { bgImgArray } from '~/constants/bgImgArray';
import { userStateContext } from '~/contexts/ContextProvider';
import removeFile from '~/firebase/removeFile';

// Check if the current background image is what selected from bgImgArray
const checkUsed = (imgUrl, userBg) => {
  return bgImgArray.indexOf(imgUrl) !== -1 && imgUrl === userBg;
};

const BgItem = ({
  active,
  image,
  handleClickBgItem,
  deletable,
  chosen,
  resetImage,
}) => {
  return (
    <li
      className={`account-bg__item${active ? ' account-bg__item--active' : ''}`}
      onClick={(e) => handleClickBgItem(e)}
    >
      <div className="account-bg__item--wrap">
        <div className="account-bg__item--bg">
          <div className="gif-to-img">
            <div className="gif-to-img__container">
              <img src={image} alt="bg-item" />
            </div>
          </div>
        </div>
      </div>
      {deletable && (
        <div
          onClick={resetImage}
          className="account-avatar-delete-btn account-bg-delete-btn"
        >
          <img
            className="avatar-delete-btn-img"
            src={images.deleteiconblue}
            alt="delete-btn"
          />
        </div>
      )}
      {chosen && (
        <div className="account-bg__item--chosen">
          <img
            src={images.chosen}
            alt="choosed-icon"
            className="chosen-img-icon"
          />
        </div>
      )}
    </li>
  );
};

const BackgroundImgModal = ({
  user,
  setUser,
  userInfo,
  setUserInfo,
  bgModalOpen,
  setBgModalOpen,
  isCurrentUser,
}) => {
  const { setCurrentUser } = userStateContext();

  const [uploadImg, setUploadImg] = useState(null);
  const [imgUrl, setImgUrl] = useState(userInfo.background_image);
  // Loading when uploading image
  const [imgLoading, setImgLoading] = useState(false);
  // Loading when performing submit
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function updateImg() {
      if (uploadImg) {
        setImgLoading(true);
        const imageUrl = await uploadFile(uploadImg);
        setImgLoading(false);
        setImgUrl(imageUrl);
      }
    }

    updateImg();
  }, [uploadImg]);

  const handleClickBgItem = (ind) => {
    setImgUrl(bgImgArray[ind]);
  };

  const resetImage = () => {
    setUploadImg(null);
    removeFile(imgUrl);
    setImgUrl(userInfo.background_image);
  };

  const handleCancel = () => {
    setBgModalOpen(!bgModalOpen);
    removeFile(imgUrl);
    setImgUrl(userInfo.background_image);
    setUploadImg(null);
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await axiosClient
        .patch(`/profile/${user.id}`, {
          ...userInfo,
          background_image: imgUrl,
          user_id: user.id,
        })
        .then(({ data }) => {
          setUser(data.data);
          isCurrentUser && setCurrentUser(data.data);
          setBgModalOpen(!bgModalOpen);
          setUserInfo({ ...userInfo, background_image: imgUrl });
          setUploadImg(null);

          removeFile(userInfo.background_image);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => setLoading(false));

      toast.success('Update profile successfully!');
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  return (
    <Modal
      width={680}
      className="custom-modal"
      title="Thay đổi hình nền"
      open={bgModalOpen}
      onCancel={handleCancel}
      centered
      footer={[
        <div
          key={'user-public-profile-bg-modal'}
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
            className={`account-edit-btn account-edit-confirm-btn${
              checkUsed(imgUrl, userInfo.background_image)
                ? ' btn-disabled'
                : ''
            }`}
            // disabled={imgUrl === userInfo.background_image && "disabled"}
          >
            {!loading ? (
              checkUsed(imgUrl, userInfo.background_image) ? (
                'Used'
              ) : (
                'Confirm'
              )
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
      <div
        className="account-edit-bg"
        style={{ backgroundImage: `url(${imgUrl})` }}
      >
        <div className="account-edit-bg-header"></div>
        <div className="account-user--wrap">
          <div className="account-user-avatar-sm">
            <img
              src={userInfo.avatar}
              alt="user-avatar"
              className="account-user-avatar-img"
            />
          </div>
        </div>
      </div>
      <div className="split-line"></div>
      <div className="account-edit-bg-content">
        {/* For list of content with specify subject - future implement */}
        <div className="bg-switch-tab">
          <ul className="bg-switch-tab__list">
            {/* If not active -> className="bg-switch-tab__tag" */}
            <li className="bg-switch-tab__tag bg-switch-tab__tag--active">
              <span className="bg-switch-tab__label">Toàn bộ</span>
            </li>
          </ul>
          {/* For the navigate button -> not implement yet */}
          {/* <div></div> */}
        </div>

        <div className="account-bg__list--wrap">
          <ul className="account-bg__list">
            {!uploadImg ? (
              <li className="account-bg__item account-bg__item--upload">
                <label role="button" htmlFor="bgImgUpload">
                  Upload ảnh
                  <input
                    type="file"
                    id="bgImgUpload"
                    name="bgImgUpload"
                    className="hidden"
                    onChange={(e) => setUploadImg(e.target.files[0])}
                  />
                </label>
              </li>
            ) : !imgLoading ? (
              <BgItem
                deletable={true}
                chosen={false}
                image={imgUrl}
                active={true}
                resetImage={resetImage}
                handleClickBgItem={() => {}}
              />
            ) : (
              <li className="account-bg__item account-bg__item--upload">
                <img
                  className="loading-gif-sm"
                  src={images.GanyuKeqing}
                  alt="loading-gif"
                />
                <p>Loading...</p>
              </li>
            )}
            {bgImgArray.map((bg, ind) => (
              <BgItem
                key={ind}
                active={bg === imgUrl}
                chosen={bg === userInfo.background_image}
                deletable={false}
                image={bg}
                resetImage={() => {}}
                handleClickBgItem={() => handleClickBgItem(ind)}
              />
            ))}
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default BackgroundImgModal;
