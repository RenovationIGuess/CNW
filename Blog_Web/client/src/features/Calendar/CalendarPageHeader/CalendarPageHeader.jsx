import { Popover } from 'antd';
import React from 'react';
import { BsFillBellFill, BsThreeDots } from 'react-icons/bs';
import { useLocation } from 'react-router-dom';
import Notifications from '~/components/Notifications/Notifications';
import SearchBar from '~/components/SearchBar/SearchBar';
import CalendarPageHeaderLeft from './CalendarPageHeaderLeft';

const CalendarPageHeader = ({ showNotifications, showOtherOptions }) => {
  const { pathname } = useLocation();

  return (
    <div id="header" className="header">
      {/* header__wrp--transparent */}
      <div className="header__wrp">
        <div className="header__inner">
          {pathname.includes('/schedule/') && <CalendarPageHeaderLeft />}
          <div className="header__main">
            <SearchBar
              // searchValue={searchValue}
              // setSearchValue={setSearchValue}
              showSuggest={true}
              showCategory={true}
            />
          </div>
          <div className="header__right">
            <div className="header-item"></div>
            {showNotifications && (
              <Popover
                rootClassName="custom-popover"
                placement="bottomLeft"
                trigger={'click'}
                content={<Notifications />}
              >
                <div className="header-item">
                  <span data-count="100" className="notification_num"></span>
                  <div role="button" className="header-item__button">
                    <div className="header-item__icon">
                      <BsFillBellFill className="item__icon" />
                    </div>
                  </div>
                </div>
              </Popover>
            )}
            {showOtherOptions && (
              <div className="header-item">
                <div role="button" className="header-item__button">
                  <div className="header-item__icon">
                    <BsThreeDots className="item__icon" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPageHeader;
