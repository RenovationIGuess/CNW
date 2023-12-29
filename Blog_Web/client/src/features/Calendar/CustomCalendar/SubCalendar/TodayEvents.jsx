import { Tooltip } from 'antd';
import React, { useMemo } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { IoIosArrowDown } from 'react-icons/io';
import Liked from '~/components/Actions/Liked';
import Pinned from '~/components/Actions/Pinned';
import Top from '~/components/Actions/Top';
import useCalendarStore from '~/store/useCalendarStore';
import EventItem from './EventItem';
import isBetween from 'dayjs/plugin/isBetween';
import dayjs from 'dayjs';

dayjs.extend(isBetween);

const TodayEvents = () => {
  const [events] = useCalendarStore((state) => [state.events]);

  const { highPriorEvents, medPriorEvents, lowPriorEvents, pinnedEvents } =
    useMemo(() => {
      return {
        highPriorEvents: events.filter((event) => event.priority === 'high' && dayjs().isBetween(event.start, event.end)),
        medPriorEvents: events.filter((event) => event.priority === 'medium' && dayjs().isBetween(event.start, event.end)),
        lowPriorEvents: events.filter((event) => event.priority === 'low' && dayjs().isBetween(event.start, event.end)),
        pinnedEvents: events.filter((event) => event.pinned),
      };
    }, [events]);

  return (
    <div className="tasks-container">
      <div className="flex flex-col mb-3">
        <div className="category-header">
          <Top content={'High Priority'} />
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
        <ul className="task-type__list">
          {highPriorEvents.length === 0 ? (
            <p className="no-item">No events found ~</p>
          ) : (
            highPriorEvents.map((event) => (
              <EventItem key={event.id} event={event} />
            ))
          )}
        </ul>
      </div>
      <div className="flex flex-col mb-3">
        <div className="category-header">
          <Liked content={'Medium Priority'} />
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
        <ul className="task-type__list">
          {medPriorEvents.length === 0 ? (
            <p className="no-item">No events found ~</p>
          ) : (
            medPriorEvents.map((event) => (
              <EventItem key={event.id} event={event} />
            ))
          )}
        </ul>
      </div>
      <div className="flex flex-col">
        <div className="category-header">
          <Pinned content={'Low Priority'} />
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
        <ul className="task-type__list">
          {lowPriorEvents.length === 0 ? (
            <p className="no-item">No events found ~</p>
          ) : (
            lowPriorEvents.map((event) => (
              <EventItem key={event.id} event={event} />
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default TodayEvents;
