import React from 'react';
import { AiFillEye } from 'react-icons/ai';
import { BsTrash } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import useCalendarStore from '~/store/useCalendarStore';
import useModalStore from '~/store/useModalStore';

const SchedulePopover = ({
  scheduleId,
  setPopoverOpen,
  handleDeleteSchedule,
}) => {
  const navigate = useNavigate();

  const [setConfirmModalInfo, setConfirmModalOpen] = useModalStore((state) => [
    state.setConfirmModalInfo,
    state.setConfirmModalOpen,
  ]);

  const [setIsLoadingSchedule] = useCalendarStore((state) => [
    state.setIsLoadingSchedule,
  ]);

  return (
    <div className="action-menu">
      <div className="action-menu__title">Options</div>
      <ul className="action-menu__list">
        <li
          onClick={(e) => {
            e.stopPropagation();

            setIsLoadingSchedule(true);
            navigate(`/schedules/${scheduleId}`);
            setPopoverOpen(false);
          }}
          className="action-menu__item"
        >
          <AiFillEye className="action-menu__icon" />
          <span className="action-menu__label">View Detail</span>
        </li>
        <li
          onClick={(e) => {
            e.stopPropagation();

            setConfirmModalOpen(true);
            setConfirmModalInfo({
              title: 'Are you sure you want to delete this schedule?',
              message: 'Along with its events, you cannot restore it later',
              callback: () => {
                handleDeleteSchedule(scheduleId);
              },
            });
            setPopoverOpen(false);
          }}
          className="action-menu__item"
        >
          <BsTrash className="action-menu__icon" />
          <span className="action-menu__label">Delete Schedule</span>
        </li>
      </ul>
    </div>
  );
};

export default SchedulePopover;
