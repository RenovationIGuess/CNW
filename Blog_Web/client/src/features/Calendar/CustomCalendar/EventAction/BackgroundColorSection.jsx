import { ColorPicker } from 'antd';
import React from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';

const BackgroundColorSection = ({ event, setEvent }) => {
  return (
    <div className="edit-tag__item">
      <p className="edit-tag__title">Event Background Color</p>
      <div className="tag-color-edit justify-start">
        <div>
          <ColorPicker
            showText={(color) => <span>{color.toHexString()}</span>}
            value={event.background_color}
            onChangeComplete={(value) => {
              setEvent({
                ...event,
                background_color: value.toHexString(),
              });
            }}
          />
        </div>
        <div className="copyright-settings-title">
          <span>The text color will always be black and wrap in white</span>
          <AiOutlineInfoCircle className="icon" />
        </div>
      </div>
    </div>
  );
};

export default BackgroundColorSection;
