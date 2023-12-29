import { Button } from '@mui/material';
import { Popover, Tooltip } from 'antd';
import React, { useEffect, useRef } from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { BsTrash } from 'react-icons/bs';
import axiosClient from '~/axios';
import useCalendarStore from '~/store/useCalendarStore';
import useModalStore from '~/store/useModalStore';
import Header from './Header';
import ScheduleBackground from './ScheduleBackground';
import IconSelector from '~/components/IconSelector/IconSelector';
import ScheduleTags from './ScheduleTags';
import ScheduleDescription from './ScheduleDescription';
import ScheduleTitle from './ScheduleTitle';
import useSidebarStore from '~/store/useSidebarStore';
import ScheduleLocation from './ScheduleLocation';

const deleteScheduleDesc =
  "Deleting this schedule will also delete all of its events. This action can't be undone.";

const ScheduleSetting = ({ handleDeleteSchedule }) => {
  const ref = useRef();

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

  // Server-side handler state

  // Toggle handler state
  const [scheduleDetailOpen] = useCalendarStore((state) => [
    state.scheduleDetailOpen,
  ]);

  const [setConfirmModalInfo, setConfirmModalOpen] = useModalStore((state) => [
    state.setConfirmModalInfo,
    state.setConfirmModalOpen,
  ]);

  useEffect(() => {
    ref.current.classList.toggle('schedule-setting--closed');
  }, [scheduleDetailOpen]);

  return (
    <div ref={ref} className="schedule-setting schedule-setting--closed">
      <Header />

      {/* Background */}
      <ScheduleBackground />

      {/* Icon */}
      <Popover
        rootClassName="custom-popover"
        content={
          <IconSelector
            callback={(icon) => {
              const newSchedule = {
                ...curSchedule,
                icon,
              };
              const belongsToPublic = newSchedule.path[0].title === 'Public';

              if (belongsToPublic) {
                handleUpdateItems(newSchedule, false);
              } else {
                handleUpdateItems(newSchedule);
              }

              // Update the sidebar
              // updatePrivateItems(newSchedule);

              setCurSchedule(newSchedule);

              setUpdateScheduleLoading(true);
              axiosClient
                .patch(`/schedules/${curSchedule.id}`, newSchedule)
                .catch((err) => console.error(err))
                .finally(() => setUpdateScheduleLoading(false));
            }}
          />
        }
        placement="left"
        trigger={'click'}
      >
        <div className="schedule-icon__container">
          <div className="icon-select__wrapper schedule-icon">
            {curSchedule.icon.includes('/') ? (
              <img src={curSchedule.icon} alt="item-icon" />
            ) : (
              <p className="text-5xl">{curSchedule.icon}</p>
            )}
          </div>
        </div>
      </Popover>

      {/* Title */}
      <ScheduleTitle />

      {/* Description */}
      <ScheduleDescription />

      {/* File location */}
      <ScheduleLocation />

      {/* Tags */}
      <ScheduleTags />

      {/* Delete */}
      <div className="schedule-info__wrapper">
        <div className="info-wrapper__header">
          <BsTrash className="info-icon" />
          <div className="flex items-center">
            <p className="info-label">Delete Schedule</p>
            <div className="copyright-settings-title">
              <Tooltip title={deleteScheduleDesc} placement="top">
                <AiOutlineInfoCircle className="icon" />
              </Tooltip>
            </div>
          </div>
        </div>
        <div>
          <Button
            onClick={() => {
              setConfirmModalOpen(true);
              setConfirmModalInfo({
                title: 'Are you sure you want to delete this schedule?',
                message: 'Along with its events, you cannot restore it later',
                callback: () => {
                  handleDeleteSchedule(curSchedule.id);
                },
              });
            }}
            variant="outlined"
            color="error"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleSetting;
