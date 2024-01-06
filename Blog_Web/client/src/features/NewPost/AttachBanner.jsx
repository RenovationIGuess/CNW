import { Tooltip } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { BsFillFileRichtextFill, BsTrash3Fill } from 'react-icons/bs';
import { RiImageEditFill } from 'react-icons/ri';
import removeFile from '~/firebase/removeFile';
import uploadFile from '~/firebase/uploadFile';

const AttachBanner = ({ post, setPost }) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  const bannerEntryRef = useRef();
  const postBannerRef = useRef();

  useEffect(() => {
    async function uploadToFirebase() {
      if (uploadedFile) {
        setUploadLoading(true);
        if (post.banner) {
          await removeFile(post.banner);
        }
        const imageUrl = await uploadFile(uploadedFile);
        setUploadLoading(false);
        setPost({
          ...post,
          banner: imageUrl,
        });
      }
    }

    uploadToFirebase();
  }, [uploadedFile]);

  useEffect(() => {
    const bannerEntry = bannerEntryRef.current;
    const postBanner = postBannerRef.current;

    bannerEntry.addEventListener('click', () => {
      postBanner.click();
    });

    return () => {
      bannerEntry.removeEventListener('click', () => {
        postBanner.click();
      });
    };
  }, [bannerEntryRef, postBannerRef]);

  const handleRemoveBanner = () => {
    setPost({
      ...post,
      banner: '',
    });
    removeFile(post.banner);
    setUploadedFile(null);
  };

  const handleChangeBanner = () => {
    postBannerRef.current.click();
  };

  return (
    <div
      className={`form-item-container${
        !uploadLoading && post.banner ? ' post-banner-show' : ''
      }`}
    >
      <input
        type="file"
        ref={postBannerRef}
        accept="image/png,image/jpeg,image/jpg"
        className="social-new-richtext-article__upload-cover"
        onChange={(e) => setUploadedFile(e.target.files[0])}
      />
      {!uploadedFile && (
        <span className="form-item-container__label">Banner</span>
      )}
      {uploadedFile &&
        (uploadLoading ? (
          <div className="banner-entry">
            <span className="my-loader upload-banner-loader"></span>
            <p>Uploading...</p>
          </div>
        ) : (
          <>
            <img
              src={post.banner}
              alt="uploaded_file"
              className="w-full h-auto object-cover"
            />
            <div className="banner-actions">
              <Tooltip placement="top" title="Upload new banner">
                <div onClick={handleChangeBanner} className="action-item">
                  <RiImageEditFill className="icon" />
                </div>
              </Tooltip>
              <Tooltip placement="top" title="Remove banner">
                <div onClick={handleRemoveBanner} className="action-item">
                  <BsTrash3Fill className="icon icon-sm" />
                </div>
              </Tooltip>
            </div>
          </>
        ))}
      <div
        ref={bannerEntryRef}
        className={`banner-entry${uploadedFile ? ' hidden' : ''}`}
      >
        <BsFillFileRichtextFill className="icon" />
        <p>Add banner</p>
      </div>
    </div>
  );
};

export default AttachBanner;
