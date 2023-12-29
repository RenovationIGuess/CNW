import { Popover } from 'antd';
import React, { useState } from 'react';
import EventPopover from '../EventPopover';
import dayjs from 'dayjs';

const CustomWeekEvent = ({ event }) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <Popover
      trigger={'click'}
      open={popoverOpen}
      onOpenChange={() => setPopoverOpen(!popoverOpen)}
      content={<EventPopover event={event} setPopoverOpen={setPopoverOpen} />}
      placement="top"
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

export default CustomWeekEvent;
