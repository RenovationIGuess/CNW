import { TextField } from '@mui/material';
import { Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { AiOutlineFontSize, AiOutlineInfoCircle } from 'react-icons/ai';
import { FiEdit3 } from 'react-icons/fi';
import axiosClient from '~/axios';
import useCalendarStore from '~/store/useCalendarStore';
import useSidebarStore from '~/store/useSidebarStore';

const ScheduleTitle = () => {
  const [edit, setEdit] = useState(false);
  const [focused, setFocused] = useState(false);

  const [handleUpdateItems] = useSidebarStore((state) => [
    state.handleUpdateItems,
  ]);

  // Value handler state
  const [curSchedule, setCurSchedule] = useCalendarStore((state) => [
    state.curSchedule,
    state.setCurSchedule,
  ]);

  // Loading handler state
  const [setUpdateScheduleLoading] = useCalendarStore((state) => [
    state.setUpdateScheduleLoading,
  ]);

  const [scheduleTitle, setScheduleTitle] = useState(curSchedule.title);

  useEffect(() => {
    setScheduleTitle(curSchedule.title);
  }, [curSchedule.title]);

  useEffect(() => {
    if (!focused) {
      // Only update the data if the user change something
      if (scheduleTitle !== '' && curSchedule?.title !== scheduleTitle) {
        setUpdateScheduleLoading(true);
        axiosClient
          .patch(`/schedules/${curSchedule.id}`, {
            ...curSchedule,
            title: scheduleTitle,
          })
          .then(({ data }) => {
            const newSchedule = data.data;
            const belongsToPublic = newSchedule.path[0].title === 'Public';

            if (belongsToPublic) {
              handleUpdateItems(newSchedule, false);
            } else {
              handleUpdateItems(newSchedule);
            }

            setCurSchedule(data.data);
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            setUpdateScheduleLoading(false);
          });
      }
      setEdit(false);
    }
  }, [focused]);

  return !edit ? (
    <div className="schedule-title">
      <p className="title">
        {curSchedule.title}
        <span onClick={() => setEdit(true)} className="title-edit-icon">
          <Tooltip placement="top" title={'Edit title'}>
            <FiEdit3 />
          </Tooltip>
        </span>
      </p>
    </div>
  ) : (
    <div className="schedule-info__wrapper">
      <div className="info-wrapper__header">
        <AiOutlineFontSize className="info-icon" />
        <div className="flex items-center">
          <p className="info-label">Title</p>
          <div className="copyright-settings-title">
            <Tooltip
              title={'To exit editing, click outside the input'}
              placement="top"
            >
              <AiOutlineInfoCircle className="icon" />
            </Tooltip>
          </div>
        </div>
      </div>
      <TextField
        hiddenLabel
        error={scheduleTitle.length === 0}
        helperText={scheduleTitle.length === 0 && 'Title cannot be empty'}
        // id="filled-multiline-static"
        // label="Description"
        value={scheduleTitle}
        variant="standard"
        spellCheck={false}
        onChange={(e) => setScheduleTitle(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          // setEdit(false);
        }}
      />
    </div>
  );
};

export default ScheduleTitle;
