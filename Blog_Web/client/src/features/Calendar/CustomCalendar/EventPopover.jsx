import { Tooltip } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { AiFillCalendar } from 'react-icons/ai';
import { BiSolidEditAlt, BiSolidUserCircle } from 'react-icons/bi';
import {
  BsTextParagraph,
  BsThreeDotsVertical,
  BsTrash2Fill,
} from 'react-icons/bs';
import axiosClient from '~/axios';
import Liked from '~/components/Actions/Liked';
import Pinned from '~/components/Actions/Pinned';
import Top from '~/components/Actions/Top';
import useCalendarStore from '~/store/useCalendarStore';
import useModalStore from '~/store/useModalStore';

const EventPopover = ({ event, setPopoverOpen }) => {
  const [setConfirmModalInfo, setConfirmModalOpen] = useModalStore((state) => [
    state.setConfirmModalInfo,
    state.setConfirmModalOpen,
  ]);

  const [events, setEvents] = useCalendarStore((state) => [
    state.events,
    state.setEvents,
  ]);

  const [hiddenEvents, setHiddenEvents] = useCalendarStore((state) => [
    state.hiddenEvents,
    state.setHiddenEvents,
  ]);

  const [setEventModalOpen] = useCalendarStore((state) => [
    state.setEventModalOpen,
  ]);

  const [setSelectedEvent] = useCalendarStore((state) => [
    state.setSelectedEvent,
  ]);

  const [calendarKey, setCalendarKey] = useCalendarStore((state) => [
    state.calendarKey,
    state.setCalendarKey,
  ]);

  const [setConfirmModalLoading] = useModalStore((state) => [
    state.setConfirmModalLoading,
  ]);

  const [setActionToast] = useModalStore((state) => [state.setActionToast]);

  const handleDeleteEvent = () => {
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

  return (
    <div className="event-popover">
      <header className="event-popover__header">
        <Tooltip placement="bottom" title="Edit event">
          <div
            onClick={(e) => {
              e.stopPropagation();

              setEventModalOpen(true);
              setPopoverOpen(false);
            }}
            className="icon-wrapper"
            data-query="edit-event-btn"
          >
            <BiSolidEditAlt className="edit-icon" />
          </div>
        </Tooltip>
        <Tooltip placement="bottom" title="Delete event">
          <div
            onClick={(e) => {
              e.stopPropagation();

              setPopoverOpen(false);
              setConfirmModalOpen(true);
              setConfirmModalInfo({
                title: 'Are you sure you want to delete this event?',
                message: 'After delete, you cannot restore.',
                callback: () => {
                  handleDeleteEvent();
                },
              });
            }}
            className="icon-wrapper"
          >
            <BsTrash2Fill className="icon" />
          </div>
        </Tooltip>
        <Tooltip placement="bottom" title="Other options">
          <div className="icon-wrapper">
            <BsThreeDotsVertical className="icon" />
          </div>
        </Tooltip>
        {/* <Tooltip placement="bottom" title="Close">
          <div className="icon-wrapper">
            <AiOutlineClose className="icon" />
          </div>
        </Tooltip> */}
      </header>
      <main className="event-popover__main">
        <div className="event-popover__label">
          {/* {event.title} */}
          {event.title}
          <span
            className="event-bg-color"
            style={{ '--event-bg-color': event.background_color }}
          ></span>
          {event.priority === 'high' && <Top content="High" />}
          {event.priority === 'medium' && <Liked content="Medium" />}
          {event.priority === 'low' && <Pinned content="Low" />}
        </div>
        {/* Time */}
        <div className="event-content__item event-time__wrapper">
          <AiFillCalendar className="icon" />
          <div className="event-time">
            <span>
              Start:&nbsp;
              {dayjs(event.start).format('HH:mm, D - M - YYYY (dddd) ')}
            </span>
            <span>
              End:&nbsp;{dayjs(event.end).format('HH:mm, D - M - YYYY (dddd) ')}
            </span>
            <span className="sub-text">Repeat every week</span>
          </div>
        </div>
        {/* Creator */}
        <div className="event-content__item event-creator__wrapper">
          <BiSolidUserCircle className="icon" />
          <span>
            {/* {event.creator.profile.name} */}
            Ramy
          </span>
        </div>
        {/* Description */}
        <div className="event-content__item event-desc__wrapper">
          <div>
            <BsTextParagraph className="icon" />
          </div>
          <div className="event-description">{event.description}</div>
        </div>
      </main>
    </div>
  );
};

export default EventPopover;
