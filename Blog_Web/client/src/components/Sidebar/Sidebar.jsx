import React, { useEffect, useRef, useState } from 'react';
import UserProfileSection from './UserProfileSection';
import { AiFillCalendar, AiFillSetting } from 'react-icons/ai';
import { useMediaQuery } from 'usehooks-ts';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '~/utils';
import { IoSearch } from 'react-icons/io5';
import OtherOptions from './OtherOptions';
import MinimizedSidebar from './MinimizedSidebar';
import { Tooltip } from 'antd';
import StarredSection from './StarredSection';
import TeamspaceSection from './TeamspaceSection';
import { GiCardExchange, GiNotebook } from 'react-icons/gi';
import UserDirSection from './UserDirSection';
import { images } from '~/constants';

const Sidebar = ({}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const isResizingRef = useRef(false);
  const sidebarRef = useRef(null);
  const navbarRef = useRef(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [scrollBottom, setScrollBottom] = useState(false);

  useEffect(() => {
    if (isMobile) {
      collapse();
    } else {
      resetWidth();
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      collapse();
    }
  }, [pathname, isMobile]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();

    isResizingRef.current = true;
    // Mouse move use to resize
    document.addEventListener('mousemove', handleMouseMove);
    // Stop resizing
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isResizingRef.current) return;

    let newWidth = e.clientX;

    if (newWidth < 240) {
      newWidth = 240;
    }

    if (newWidth > 480) {
      newWidth = 480;
    }

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty('left', `${newWidth}px`);
      navbarRef.current.style.setProperty(
        'width',
        `calc(100% - ${newWidth}px)`
      );
    }
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);

      sidebarRef.current.style.width = isMobile ? '100%' : `240px`;
      navbarRef.current.style.setProperty('left', isMobile ? '100%' : `240px`);
      navbarRef.current.style.setProperty(
        'width',
        isMobile ? '0' : `calc(100% - 240px)`
      );

      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sidebarRef.current.style.width = '0';
      navbarRef.current.style.setProperty('left', '0');
      navbarRef.current.style.setProperty('width', '100%');

      setTimeout(() => setIsResetting(false), 300);
    }
  };

  return (
    <>
      {isCollapsed && <MinimizedSidebar toggleSidebar={resetWidth} />}
      <aside
        ref={sidebarRef}
        className={cn(
          'group/sidebar w-60',
          'sidebar',
          isResetting && 'transition-all ease-in-out duration-300',
          isMobile && 'w-0',
          isCollapsed && 'overflow-hidden pr-0 border-r-0'
        )}
      >
        <UserProfileSection
          isUserModalOpen={isUserModalOpen}
          setIsUserModalOpen={setIsUserModalOpen}
          handleMinimizedSidebar={(e) => {
            e.stopPropagation();
            setIsUserModalOpen(false);
            collapse();
          }}
        />

        {/* Settings */}
        <div className="tools-container mb-0">
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
        </div>

        <div
          className={cn(
            'w-full min-h-0 flex flex-col flex-1 overflow-y-auto',
            scrollBottom && 'border-top'
          )}
          onScroll={(e) => {
            const item = e.currentTarget;
            if (item.scrollTop > 0) setScrollBottom(true);
            else setScrollBottom(false);
          }}
        >
          <OtherOptions />
        </div>
        <div className="flex items-center justify-center gap-3 py-2 px-4 h-[9]">
          <img src={images.smblacknfc} className="h-8" />
          <p className="font-medium text-[10px] copyright-label">
            Copyright © RAMU. All Rights Reserved.
          </p>
        </div>

        <Tooltip
          placement="right"
          title={'Drag to resize | Click to reset'}
          arrow={false}
        >
          <div
            onMouseDown={handleMouseDown}
            onClick={resetWidth}
            className={cn(
              'resize-bar',
              'opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute w-1 right-0 top-0 bottom-0 z-[1]'
            )}
          ></div>
        </Tooltip>
      </aside>
      <div
        ref={navbarRef}
        className={cn(
          'absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]',
          isResetting && 'transition-all ease-in-out duration-300',
          isMobile && 'w-full left-0'
        )}
      ></div>
    </>
  );
};

export default Sidebar;
