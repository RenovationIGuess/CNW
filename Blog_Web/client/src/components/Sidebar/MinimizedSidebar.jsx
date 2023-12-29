import React, { useState } from 'react';
import './Sidebar.scss';
import { AiFillCalendar, AiFillSetting } from 'react-icons/ai';
import { IoSearch } from 'react-icons/io5';
import UserProfileSection from './UserProfileSection';
import OtherOptions from './OtherOptions';
import ActionNotiToast from '../ActionNotiToast';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'antd';

const MinimizedSidebar = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  return (
    <nav className="sidebar__container sidebar__container--closed flex-shrink-0 flex-grow-0 position-relative">
      <div className="flex flex-col h-full max-h-full">
        <UserProfileSection
          isUserModalOpen={isUserModalOpen}
          setIsUserModalOpen={setIsUserModalOpen}
          handleMinimizedSidebar={() => {
            setIsUserModalOpen(false);
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
