import React from 'react';
import {
  AiFillCalendar,
  AiFillFolderOpen,
  AiFillSetting,
} from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { cn } from '~/utils';
import { IoSearch } from 'react-icons/io5';
import OtherOptions from './OtherOptions';
import { Tooltip } from 'antd';
import { GiCardExchange, GiNotebook } from 'react-icons/gi';
import { images } from '~/constants';
import { BsPlusLg, BsThreeDots } from 'react-icons/bs';
import { HiPlus } from 'react-icons/hi';

const SkeletonLoadingItem = () => {
  return (
    <div className={cn(`elements-header`)}>
      <div className={`flex items-center overflow-hidden w-full`}>
        <div className="teamspace-header__title pl-2">
          <div className="skeleton skeleton-title w-full"></div>
        </div>
      </div>
    </div>
  );
};

const SidebarSkeleton = () => {
  const navigate = useNavigate();

  return (
    <>
      <aside className={cn('group/sidebar w-60', 'sidebar')}>
        <div className="user__info-section">
          <div className="user__info-section-wrp">
            {/* Avatar */}
            <div className="user__info-avatar">
              <div className="skeleton-avatar skeleton"></div>
            </div>
            {/* User name */}
            <div className="user__info">
              <div className="skeleton skeleton-title"></div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="tools-container">
          <Tooltip title="Search for everything ~" placement="right">
            <div className="user-option">
              <div className="user-option__icon-wrp">
                <IoSearch className="user-option__icon" />
              </div>
              <div className="option-title">Search</div>
              <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
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
          <Tooltip title="All of yours notes here ~" placement="right">
            <div className="user-option" onClick={() => navigate('/notes')}>
              <div className="user-option__icon-wrp">
                <GiNotebook className="user-option__icon" />
              </div>
              <div className="option-title">Notes</div>
            </div>
          </Tooltip>
          <Tooltip title="All of yours tasks in one schedule" placement="right">
            <div className="user-option" onClick={() => navigate('/calendar')}>
              <div className="user-option__icon-wrp">
                <AiFillCalendar className="user-option__icon" />
              </div>
              <div className="option-title">Calendar</div>
            </div>
          </Tooltip>
          <Tooltip title="All of yours decks here ~" placement="right">
            <div className="user-option" onClick={() => navigate('/decks')}>
              <div className="user-option__icon-wrp">
                <GiCardExchange className="user-option__icon" />
              </div>
              <div className="option-title">Flashcard Decks</div>
            </div>
          </Tooltip>
        </div>

        <div
          className={cn('w-full min-h-0 flex flex-col flex-1 overflow-y-auto')}
        >
          <div className="main-tools-container">
            <div className="note-container">
              <div className="option-list" data-toggle="user-note-list">
                {/* Starred section */}
                <div className="option-list__wrp">
                  <div className="option-list__header">
                    <Tooltip placement="topLeft" title="Or Favorites">
                      <div className="list-header__title">Starred</div>
                    </Tooltip>
                    <div className="flex items-center gap-[4px]">
                      <BsThreeDots className="list-header__icon" />
                      <BsPlusLg className="list-header__icon" />
                    </div>
                  </div>
                  <div className="option-list__menu">
                    {Array.from({ length: 1 }).map((_, i) => (
                      <SkeletonLoadingItem key={i} />
                    ))}
                  </div>
                </div>

                {/* Teamspace section */}
                <div className="option-list__wrp">
                  <div className="option-list__header">
                    <Tooltip
                      placement="topLeft"
                      title="What could be better than working with your team?"
                    >
                      <div className="list-header__title">Teamspaces</div>
                    </Tooltip>

                    <div className="flex items-center gap-[4px]">
                      <BsThreeDots className="list-header__icon" />
                      <BsPlusLg className="list-header__icon" />
                    </div>
                  </div>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <SkeletonLoadingItem key={i} />
                  ))}
                </div>

                {/* Public dir section */}
                <div className="option-list__wrp">
                  <div className="option-list__header">
                    <div className="list-header__title">Public</div>
                    <div className="flex items-center gap-[4px]">
                      <Tooltip placement="top" title="View detail">
                        <AiFillFolderOpen className="list-header__icon" />
                      </Tooltip>

                      <HiPlus className="list-header__icon" />
                    </div>
                  </div>
                  {Array.from({ length: 2 }).map((_, i) => (
                    <SkeletonLoadingItem key={i} />
                  ))}
                </div>

                {/* Private dir section */}
                <div className="option-list__wrp">
                  <div className="option-list__header">
                    <div className="list-header__title">Private</div>
                    <div className="flex items-center gap-[4px]">
                      <Tooltip placement="top" title="View detail">
                        <AiFillFolderOpen className="list-header__icon" />
                      </Tooltip>

                      <HiPlus className="list-header__icon" />
                    </div>
                  </div>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonLoadingItem key={i} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <OtherOptions />
        </div>

        <div className="flex items-center justify-center gap-3 py-2 px-4 h-[9]">
          <img src={images.smblacknfc} className="h-8" />
          <p className="font-medium text-[10px] copyright-label">
            Copyright © RAMU. All Rights Reserved.
          </p>
        </div>
      </aside>
    </>
  );
};

export default SidebarSkeleton;
