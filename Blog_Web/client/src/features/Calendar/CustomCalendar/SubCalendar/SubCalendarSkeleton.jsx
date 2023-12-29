import { Tooltip } from 'antd';
import React from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { IoIosAdd, IoIosArrowDown } from 'react-icons/io';
import TodayEventsSkeleton from './TodayEventsSkeleton';
import { images } from '~/constants';
import { MdKeyboardDoubleArrowLeft } from 'react-icons/md';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useParams } from 'react-router-dom';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';

const SubCalendarSkeleton = ({}) => {
  const { id } = useParams();

  return (
    <div className="sub-calendar__container">
      <div className="sub-calendar__header">
        <div className="new-task-btn" onClick={() => {}}>
          <div className="new-task-btn__icon">
            <img
              src={images.info}
              className="new-task-btn__icon"
              alt="new-task-icon"
            />
          </div>
          <span className="new-task-btn__label">New</span>
          <IoIosAdd className="new-task-btn__add-icon" />
        </div>
        <div
          className="minimize-btn"
          onClick={() => setSubCalendarClosed(true)}
        >
          <MdKeyboardDoubleArrowLeft className="minimize-btn__icon" />
        </div>
      </div>

      <div className="sub-calendar">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            value={dayjs(new Date())}
            showDaysOutsideCurrentMonth
            fixedWeekNumber={6}
            views={['day']}
          />
        </LocalizationProvider>
      </div>

      {/* Shown Schedules */}
      {!id && (
        <div className="calendar-category">
          <div className="category-header">
            <div className="category-header__text">Shown Schedule</div>
            <div className="flex items-center">
              <Tooltip title="Add a new schedule" placement="top">
                <div
                  className="icon-wrapper"
                  onClick={() => setNewScheludeModalOpen(true)}
                >
                  <AiOutlinePlus className="icon" />
                </div>
              </Tooltip>
              <Tooltip title="Minimize" placement="top">
                <div className="icon-wrapper">
                  <IoIosArrowDown className="icon" />
                </div>
              </Tooltip>
            </div>
          </div>
          <div className="flex flex-col pl-2">
            <div className="skeleton skeleton-loading-height-20-width-full mb-3"></div>
            <div className="skeleton skeleton-loading-height-20-width-full"></div>
          </div>
        </div>
      )}

      {/* Today's events */}
      <div className="calendar-category">
        <div className="category-header">
          <div className="category-header__text">Today Events</div>
          <div className="flex items-center">
            <Tooltip title="Add a new task" placement="top">
              <div className="icon-wrapper">
                <AiOutlinePlus className="icon" />
              </div>
            </Tooltip>
            <Tooltip title="Minimize" placement="top">
              <div className="icon-wrapper">
                <IoIosArrowDown className="icon" />
              </div>
            </Tooltip>
          </div>
        </div>
        <TodayEventsSkeleton />
      </div>
    </div>
  );
};

export default SubCalendarSkeleton;
