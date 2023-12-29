import { Tooltip } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { BsTrash3Fill } from 'react-icons/bs';
import { RiImageEditFill } from 'react-icons/ri';
import axiosClient from '~/axios';
import { images } from '~/constants';
import removeFile from '~/firebase/removeFile';
import uploadFile from '~/firebase/uploadFile';
import useCalendarStore from '~/store/useCalendarStore';

const ScheduleBackground = () => {
  const [curSchedule, setCurSchedule] = useCalendarStore((state) => [
    state.curSchedule,
    state.setCurSchedule,
  ]);

  const [setUpdateScheduleLoading] = useCalendarStore((state) => [
    state.setUpdateScheduleLoading,
  ]);

  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  const bgEntryRef = useRef();
  const scheduleBgRef = useRef();

  useEffect(() => {
    async function uploadToFirebase() {
      if (uploadedFile) {
        setUploadLoading(true);
        const imageUrl = await uploadFile(uploadedFile);
        setUploadLoading(false);

        const newSchedule = {
          ...curSchedule,
          background_image: imageUrl,
        };

        setCurSchedule(newSchedule);

        // Handle backend
        handleUpdateSchedule(newSchedule);
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
    const newSchedule = {
      ...curSchedule,
      background_image: '',
    };

    setCurSchedule(newSchedule);
    setUploadedFile(null);

    if (curSchedule.background_image) {
      removeFile(curSchedule.background_image);

      // Handle backend
      handleUpdateSchedule(newSchedule);
    }
  };

  const handleUpdateSchedule = (newSchedule) => {
    setUpdateScheduleLoading(true);

    // If the previous background image is an upload file => delete it
    removeFile(curSchedule.background_image);
    axiosClient
      .patch(`/schedules/${curSchedule.id}`, newSchedule)
      .catch((err) => console.error(err))
      .finally(() => {
        setUpdateScheduleLoading(false);
      });
  };

  return (
    <div className="schedule-bg">
      <div className="schedule-bg__wrapper">
        <input
          type="file"
          ref={scheduleBgRef}
          accept="image/png,image/jpeg,image/jpg"
          className="social-new-richtext-article__upload-cover"
          onChange={(e) => setUploadedFile(e.target.files[0])}
        />
        <img src={curSchedule.background_image} alt="" />
        <div className="schedule-bg-mask"></div>
        <div className="banner-actions">
          <Tooltip placement="top" title="Change background">
            <div ref={bgEntryRef} className="action-item">
              <RiImageEditFill className="icon" />
            </div>
          </Tooltip>
          <Tooltip
            placement="top"
            title="Remove background"
            onClick={handleRemoveBg}
          >
            <div className="action-item">
              <BsTrash3Fill className="icon icon-sm" />
            </div>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default ScheduleBackground;
