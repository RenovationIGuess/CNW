import React from 'react';
import './Sidebar.scss';
import { AiFillSetting } from 'react-icons/ai';
import { IoSearch } from 'react-icons/io5';
import OtherOptions from './OtherOptions';
import { Tooltip } from 'antd';
import UserProfileSection from './UserProfileSection';

const MinimizedSidebar = ({ toggleSidebar }) => {
  return (
    <nav className="sidebar__container sidebar__container--closed flex-shrink-0 flex-grow-0 position-relative">
      <div className="flex flex-col h-full max-h-full">
        <UserProfileSection
          handleMinimizedSidebar={() => {
            toggleSidebar();
          }}
          showToggleIcon={true}
        />
        <div className="sidebar-scroll">
          {/* Settings */}
          <div className="tools-container">
            <Tooltip title="Search for everything ~" placement="right">
              <div className="user-option">
                <div className="user-option__icon-wrp">
                  <IoSearch className="user-option__icon" />
                </div>
                <div className="option-title">Search</div>
              </div>
            </Tooltip>
            <Tooltip title="Settings" placement="right">
              <div className="user-option">
                <div className="user-option__icon-wrp">
                  <AiFillSetting className="user-option__icon setting-option__icon" />
                </div>
                <div className="option-title">Setting</div>
              </div>
            </Tooltip>
          </div>

          {/* Other options */}
          <OtherOptions />
        </div>
      </div>
    </nav>
  );
};

export default MinimizedSidebar;
