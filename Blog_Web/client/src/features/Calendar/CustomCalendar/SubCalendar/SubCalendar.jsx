import React, { useEffect, useRef, useState } from 'react';
import { IoIosAdd, IoIosArrowDown } from 'react-icons/io';
import { MdKeyboardDoubleArrowLeft } from 'react-icons/md';
import { images } from '~/constants';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AiOutlinePlus } from 'react-icons/ai';
import { Tooltip } from 'antd';
import { Views } from 'react-big-calendar';
import dayjs from 'dayjs';
import useCalendarStore from '~/store/useCalendarStore';
import ScheduleModal from '../../Schedule/ScheduleModal';
import { useParams } from 'react-router-dom';
import TodayEvents from './TodayEvents';
import ShownSchedules from './ShownSchedules';
// import CustomDate from './MUICalendar/CustomDate';

const SubCalendar = ({ date, setDate, setView, handleDeleteSchedule }) => {
  const { id } = useParams();

  const [setEventModalOpen] = useCalendarStore((state) => [
    state.setEventModalOpen,
  ]);

  const [subCalendarClosed, setSubCalendarClosed] = useCalendarStore(
    (state) => [state.subCalendarClosed, state.setSubCalendarClosed]
  );

  const [setSelectedEvent] = useCalendarStore((state) => [
    state.setSelectedEvent,
  ]);

  const [newScheludeModalOpen, setNewScheludeModalOpen] = useState(false);

  const subCalendarRef = useRef(null);

  useEffect(() => {
    subCalendarRef.current.classList.toggle('sub-calendar__container--closed');
  }, [subCalendarClosed]);

  return (
    <div className="sub-calendar__container" ref={subCalendarRef}>
      <div className="sub-calendar__header">
        <div
          className="new-task-btn"
          onClick={() => {
            setSelectedEvent({});
            setEventModalOpen(true);
          }}
        >
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
            // loading={isLoading}
            // renderLoading={() => <DayCalendarSkeleton />}
            value={dayjs(date)}
            onChange={(newValue) => {
              setDate(newValue['$d']);
              setView(Views.DAY);
            }}
            showDaysOutsideCurrentMonth
            fixedWeekNumber={6}
            views={['day']}
            // displayWeekNumber
            // slots={{
            //   day: CustomDate,
            // }}
            // slotProps={{
            //   day: {
            //     highlightedDays,
            //   } as any,
            // }}
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
          <ShownSchedules handleDeleteSchedule={handleDeleteSchedule} />
        </div>
      )}

      {/* Today's events */}
      <div className="calendar-category">
        <div className="category-header">
          <div className="category-header__text">Today Events</div>
          <div className="flex items-center">
            <Tooltip title="Add a new task" placement="top">
              <div
                className="icon-wrapper"
                onClick={() => {
                  setSelectedEvent({});
                  setEventModalOpen(true);
                }}
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
        <TodayEvents />
      </div>

      <ScheduleModal
        open={newScheludeModalOpen}
        setOpen={setNewScheludeModalOpen}
      />
    </div>
  );
};

export default SubCalendar;
