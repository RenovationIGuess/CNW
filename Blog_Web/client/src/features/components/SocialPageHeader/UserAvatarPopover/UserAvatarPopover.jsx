import React from 'react';
import { FaUserAstronaut, FaUsersSlash } from 'react-icons/fa';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { userStateContext } from '~/contexts/ContextProvider';
import './UserAvatarPopover.scss';
import { AiFillGift, AiFillUnlock, AiOutlineLogout } from 'react-icons/ai';

const UserAvatarPopover = () => {
  const { currentUser } = userStateContext();

  return (
    <div className="popover-dialog">
      <div className="account-menu__scroll">
        <div className="account-menu__section">
          <div className="account-menu__title">My Information</div>
          <ul>
            <li className="account-menu-item">
              <Link
                to={`/profile/${currentUser.id}/public`}
                className="account-menu-item__content"
              >
                <FaUserAstronaut className="icon" />
                <span>Personal Homepage</span>
                <MdKeyboardArrowRight className="icon" />
              </Link>
            </li>
            <li className="account-menu-item">
              <div className="account-menu-item__content">
                <AiFillGift className="icon" />
                <span>Information Management</span>
                <MdKeyboardArrowRight className="icon" />
              </div>
            </li>
            <li className="account-menu-item">
              <div className="account-menu-item__content">
                <AiFillUnlock className="icon" />
                <span>Privacy Settings</span>
                <MdKeyboardArrowRight className="icon" />
              </div>
            </li>
            <li className="account-menu-item">
              <div className="account-menu-item__content">
                <FaUsersSlash className="icon" />
                <span>Manage Blocklist</span>
                <MdKeyboardArrowRight className="icon" />
              </div>
            </li>
          </ul>
        </div>
        <div className="account-menu__section">
          <div className="account-menu__title">System Settings</div>
          <ul>
            <li className="account-menu-item">
              <div className="account-menu-item__content">
                <FaUserAstronaut className="icon" />
                <span>Change Language</span>
                <span className="account-menu-item__val">English</span>
                <MdKeyboardArrowRight className="icon" />
              </div>
            </li>
            <li className="account-menu-item">
              <div className="account-menu-item__content">
                <AiFillGift className="icon" />
                <span>Display Settings</span>
                <span className="account-menu-item__val">System Default</span>
                <MdKeyboardArrowRight className="icon" />
              </div>
            </li>
          </ul>
        </div>
        <div className="account-menu__section">
          <ul>
            <li className="account-menu-item">
              <div className="account-menu-item__content">
                <AiOutlineLogout className="icon" />
                <span>Log out</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserAvatarPopover;
