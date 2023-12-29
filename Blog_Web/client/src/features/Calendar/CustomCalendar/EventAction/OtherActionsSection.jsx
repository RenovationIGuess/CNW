import { Tooltip } from 'antd';
import React from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { MdRadioButtonChecked, MdRadioButtonUnchecked } from 'react-icons/md';

const OtherActionsSection = ({ event, setEvent }) => {
  return (
    <div className="edit-tag__item">
      <p className="edit-tag__title">Other Actions</p>
      <div className="task-actions">
        <div className="copyright-settings-original-radio">
          <div
            className="newpost-radio"
            onClick={() => {
              setEvent({ ...event, pinned: !event.pinned });
            }}
          >
            {event.pinned ? (
              <MdRadioButtonChecked className="radio-icon-checked" />
            ) : (
              <MdRadioButtonUnchecked className="radio-icon-unchecked" />
            )}
            <div className="copyright-settings-original-radio-name">
              Pin this event
            </div>
            <div className="copyright-settings-title">
              <Tooltip title="A pinned event will" placement="top">
                <AiOutlineInfoCircle className="icon" />
              </Tooltip>
            </div>
          </div>
        </div>
        <div className="copyright-settings-original-radio">
          <div
            className="newpost-radio"
            onClick={() => {
              setEvent({ ...event, repeated: !event.repeated });
            }}
          >
            {event.repeated ? (
              <MdRadioButtonChecked className="radio-icon-checked" />
            ) : (
              <MdRadioButtonUnchecked className="radio-icon-unchecked" />
            )}
            <div className="copyright-settings-original-radio-name">
              Repeated
            </div>
            <div className="copyright-settings-title">
              <Tooltip title="Every weeks" placement="top">
                <AiOutlineInfoCircle className="icon" />
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherActionsSection;
