import React, { useCallback, useMemo, useRef } from 'react';
import { Calendar, Views, dayjsLocalizer } from 'react-big-calendar';
import dayjs from 'dayjs';
import './CustomCalendar.scss';
import EventModal from './EventAction/EventModal';
import CustomToolbar from './CustomToolbar';
import SubCalendar from './SubCalendar/SubCalendar';
import CustomDateHeader from './MonthView/CustomDateHeader';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.scss';
import CustomMonthEvent from './MonthView/CustomMonthEvent';
import CustomWeekHeader from './WeekView/CustomWeekHeader';
import CustomWeekEvent from './WeekView/CustomWeekEvent';
import CustomTimeGutterHeader from './CustomTimeGutterHeader';
import useCalendarStore from '~/store/useCalendarStore';
import CustomAgendaEvent from './AgendaView/CustomAgendaEvent';
import CustomAgendaTime from './AgendaView/CustomAgendaTime';
import CustomAgendaDate from './AgendaView/CustomAgendaDate';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axiosClient from '~/axios';
import useModalStore from '~/store/useModalStore';
import { cn, colorConverters, objUtils } from '~/utils';
import ScheduleSetting from '../Schedule/ScheduleSetting/ScheduleSetting';
import clsx from 'clsx';
import useSidebarStore from '~/store/useSidebarStore';
import removeFile from '~/firebase/removeFile';
import { images } from '~/constants';
import SubCalendarSkeleton from './SubCalendar/SubCalendarSkeleton';

const DragAndDropCalendar = withDragAndDrop(Calendar);
const localizer = dayjsLocalizer(dayjs);

// const priorityClass = {
//   high: 'high-prior-event',
//   medium: 'med-prior-event',
//   low: 'low-prior-event',
// };

const CustomCalendar = () => {
  const { id } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const calendarRef = useRef();

  const startEndRef = useRef({ start: '', end: '' });

  const [handleDeleteItems] = useSidebarStore((state) => [
    state.handleDeleteItems,
  ]);

  const [setEventModalOpen] = useCalendarStore((state) => [
    state.setEventModalOpen,
  ]);

  const [view, setView, curSchedule, events, setEvents, date, setDate] =
    useCalendarStore((state) => [
      state.view,
      state.setView,
      state.curSchedule,
      state.events,
      state.setEvents,
      state.date,
      state.setDate,
    ]);

  const [hiddenEvents, setHiddenEvents] = useCalendarStore((state) => [
    state.hiddenEvents,
    state.setHiddenEvents,
  ]);

  const [schedules, setSchedules] = useCalendarStore((state) => [
    state.schedules,
    state.setSchedules,
  ]);

  const [selectedEvent, setSelectedEvent] = useCalendarStore((state) => [
    state.selectedEvent,
    state.setSelectedEvent,
  ]);

  const [calendarKey, setCalendarKey] = useCalendarStore((state) => [
    state.calendarKey,
    state.setCalendarKey,
  ]);

  const [setConfirmModalLoading, setConfirmModalOpen, setConfirmModalInfo] =
    useModalStore((state) => [
      state.setConfirmModalLoading,
      state.setConfirmModalOpen,
      state.setConfirmModalInfo,
    ]);

  const [isLoadingSchedule] = useCalendarStore((state) => [
    state.isLoadingSchedule,
  ]);

  const [setActionToast] = useModalStore((state) => [state.setActionToast]);

  const [setBottomToast] = useModalStore((state) => [state.setBottomToast]);

  const handleUpdateEvent = (event, start, end) => {
    setBottomToast({
      show: true,
      message: 'Updating...',
    });
    axiosClient
      .patch(`/events/${event.id}`, {
        title: event.title,
        priority: event.priority,
        background_color: event.background_color,
        description: event.description,
        start_date: start,
        end_date: end,
        pinned: event.pinned,
        schedule_ids: event.schedules,
      })
      .finally(() => {
        setBottomToast({
          show: false,
          message: 'Updated',
        });
      });
  };

  const handleDeleteEvent = (event) => {
    setConfirmModalLoading(true);
    axiosClient
      .delete(`/events/${event.id}`)
      .then(({ data }) => {
        // Remove from the events array
        setEvents(events.filter((e) => e.id !== event.id));

        // Remove from the hidden events array
        // This is to handle the case that the user delete from
        // the sub calendar section
        setHiddenEvents(hiddenEvents.filter((e) => e.id !== event.id));

        setActionToast({
          status: true,
          message: data.message,
        });

        setSelectedEvent({});

        setCalendarKey(calendarKey + 1);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setConfirmModalLoading(false);
        setTimeout(() => {
          setConfirmModalOpen(false);
        }, 0);
      });
  };

  const handleDeleteSchedule = (scheduleId) => {
    setConfirmModalLoading(true);
    axiosClient
      .delete(`/schedules/${scheduleId}`)
      .then(({ data }) => {
        // Remove the deleted schedule from the schedules array
        setSchedules(
          schedules.filter((s) => {
            if (s.id === scheduleId) {
              const belongsToPublic = s.path[0].title === 'Public';

              // Handle updating the sidebar
              if (belongsToPublic) {
                handleDeleteItems(s, false);
              } else {
                handleDeleteItems(s);
              }

              removeFile(s.background_image);

              return false;
            }
            return true;
          })
        );

        // When removing the schedule, we also have to remove the event that is related to it
        // But have to check if the event is only belongs to that schedule
        setEvents(
          events.filter((e) => {
            if (e.schedules.length === 1 && e.schedules[0] === scheduleId) {
              return false;
            } else if (e.schedules.includes(scheduleId)) {
              e.schedules = e.schedules.filter((s) => s !== scheduleId);
            }
            return true;
          })
        );

        // In this delete schedule action, we also have to check for hidden events
        // since it could be the case that the schedule is not shown => its event also hidden
        if (pathname === '/calendar') {
          setHiddenEvents(
            hiddenEvents.filter((e) => {
              if (e.schedules.length === 1 && e.schedules[0] === scheduleId) {
                return false;
              } else if (e.schedules.includes(scheduleId)) {
                e.schedules = e.schedules.filter((s) => s !== scheduleId);
              }
              return true;
            })
          );
        }

        setActionToast({
          status: true,
          message: data.message,
        });

        setConfirmModalLoading(false);
        setTimeout(() => {
          setConfirmModalOpen(false);
        }, 0);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        // If the current page is the page that display the schedule
        // Navigate user back to full calendar page and setCurSchedule to empty obj
        if (pathname === `/schedules/${scheduleId}`) {
          navigate('/calendar');
        }
      });
  };

  const moveEvent = useCallback(
    async ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }) => {
      // const { all_day } = event;
      // if (!all_day && droppedOnAllDaySlot) {
      //   event.all_day = true;
      // }

      // setEvents([...filtered, { ...existing, start, end, all_day }]);
      setEvents([
        ...events.filter((ev) => ev.id !== event.id),
        { ...event, start, end },
      ]);

      // Handle server-side
      handleUpdateEvent(event, start, end);
    },
    [setEvents]
  );

  const resizeEvent = useCallback(
    ({ event, start, end }) => {
      setEvents([
        ...events.filter((ev) => ev.id !== event.id),
        { ...event, start, end },
      ]);

      // Handle server-side
      handleUpdateEvent(event, start, end);
    },
    [setEvents]
  );

  const handleSelectEvent = useCallback((event) => setSelectedEvent(event), []);

  const onKeyPressEvent = useCallback((event, keypressEvent) => {
    if (objUtils.isEmptyObject(selectedEvent)) return;

    if (keypressEvent.key.toLowerCase() === 'd') {
      setConfirmModalOpen(true);
      setConfirmModalInfo({
        title: 'Are you sure you want to delete this event?',
        message: 'After delete, you cannot restore.',
        callback: () => {
          handleDeleteEvent(selectedEvent);
        },
      });
    }

    if (keypressEvent.key.toLowerCase() === 'e') {
      setEventModalOpen(true);
    }
  }, []);

  const handleSelectSlot = useCallback(
    ({ start, end }) => {
      startEndRef.current = {
        start: start,
        end: end,
      };
      setSelectedEvent({});
      setTimeout(() => {
        setEventModalOpen(true);
      }, 0);
    },
    [setEvents]
  );

  const onNavigate = useCallback((newDate) => setDate(newDate), [setDate]);
  const onView = useCallback((newView) => setView(newView), [setView]);

  const { components, formats, defaultDate } = useMemo(
    () => ({
      components: {
        timeGutterHeader: CustomTimeGutterHeader,
        toolbar: CustomToolbar,
        week: {
          header: CustomWeekHeader,
          event: CustomWeekEvent,
        },
        month: {
          dateHeader: CustomDateHeader,
          event: CustomMonthEvent,
        },
        day: {
          event: CustomWeekEvent,
        },
        agenda: {
          event: CustomAgendaEvent,
          time: CustomAgendaTime,
          date: CustomAgendaDate,
        },
      },
      formats: {
        timeGutterFormat: (date, culture, localizer) =>
          localizer.format(date, 'h A', culture),
        agendaTimeRangeFormat: ({ start, end }, culture, localizer) =>
          localizer.format(start, 'hh:mm A', culture) +
          ' - ' +
          localizer.format(end, 'hh:mm A', culture),
        agendaDateFormat: (date, culture, localizer) =>
          localizer.format(date, 'D MMMM ddd', culture),
      },
      defaultDate: new Date(),
      scrollToTime: new Date(),
    }),
    []
  );

  const eventPropGetter = useCallback(
    (event, start, end, isSelected) => ({
      ...{
        style: {
          '--event-bg-color': event.background_color,
        },
        className: cn(
          'rbc-custom-event-bg',
          colorConverters.isLightColor(event.background_color)
            ? 'custom-event--dark'
            : 'custom-event--light'
        ),
      },
      ...(isSelected && {
        style: {
          backgroundColor: colorConverters.darkenColor(event.background_color),
        },
      }),
      ...(event.title.includes('Meeting') && {
        className: 'darkGreen',
      }),
    }),
    []
  );

  return (
    <div className="calendar-container">
      {!isLoadingSchedule ? (
        <SubCalendar
          date={date}
          setDate={setDate}
          setView={setView}
          handleDeleteSchedule={handleDeleteSchedule}
        />
      ) : (
        <SubCalendarSkeleton />
      )}
      <div className="calendar" ref={calendarRef}>
        <DragAndDropCalendar
          key={calendarKey}
          localizer={localizer}
          components={components}
          events={events}
          startAccessor="start"
          endAccessor="end"
          formats={formats}
          popup
          defaultDate={defaultDate}
          defaultView={Views.MONTH}
          onSelectEvent={handleSelectEvent}
          selectable
          onEventDrop={moveEvent}
          onEventResize={resizeEvent}
          onSelectSlot={handleSelectSlot}
          className={clsx('my-custom-calendar', {
            'custom-time-view': view === Views.DAY,
          })}
          date={date}
          onNavigate={onNavigate}
          onView={onView}
          view={view}
          eventPropGetter={eventPropGetter}
          selected={selectedEvent}
          onKeyPressEvent={onKeyPressEvent}
          // step={15}
        />
        {isLoadingSchedule ? (
          <div className="calendar-fallback">
            <div className="data-empty__container gap-4">
              <div className="my-loader loader-xl"></div>
              {/* <p className="loader-text">Loading...</p> */}
            </div>
          </div>
        ) : (
          <>
            {id && curSchedule?.background_image && (
              <div className="calendar-background">
                <img src={curSchedule.background_image} alt="" />
              </div>
            )}
            {view === Views.AGENDA && events.length === 0 && (
              <div className="agenda-no-events">
                <div className="data-empty__container">
                  <img
                    src={images.nothing}
                    alt="data-empty-img"
                    className="data-empty__img"
                  />
                  <p className="data-empty__title">No events were found ~_~</p>
                </div>
              </div>
            )}
            {id && (
              <ScheduleSetting handleDeleteSchedule={handleDeleteSchedule} />
            )}
          </>
        )}
      </div>
      {/* <OtherTools /> */}

      <EventModal
        start={startEndRef.current.start}
        end={startEndRef.current.end}
      />
    </div>
  );
};

export default CustomCalendar;
