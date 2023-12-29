import { Tooltip } from 'antd';
import React from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { IoIosArrowDown } from 'react-icons/io';
import Liked from '~/components/Actions/Liked';
import Pinned from '~/components/Actions/Pinned';
import Top from '~/components/Actions/Top';

const TodayEventsSkeleton = () => {
  return (
    <div className="tasks-container">
      <div className="flex flex-col mb-3">
        <div className="category-header">
          <Top content={'High Priority'} />
          <div className="flex items-center">
            <Tooltip title="Add a new task" placement="top">
              <div className="icon-wrapper">
                <AiOutlinePlus className="icon" />
              </div>
            </Tooltip>
            <Tooltip title="Minimize" placement="top">
              <div className="icon-wrapper">
                <IoIosArrowDown className="icon" />
              </div>
            </Tooltip>
          </div>
        </div>
        <ul className="task-type__list">
          <div className="skeleton skeleton-loading-height-20-width-full mt-2 mb-3"></div>
          <div className="skeleton skeleton-loading-height-20-width-full"></div>
        </ul>
      </div>
      <div className="flex flex-col mb-3">
        <div className="category-header">
          <Liked content={'Medium Priority'} />
          <div className="flex items-center">
            <Tooltip title="Add a new task" placement="top">
              <div className="icon-wrapper">
                <AiOutlinePlus className="icon" />
              </div>
            </Tooltip>
            <Tooltip title="Minimize" placement="top">
              <div className="icon-wrapper">
                <IoIosArrowDown className="icon" />
              </div>
            </Tooltip>
          </div>
        </div>
        <ul className="task-type__list">
          <div className="skeleton skeleton-loading-height-20-width-full mt-2 mb-3"></div>
          <div className="skeleton skeleton-loading-height-20-width-full"></div>
        </ul>
      </div>
      <div className="flex flex-col">
        <div className="category-header">
          <Pinned content={'Low Priority'} />
          <div className="flex items-center">
            <Tooltip title="Add a new task" placement="top">
              <div className="icon-wrapper">
                <AiOutlinePlus className="icon" />
              </div>
            </Tooltip>
            <Tooltip title="Minimize" placement="top">
              <div className="icon-wrapper">
                <IoIosArrowDown className="icon" />
              </div>
            </Tooltip>
          </div>
        </div>
        <ul className="task-type__list">
          <div className="skeleton skeleton-loading-height-20-width-full mt-2 mb-3"></div>
          <div className="skeleton skeleton-loading-height-20-width-full"></div>
        </ul>
      </div>
    </div>
  );
};

export default TodayEventsSkeleton;
