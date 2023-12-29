import { Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  AiFillFolder,
  AiFillFolderOpen,
  AiOutlineInfoCircle,
} from 'react-icons/ai';
import { IoIosArrowForward } from 'react-icons/io';
import useCalendarStore from '~/store/useCalendarStore';
import useModalStore from '~/store/useModalStore';
import { cn } from '~/utils';

const ScheduleLocation = () => {
  const [setDirectoryModalOpen, setDirModalUseType, setDataToSetPath] =
    useModalStore((state) => [
      state.setDirectoryModalOpen,
      state.setDirModalUseType,
      state.setDataToSetPath,
    ]);

  const [curSchedule] = useCalendarStore((state) => [state.curSchedule]);

  const [hovered, setHovered] = useState(false);

  return (
    <div className="schedule-info__wrapper">
      {/* <div className="info-wrapper__header">
        <AiFillFolderOpen className="info-icon" />
        <div className="flex items-center">
          <p className="info-label">Location</p>
          <div className="copyright-settings-title">
            <Tooltip title={'Default is Private Directory'} placement="top">
              <AiOutlineInfoCircle className="icon" />
            </Tooltip>
          </div>
        </div>
      </div> */}

      <div>
        <ul className={cn('location-list', 'location-list--lg', 'mt-0')}>
          {curSchedule.path.map((item, index) => (
            <li key={item.id} className="location-item">
              {item.icon.includes('/') ? (
                <img className="item-icon" src={item.icon} alt="" />
              ) : (
                <span className="item-icon">{item.icon}</span>
              )}
              <span className="item-name">{item.title}</span>
              {index !== curSchedule.path.length - 1 && (
                <span>
                  <IoIosArrowForward className="arrow-icon" />
                </span>
              )}
            </li>
          ))}
        </ul>
        <div
          className={cn(`banner-entry`, 'mt-2')}
          onMouseOver={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => {
            setDirModalUseType('path');
            setDirectoryModalOpen(true);
            setDataToSetPath(curSchedule);
          }}
        >
          {hovered ? (
            <AiFillFolderOpen className="icon" />
          ) : (
            <AiFillFolder className="icon" />
          )}
          <p>Choose Location</p>
        </div>
      </div>
    </div>
  );
};

export default ScheduleLocation;
