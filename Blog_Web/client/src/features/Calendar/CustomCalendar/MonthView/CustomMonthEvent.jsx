import { Popover } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import EventPopover from '../EventPopover';

const CustomMonthEvent = ({ event }) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <Popover
      placement="top"
      trigger="click"
      open={popoverOpen}
      onOpenChange={() => setPopoverOpen(!popoverOpen)}
      content={<EventPopover event={event} setPopoverOpen={setPopoverOpen} />}
    >
      <div
        className="custom-month-event"
        style={{ '--event-bg-color': event.background_color }}
      >
        <div className="event-time__wrapper">
          <span>{dayjs(event.start).format('HH:mm')}</span>
          <span>-</span>
          <span>{dayjs(event.end).format('HH:mm')}</span>
        </div>
        <div className="rbc-event-content">{event.title}</div>
      </div>
    </Popover>
  );
};

export default CustomMonthEvent;
