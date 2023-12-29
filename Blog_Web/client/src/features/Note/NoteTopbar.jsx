import React, { useEffect, useRef, useState } from 'react';
import TopbarLayout from '~/components/TopbarLayout';
import { BiCommentDetail } from 'react-icons/bi';
import useComponentVisible from '~/hooks/useComponentVisible';
import { TiArrowSortedDown } from 'react-icons/ti';
import { FiMinimize } from 'react-icons/fi';
import useNoteStore from '~/store/useNoteStore';
import { Popover } from 'antd';
import IconSelector from '~/components/IconSelector/IconSelector';
import axiosClient from '~/axios';
import useSidebarStore from '~/store/useSidebarStore';
import useModalStore from '~/store/useModalStore';

const NoteTopbar = ({
  // loading,
  // noteInfo,
  setEditModalOpen,
  setBgModalOpen,
}) => {
  const [note, setNote, fetchNoteLoading] = useNoteStore((state) => [
    state.note,
    state.setNote,
    state.fetchNoteLoading,
  ]);

  const [handleUpdateItems] = useSidebarStore((state) => [
    state.handleUpdateItems,
  ]);

  const [setActionToast] = useModalStore((state) => [state.setActionToast]);

  const [isMinimized, setIsMinimized] = useState(false);
  const [optionsRef, isOptionsVisible, setOptionsVisible] = useComponentVisible(
    false,
    'float-dialog'
  );
  const [iconChangeOpen, setIconChangeOpen] = useState(false);
  const [isTitleInputVisible, setTitleInputVisible] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    document.removeEventListener('click', handleClickOutside, true);
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [note.title, isTitleInputVisible]);

  const handleChangeTitle = () => {
    const url = `/notes/${note.id}`;
    axiosClient
      .patch(url, {
        ...note,
      })
      .then(({ data }) => {
        const newNote = data.data;
        const belongsToPublic = newNote.path[0].title === 'Public';

        if (belongsToPublic) {
          handleUpdateItems(newNote, false);
        } else {
          handleUpdateItems(newNote);
        }

        setNote(data.data);

        setActionToast({
          status: true,
          message: 'Updated',
        });
      })
      .catch((err) => console.error(err));
  };

  // Use specifictly for the note's title
  const handleClickOutside = (event) => {
    // The element that if we clicked in it will not conflict with the ref
    const element = document.querySelector('.' + 'user-basic-nickname');
    if (element?.contains(event.target)) {
      return;
    }
    if (titleRef.current && !titleRef.current.contains(event.target)) {
      setTitleInputVisible(false);
      if (isTitleInputVisible) handleChangeTitle();
    }
  };

  const handleMinimized = () => {
    const topbarElement = document.querySelector('.topbar');
    const headerElement = document.querySelector('.page-center-bg');
    const topbarContainer = document.querySelector('.topbar__container');
    const pageContentContainer = document.querySelector(
      '.page-root-container__content'
    );

    topbarElement.classList.toggle('topbar-hidden');
    topbarContainer.classList.toggle('topbar-hidden');

    if (isMinimized) {
      topbarElement.classList.remove('topbar-minimized');
      headerElement.classList.remove('page-center-bg-hidden');
    } else {
      topbarElement.classList.add('topbar-minimized');
      headerElement.classList.add('page-center-bg-hidden');
    }

    pageContentContainer.classList.toggle(
      'page-root-container__content--minimized'
    );

    setIsMinimized((prev) => !prev);
  };

  const handleChangeIcon = (icon) => {
    setIconChangeOpen(false);

    const url = `/notes/${note.id}`;
    axiosClient
      .patch(url, {
        ...note,
        icon: icon,
      })
      .then(({ data }) => {
        const newNote = data.data;
        const belongsToPublic = newNote.path[0].title === 'Public';

        if (belongsToPublic) {
          handleUpdateItems(newNote, false);
        } else {
          handleUpdateItems(newNote);
        }

        setNote(data.data);

        setActionToast({
          status: true,
          message: 'Updated',
        });
      })
      .catch((err) => console.error(err));
  };

  return (
    <TopbarLayout>
      <div className="page-icon-container">
        <div className="page-icon-wrp">
          {/* Has / => link else icon */}
          {fetchNoteLoading ? (
            <>
              <div className="skeleton-avatar skeleton"></div>
            </>
          ) : (
            <Popover
              rootClassName="custom-popover"
              trigger="click"
              className="custom-popover"
              open={iconChangeOpen}
              onOpenChange={() => setIconChangeOpen(!iconChangeOpen)}
              content={<IconSelector callback={handleChangeIcon} />}
              placement="bottom"
            >
              {note.icon.includes('/') ? (
                <img
                  src={note.icon}
                  alt="note-icon"
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <p className="note-emoji">{note.icon}</p>
              )}
            </Popover>
          )}
        </div>
      </div>
      <div className={`account-center-user-wrap`}>
        <div className="account-center-basic-rows account-center-basic-rows--top">
          {/* User name and level? */}
          <div
            className="account-center-basic-row1"
            ref={titleRef}
            onClick={() => !isMinimized && setTitleInputVisible(true)}
          >
            {fetchNoteLoading ? (
              <span className="skeleton-title skeleton"></span>
            ) : isTitleInputVisible ? (
              <input
                className="user-basic-nickname"
                value={note.title}
                onChange={(e) => setNote({ ...note, title: e.target.value })}
                maxLength={20}
                type="text"
                spellCheck={false}
                autoFocus={true}
              />
            ) : (
              <span className="user-basic-nickname">{note.title}</span>
            )}
          </div>
          {/* User sign, tags,... */}
          <div className="account-center-basic-row2">
            {/* Icon here */}
            <BiCommentDetail className="icon-user__intro" />
            {/* User sign here */}
            {fetchNoteLoading ? (
              <div className="skeleton skeleton-time"></div>
            ) : (
              <p>{note.description}</p>
            )}
          </div>
        </div>
      </div>
      <div className="account-center-btn-group page-center-btn-group">
        <div className="drop-expand">
          <div
            className="account-center-select-btn"
            style={{ marginRight: '16px' }}
            title="Thu nhỏ phần avatar và background"
            onClick={() => handleMinimized()}
          >
            <span className="flex items-center justify-center">
              {isMinimized ? 'Mở rộng' : 'Thu nhỏ'}
              {/* Icon goes here */}
              <FiMinimize className="icon-select__arrow" />
            </span>
          </div>
          <div
            onClick={() => setOptionsVisible(!isOptionsVisible)}
            ref={optionsRef}
            className="account-center-select-btn"
          >
            <span className="flex items-center justify-center">
              Chỉnh sửa
              {/* Icon goes here */}
              <TiArrowSortedDown className="icon-select__arrow" />
            </span>
          </div>
          {isOptionsVisible && (
            <div className="float-dialog">
              <div className="account-center-select-submenu">
                <div
                  onClick={() => setEditModalOpen(true)}
                  className="account-center-submenu-item"
                >
                  Hoàn thiện thông tin note
                </div>
                <div
                  onClick={() => setBgModalOpen(true)}
                  className="account-center-submenu-item"
                >
                  Thay đổi hình nền
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </TopbarLayout>
  );
};

export default NoteTopbar;
