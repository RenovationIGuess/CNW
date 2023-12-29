import { Popover } from 'antd';
import React, { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdRadioButtonChecked, MdRadioButtonUnchecked } from 'react-icons/md';
import useCalendarStore from '~/store/useCalendarStore';
import SchedulePopover from './SchedulePopover';

const ScheduleItem = ({ schedule, index, handleDeleteSchedule }) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const [
    events,
    setEvents,
    hiddenEvents,
    setHiddenEvents,
    shownSchedules,
    setShownSchedules,
  ] = useCalendarStore((state) => [
    state.events,
    state.setEvents,
    state.hiddenEvents,
    state.setHiddenEvents,
    state.shownSchedules,
    state.setShownSchedules,
  ]);

  return (
    <li
      className="shown-schedule__item"
      key={schedule.id}
      onClick={() => {
        shownSchedules[index].show = !shownSchedules[index].show;
        if (shownSchedules[index].show) {
          setEvents([
            ...events,
            ...hiddenEvents.filter((e) => e.schedules.includes(schedule.id)),
          ]);
          setHiddenEvents(
            hiddenEvents.filter((e) => !e.schedules.includes(schedule.id))
          );
        } else {
          setEvents(
            events.filter((e) => {
              // If the event is in the schedule that will be hidden, but still in the other shown schedules
              // then we won't hide it
              // => Only hide the event that is not shown in any current shown schedules
              if (
                !shownSchedules
                  .filter((s) => s.id !== schedule.id && s.show)
                  .some((s) => e.schedules.includes(s.id))
              ) {
                hiddenEvents.push(e);
                return false;
              }
              return true;
            })
          );
          setHiddenEvents([...hiddenEvents]);
        }
        setShownSchedules([...shownSchedules]);
      }}
    >
      <div className="copyright-settings-original-radio">
        <div className="newpost-radio">
          {shownSchedules[index].show ? (
            <MdRadioButtonChecked className="radio-icon-checked" />
          ) : (
            <MdRadioButtonUnchecked className="radio-icon-unchecked" />
          )}
        </div>
      </div>
      <div className="schedule-icon__wrapper">
        {schedule.icon.includes('/') ? (
          <img src={schedule.icon} alt="schedule-icon" />
        ) : (
          <p style={{ fontSize: 22, lineHeight: 1 }}>{schedule.icon}</p>
        )}
      </div>
      <div className="schedule-title">{schedule.title}</div>
      <Popover
        rootClassName="custom-popover"
        placement="bottomLeft"
        trigger={'click'}
        arrow={false}
        open={popoverOpen}
        onOpenChange={() => setPopoverOpen(!popoverOpen)}
        content={
          <SchedulePopover
            scheduleId={schedule.id}
            setPopoverOpen={setPopoverOpen}
            handleDeleteSchedule={handleDeleteSchedule}
          />
        }
      >
        {/* <Tooltip placement="bottom" title="Actions for this schedule"> */}
        <div onClick={(e) => e.stopPropagation()} className="option-icon">
          <BsThreeDotsVertical className="icon" />
        </div>
        {/* </Tooltip> */}
      </Popover>
    </li>
  );
};

const ShownSchedules = ({ handleDeleteSchedule }) => {
  const [schedules] = useCalendarStore((state) => [state.schedules]);

  return (
    <ul className="shown-schedules__container">
      {schedules.length === 0 ? (
        <p className="no-item pl-2">No schedules found ~.~</p>
      ) : (
        schedules.map((schedule, index) => (
          <ScheduleItem
            key={schedule.id}
            schedule={schedule}
            index={index}
            handleDeleteSchedule={handleDeleteSchedule}
          />
        ))
      )}
    </ul>
  );
};

export default ShownSchedules;
