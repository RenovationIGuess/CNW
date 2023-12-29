import React, { useMemo } from 'react';
import { AiFillHome } from 'react-icons/ai';
import SearchBar from '../SearchBar/SearchBar';
import { BsFillBellFill } from 'react-icons/bs';
import dayjs from 'dayjs';
import Notifications from '../Notifications/Notifications';
import { Popover } from 'antd';

const TransparentHeader = ({
  currentUser,
  // searchValue,
  // setSearchValue
}) => {
  // isDay === true => morning else evening
  const hiText = useMemo(() => {
    const currentHour = dayjs().hour();
    if (currentHour >= 0 && currentHour <= 12) {
      return 'Morning';
    } else if (currentHour > 12 && currentHour < 5) {
      return 'Afternoon';
    } else return 'Evening';
  }, []);

  return (
    <div id="header" className="header header--transparent">
      {/* header__wrp--transparent */}
      <div className="header__wrp header__wrp--transparent">
        <div className="header__inner">
          <div className="header__left">
            {/* VD: ten teamspace / ten page (notes...) */}
            <div className="header-tab-wrapper">
              <div className="header-tab">
                <p className="header-tab-name select-none">
                  Good {hiText}, {currentUser.profile.name}!
                </p>
              </div>
            </div>
          </div>
          <div className="header__main">
            <SearchBar
              // searchValue={searchValue}
              // setSearchValue={setSearchValue}
              showSuggest={true}
              showCategory={true}
            />
          </div>
          <div className="header__right">
            <div className="header-item">
              <span className="header-tab-name uppercase">
                {new Date().toDateString()}
              </span>
            </div>
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
            <div className="header-item">
              <div role="button" className="customize-option">
                <AiFillHome className="customize-icon" />
                <span className="customize-title">Customize</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransparentHeader;
