import { Popover, Tooltip } from 'antd';
import React from 'react';
import IconSelector from '~/components/IconSelector/IconSelector';

const IconSection = ({ title, item, setItem }) => {
  return (
    <div className="edit-tag__item">
      <p className="edit-tag__title">{title}</p>
      <div className="icon-select__container">
        <Popover
          rootClassName="custom-popover"
          content={
            <IconSelector callback={(icon) => setItem({ ...item, icon })} />
          }
          placement="bottom"
          trigger={'click'}
        >
          <Tooltip placement="top" title={'Click to change icon'}>
            <div className="icon-select__wrapper">
              {item.icon.includes('/') ? (
                <img src={item.icon} alt="item-icon" />
              ) : (
                <p className="text-5xl">{item.icon}</p>
              )}
            </div>
          </Tooltip>
        </Popover>
      </div>
    </div>
  );
};

export default IconSection;
