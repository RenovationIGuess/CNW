import React from 'react';
import './UserModal.scss';
import { FaUserAstronaut } from 'react-icons/fa';
import { IoIosArrowForward } from 'react-icons/io';
import { IoPower } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import axiosClient from '~/axios';
import { userStateContext } from '~/contexts/ContextProvider';

const UserModal = ({ handleUserModalState }) => {
  const { setCurrentUser, setUserToken } = userStateContext();

  const handleLogOut = () => {
    axiosClient.post('/auth/signout').then(() => {
      setCurrentUser({});
      setUserToken(null);
    });
  };

  return (
    <div className="user-modal__container">
      <div className="user-modal">
        <div className="header-account-menu__scroll">
          <div className="header-account-menu__section">
            <div className="header-account-menu__title">Thông tin của tôi</div>
            <ul>
              <li className="header-account-menu-item">
                <Link
                  to="/profile/private"
                  className="header-account-menu-item__content"
                  onClick={handleUserModalState}
                >
                  <FaUserAstronaut className="icon-menu" />
                  <span>Trang cá nhân (Private)</span>
                  <IoIosArrowForward className="icon-arrow" />
                </Link>
              </li>
              <li className="header-account-menu-item">
                <Link
                  to="/profile/1/public"
                  className="header-account-menu-item__content"
                  onClick={handleUserModalState}
                >
                  <FaUserAstronaut className="icon-menu" />
                  <span>Trang cá nhân (Public)</span>
                  <IoIosArrowForward className="icon-arrow" />
                </Link>
              </li>
            </ul>
          </div>
          <div className="header-account-menu__section">
            <ul>
              <li className="header-account-menu-item">
                <div
                  onClick={handleLogOut}
                  className="header-account-menu-item__content"
                >
                  <IoPower className="icon-menu" />
                  <span>Thoát đăng nhập</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
