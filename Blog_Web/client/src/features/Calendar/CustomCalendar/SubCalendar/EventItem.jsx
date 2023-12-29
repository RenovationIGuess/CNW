import { Popover } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import EventPopover from '../EventPopover';
import clsx from 'clsx';

const EventItem = ({ event }) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <Popover
      placement="right"
      trigger={'click'}
      open={popoverOpen}
      onOpenChange={() => setPopoverOpen(!popoverOpen)}
      content={<EventPopover event={event} setPopoverOpen={setPopoverOpen} />}
    >
      <li
        className={clsx(
          'task-item',
          { 'high-prior': event.priority === 'high' },
          { 'medium-prior': event.priority === 'medium' },
          { 'low-prior': event.priority === 'low' }
        )}
      >
        <div className="task-time__wrapper">
          <span>{dayjs(event.start).format('HH:mm')}</span>
          <span>-</span>
          <span>{dayjs(event.end).format('HH:mm')}</span>
        </div>
        <div className="task-title">{event.title}</div>
      </li>
    </Popover>
  );
};

export default EventItem;
