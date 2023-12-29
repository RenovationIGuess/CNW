import { Tooltip } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { BsFillFileRichtextFill, BsTrash3Fill } from 'react-icons/bs';
import { RiImageEditFill } from 'react-icons/ri';
import removeFile from '~/firebase/removeFile';
import uploadFile from '~/firebase/uploadFile';

const BackgroundImageSection = ({
  schedule,
  setSchedule,
  uploadedFile,
  setUploadedFile,
}) => {
  const [uploadLoading, setUploadLoading] = useState(false);

  const bgEntryRef = useRef();
  const scheduleBgRef = useRef();

  useEffect(() => {
    async function uploadToFirebase() {
      if (uploadedFile) {
        setUploadLoading(true);
        const imageUrl = await uploadFile(uploadedFile);
        setUploadLoading(false);
        setSchedule({
          ...schedule,
          background_image: imageUrl,
        });
      }
    }

    uploadToFirebase();
  }, [uploadedFile]);

  useEffect(() => {
    const bgEntry = bgEntryRef.current;
    const scheduleBg = scheduleBgRef.current;

    bgEntry.addEventListener('click', () => {
      scheduleBg.click();
    });

    return () => {
      bgEntry.removeEventListener('click', () => {
        scheduleBg.click();
      });
    };
  }, [bgEntryRef, scheduleBgRef]);

  const handleRemoveBg = () => {
    setSchedule({
      ...schedule,
      background_image: '',
    });
    removeFile(schedule.background_image);
    setUploadedFile(null);
  };

  return (
    <div className="edit-tag__item schedule-bg-item">
      <p className="edit-tag__title">Schedule Background Image</p>
      <input
        type="file"
        ref={scheduleBgRef}
        accept="image/png,image/jpeg,image/jpg"
        className="social-new-richtext-article__upload-cover"
        onChange={(e) => setUploadedFile(e.target.files[0])}
      />
      {uploadedFile &&
        (uploadLoading ? (
          <div className="banner-entry">
            <span className="my-loader upload-banner-loader"></span>
            <p>Uploading...</p>
          </div>
        ) : (
          <>
            <img
              src={schedule.background_image}
              alt="uploaded_file"
              className="w-full h-auto object-cover"
            />
            <div className="banner-actions">
              <Tooltip placement="top" title="Upload new banner">
                <div className="action-item">
                  <RiImageEditFill className="icon" />
                </div>
              </Tooltip>
              <Tooltip
                placement="top"
                title="Remove banner"
                onClick={handleRemoveBg}
              >
                <div className="action-item">
                  <BsTrash3Fill className="icon icon-sm" />
                </div>
              </Tooltip>
            </div>
          </>
        ))}
      <div
        ref={bgEntryRef}
        className={`banner-entry${uploadedFile ? ' hidden' : ''}`}
      >
        <BsFillFileRichtextFill className="icon" />
        <p>Add Background Image</p>
      </div>
    </div>
  );
};

export default BackgroundImageSection;
