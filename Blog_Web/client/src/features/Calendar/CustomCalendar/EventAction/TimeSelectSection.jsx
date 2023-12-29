import React from 'react';
import CustomDatePicker from './CustomDatePicker';
import CustomTimePicker from './CustomTimePicker';
import { Tooltip } from 'antd';
import { MdOutlineRemoveCircleOutline } from 'react-icons/md';
import { AiOutlineCopy, AiOutlinePlusCircle } from 'react-icons/ai';
import { daysInWeek } from '../constants/daysInWeek';

const TimeSelectSection = ({ event, setEvent, errors }) => {
  return (
    <div className="edit-tag__item">
      <p className="edit-tag__title">Select Time</p>
      <CustomDatePicker event={event} setEvent={setEvent} errors={errors} />
      {/* diw - days in week */}
      {event.repeated && (
        <div className="diw-container">
          {daysInWeek.map((item, index) => (
            <div key={index} className="diw-item">
              <div className="diw-item__name">{item.name}</div>
              <div className="diw-item__time-picker">
                <CustomTimePicker event={event} setEvent={setEvent} />
              </div>
              <div className="diw-actions">
                <div className="action-item">
                  <Tooltip
                    title={<span className="text-xs">Remove</span>}
                    placement="top"
                  >
                    <MdOutlineRemoveCircleOutline className="action-item__icon" />
                  </Tooltip>
                </div>

                <div className="action-item">
                  <Tooltip
                    title={<span className="text-xs">Add time</span>}
                    placement="top"
                  >
                    <AiOutlinePlusCircle className="action-item__icon" />
                  </Tooltip>
                </div>

                <div className="action-item">
                  <Tooltip
                    title={
                      <span className="text-xs">
                        Copy time to all other days
                      </span>
                    }
                    placement="top"
                  >
                    <AiOutlineCopy className="action-item__icon" />
                  </Tooltip>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimeSelectSection;
