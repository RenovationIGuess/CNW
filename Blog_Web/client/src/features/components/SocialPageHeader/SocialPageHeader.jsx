import React from 'react';
import SearchBar from '~/components/SearchBar/SearchBar';
import { userStateContext } from '~/contexts/ContextProvider';
import '~/components/Header/Header.scss';
import Notifications from '~/components/Notifications/Notifications';
import { Popover } from 'antd';
import { BsFillBellFill } from 'react-icons/bs';
import { AiFillEdit } from 'react-icons/ai';
import NewPostPopover from './NewPostPopover/NewPostPopover';
import UserAvatarPopover from './UserAvatarPopover/UserAvatarPopover';

const SocialPageHeader = ({}) => {
  const { currentUser } = userStateContext();

  return (
    <div className="header" id="header">
      <div className="header__wrp">
        <div className="header__inner">
          <div className="header__main">
            <SearchBar showSuggest={true} showCategory={true} />
          </div>
          <div className="header__right">
            <Popover
              rootClassName="custom-popover"
              placement="bottomLeft"
              content={<NewPostPopover />}
            >
              <div className="header-item">
                <div role="button" className="header-item__button">
                  <div className="header-item__icon">
                    <AiFillEdit className="item__icon" />
                  </div>
                </div>
              </div>
            </Popover>

            <Popover
              rootClassName="custom-popover"
              placement="bottomLeft"
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

            <Popover
              rootClassName="custom-popover"
              placement="bottomLeft"
              content={<UserAvatarPopover />}
            >
              <div className="header-item">
                <div className="header-avatar">
                  <div className="w-10 h-10 relative inline-block">
                    <img
                      className="main-avatar"
                      src={currentUser.profile.avatar}
                      alt="user-avatar"
                    />
                    <img
                      className="avatar-frame"
                      src={
                        'https://upload-os-bbs.hoyolab.com/upload/2022/11/21/14215e7b26cd7f64176961079876b187_7247085750621715928.png?x-oss-process=image/resize,m_fixed,h_318,w_318'
                      }
                      alt="avatar-frame"
                    />
                  </div>
                </div>
              </div>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialPageHeader;
