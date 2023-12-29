import React, { useMemo } from 'react';
import SearchBar from '../SearchBar/SearchBar';
import { BsThreeDots, BsFillBellFill } from 'react-icons/bs';
import './Header.scss';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Popover, Tooltip } from 'antd';
import { userStateContext } from '~/contexts/ContextProvider';
import Notifications from '../Notifications/Notifications';
dayjs.extend(relativeTime);

const Header = ({
  type,
  data,
  // searchValue,
  // setSearchValue,
  loading,
}) => {
  const { currentUser } = userStateContext();

  const dataPath = useMemo(() => {
    return data?.path?.map((item) => item.title);
  }, [data?.id]);

  return (
    //  header--transparent
    <div id="header" className="header">
      {/* header__wrp--transparent */}
      <div className="header__wrp">
        <div className="header__inner">
          <div className="header__left">
            {/* VD: ten teamspace / ten page (notes...) */}
            <div className="header-tab-wrapper">
              {type === 'note_page' ? (
                loading ? (
                  <div className="skeleton-title skeleton"></div>
                ) : (
                  <Tooltip title={dataPath.join('/')} placement="bottom">
                    <div className="flex items-center">
                      {dataPath.length > 3 ? (
                        <>
                          <div className="header-tab">
                            <p className="header-tab-name">{dataPath[0]}</p>
                            <div className="header-tab__underline"></div>
                          </div>
                          <span className="header-tab-name">&nbsp;/&nbsp;</span>
                          <div className="header-tab">
                            <p className="header-tab-name">...</p>
                            {/* <div className="header-tab__underline"></div> */}
                          </div>
                          <span className="header-tab-name">&nbsp;/&nbsp;</span>
                          <div className="header-tab">
                            <div className="flex items-center flex-row">
                              {/* <FaBookOpen className="mr-[6px]" /> */}
                              <p className="header-tab-name">
                                {dataPath[dataPath.length - 1]}
                              </p>
                            </div>
                            <div className="header-tab__underline"></div>
                          </div>
                        </>
                      ) : (
                        dataPath.map((item, ind) => (
                          <div key={ind} className="flex items-center">
                            <div className="header-tab">
                              <p className="header-tab-name">{item}</p>
                              <div className="header-tab__underline"></div>
                            </div>
                            {ind !== dataPath.length - 1 && (
                              <span className="header-tab-name">
                                &nbsp;/&nbsp;
                              </span>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </Tooltip>
                )
              ) : (
                <></>
              )}
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
              {type === 'note_page' &&
                (loading ? (
                  <div className="skeleton-title skeleton"></div>
                ) : (
                  <Tooltip
                    placement="bottomLeft"
                    title={
                      <>
                        <p className="edited-tooltip__content mb-[2px]">
                          Created by{' '}
                          <span className="text-white">
                            {currentUser.profile.name}
                          </span>{' '}
                          {dayjs(data.created_at).fromNow()}
                        </p>
                        <p className="edited-tooltip__content">
                          Updated by{' '}
                          <span className="text-white">
                            {currentUser.profile.name}
                          </span>{' '}
                          {dayjs(data.updated_at).fromNow()}
                        </p>
                      </>
                    }
                  >
                    <span className="header-tab-name">
                      Edited {dayjs(data.updated_at).fromNow()}
                    </span>
                  </Tooltip>
                ))}
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
              <div role="button" className="header-item__button">
                <div className="header-item__icon">
                  <BsThreeDots className="item__icon" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
