import { e } from 'maath/dist/index-43782085.esm';
import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axiosClient from '~/axios';
import CalendarPageHeader from '~/features/Calendar/CalendarPageHeader/CalendarPageHeader';
import CustomCalendar from '~/features/Calendar/CustomCalendar/CustomCalendar';
import NotFound from '~/features/components/NotFound';
import useCalendarStore from '~/store/useCalendarStore';
import { objUtils } from '~/utils';

const Calendar = () => {
  const { id } = useParams();
  const { pathname } = useLocation();

  const [
    isLoadingSchedule,
    setEvents,
    curSchedule,
    setCurSchedule,
    setSchedules,
    setIsLoadingSchedule,
    setShownSchedules,
  ] = useCalendarStore((state) => [
    state.isLoadingSchedule,
    state.setEvents,
    state.curSchedule,
    state.setCurSchedule,
    state.setSchedules,
    state.setIsLoadingSchedule,
    state.setShownSchedules,
  ]);

  useEffect(() => {
    setIsLoadingSchedule(true);
    if (id) {
      axiosClient
        .get(`/schedules/${id}`)
        .then(({ data }) => {
          const { schedule, events } = data.data;
          setCurSchedule(schedule);
          setEvents(
            events.map((event) => ({
              ...event,
              start: new Date(event.start),
              end: new Date(event.end),
            }))
          );
        })
        .catch((err) => {
          setCurSchedule({});
          console.error(err);
        })
        .finally(() => {
          setIsLoadingSchedule(false);
        });
    } else {
      // Everytime we navigate to the full calendar page, we'll set the curSchedule to
      // Empty obj - this helps the delete schedule action to work properly
      setCurSchedule({});

      axiosClient
        .get(`/schedules`)
        .then(({ data }) => {
          const { schedules, events } = data.data;
          setSchedules(schedules);
          setShownSchedules(
            schedules.map((schedule) => ({
              id: schedule.id,
              show: true,
            }))
          );
          setEvents(
            events.map((event) => ({
              ...event,
              start: new Date(event.start),
              end: new Date(event.end),
            }))
          );
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setIsLoadingSchedule(false);
        });
    }
  }, [id, pathname]);

  useEffect(() => {
    if (isLoadingSchedule) {
      document.title = 'Loading...';
    } else {
      if (id) {
        if (Object.keys(curSchedule).length === 0) {
          document.title = 'Schedule Not Found!';
        } else document.title = `${curSchedule.title}`;
      } else document.title = 'Calendar';
    }
  }, [isLoadingSchedule]);

  if (
    pathname !== '/calendar' &&
    !isLoadingSchedule &&
    objUtils.isEmptyObject(curSchedule)
  ) {
    return (
      <NotFound
        message={
          "Unable to locate a schedule with this ID. It may have been deleted or never existed. Please check the 'Trash' folder for further information. >_<"
        }
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <CalendarPageHeader showNotifications={true} showOtherOptions={true} />
      <CustomCalendar />
    </div>
  );
};

export default Calendar;
