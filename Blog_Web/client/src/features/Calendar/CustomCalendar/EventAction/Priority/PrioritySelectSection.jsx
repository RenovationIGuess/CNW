import { Tooltip } from 'antd';
import React from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import PrioritySelector from './PrioritySelector';

const priorityDescription =
  'Priority is a way to organize your events by importance. You can set a priority for each event to help you focus on the most important events first.';

const PrioritySelectSection = ({ event, setEvent }) => {
  return (
    <div className="edit-tag__item" style={{ marginBottom: 20 }}>
      <div className="flex items-center">
        <p className="edit-tag__title">Event Priority</p>
        <div className="copyright-settings-title">
          <Tooltip title={priorityDescription} placement="top">
            <AiOutlineInfoCircle className="icon" />
          </Tooltip>
        </div>
      </div>
      <PrioritySelector event={event} setEvent={setEvent} />
    </div>
  );
};

export default PrioritySelectSection;
