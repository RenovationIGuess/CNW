import { TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { BsTextLeft } from 'react-icons/bs';
import axiosClient from '~/axios';
import useCalendarStore from '~/store/useCalendarStore';

const ScheduleDescription = () => {
  const [focused, setFocused] = useState(false);

  // Value handler state
  const [curSchedule, setCurSchedule] = useCalendarStore((state) => [
    state.curSchedule,
    state.setCurSchedule,
  ]);

  // Loading handler state
  const [setUpdateScheduleLoading] = useCalendarStore((state) => [
    state.setUpdateScheduleLoading,
  ]);

  const [scheduleDesc, setScheduleDesc] = useState(curSchedule.description);

  useEffect(() => {
    setScheduleDesc(curSchedule.description);
  }, [curSchedule.description]);

  useEffect(() => {
    if (!focused) {
      // Only update the data if the user change something
      if (scheduleDesc !== '' && curSchedule?.description !== scheduleDesc) {
        setUpdateScheduleLoading(true);
        axiosClient
          .patch(`/schedules/${curSchedule.id}`, {
            ...curSchedule,
            description: scheduleDesc,
          })
          .then(({ data }) => {
            setCurSchedule(data.data);
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            setUpdateScheduleLoading(false);
          });
      } else {
        setScheduleDesc(curSchedule.description);
      }
    }
  }, [focused]);

  return (
    <div className="schedule-info__wrapper">
      <div className="info-wrapper__header">
        <BsTextLeft className="info-icon" />
        <p className="info-label">Description</p>
      </div>
      <TextField
        hiddenLabel
        // id="filled-multiline-static"
        // label="Description"
        // error={scheduleDesc.length === 0}
        // helperText={scheduleDesc.length === 0 && 'This field is required'}
        multiline
        rows={4}
        value={scheduleDesc}
        variant="filled"
        spellCheck={false}
        onChange={(e) => setScheduleDesc(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
};

export default ScheduleDescription;
