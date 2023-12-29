import { Popover } from 'antd';
import React, { useState } from 'react';
import Liked from '~/components/Actions/Liked';
import Pinned from '~/components/Actions/Pinned';
import Top from '~/components/Actions/Top';
import EventPopover from '../EventPopover';

const CustomAgendaEvent = ({ event }) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <Popover
      content={<EventPopover event={event} setPopoverOpen={setPopoverOpen} />}
      trigger={'click'}
      placement="top"
      open={popoverOpen}
      onOpenChange={() => setPopoverOpen(!popoverOpen)}
    >
      <div className="custom-agenda-event">
        <div className="event-wrap">
          <div className="event-title">{event.title}</div>
          {/* Priority */}
          {event.priority === 'high' && <Top content="High" />}
          {event.priority === 'medium' && <Liked content="Medium" />}
          {event.priority === 'low' && <Pinned content="Low" />}
        </div>
      </div>
    </Popover>
  );
};

export default CustomAgendaEvent;
