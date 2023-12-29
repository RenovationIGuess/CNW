import { Popover, Tooltip } from 'antd';
import React, { useState } from 'react';
import {
  AiFillStar,
  AiOutlineClockCircle,
  AiOutlineExpand,
  AiOutlineStar,
} from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { userStateContext } from '~/contexts/ContextProvider';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { BiCommentDetail } from 'react-icons/bi';
import { BsThreeDots } from 'react-icons/bs';
import { FaRegEdit } from 'react-icons/fa';
import axiosClient from '~/axios';
import IconSelector from '~/components/IconSelector/IconSelector';
import useSidebarStore from '~/store/useSidebarStore';
import useModalStore from '~/store/useModalStore';
import useNotesStore from '~/store/useNotesStore';
dayjs.extend(relativeTime);

const NoteEditHeader = ({
  currentNote,
  setCurrentNote,
  notes,
  setNotes,
  rightSidebarOpen,
  handleCloseRightSidebar,
  fetchNoteHistories,
  fetchNoteComments,
}) => {
  const { currentUser } = userStateContext();

  const [handleUpdateItems] = useSidebarStore((state) => [
    state.handleUpdateItems,
  ]);

  const [savingNote, setSavingNote] = useNotesStore((state) => [
    state.savingNote,
    state.setSavingNote,
  ]);

  const [setActionToast] = useModalStore((state) => [state.setActionToast]);

  const [iconChangeOpen, setIconChangeOpen] = useState(false);

  const handleStarredNote = async () => {
    setSavingNote(true);
    axiosClient
      .patch(`/notes/${currentNote.id}`, {
        ...currentNote,
        starred: !currentNote.starred,
      })
      .then(({ data }) => {
        const newNote = data.data;
        const belongsToPublic = newNote.path[0].title === 'Public';

        if (belongsToPublic) {
          handleUpdateItems(newNote, false);
        } else {
          handleUpdateItems(newNote);
        }

        setNotes(
          notes.map((item) => {
            if (item.id == newNote.id) return newNote;
            else return item;
          })
        );
        setCurrentNote(newNote);

        setActionToast({
          status: true,
          message: newNote.starred ? 'Starred' : 'Removed',
        });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setSavingNote(false);
      });
  };

  const handleChangeIcon = (icon) => {
    setIconChangeOpen(false);
    setSavingNote(true);

    const url = `/notes/${currentNote.id}`;
    axiosClient
      .patch(url, {
        ...currentNote,
        icon: icon,
      })
      .then(({ data }) => {
        // Update the sidebar
        const newNote = data.data;
        const belongsToPublic = newNote.path[0].title === 'Public';

        if (belongsToPublic) {
          handleUpdateItems(newNote, false);
        } else {
          handleUpdateItems(newNote);
        }

        setCurrentNote(newNote);
        setNotes(
          notes.map((item) => {
            if (item.id == newNote.id) return newNote;
            else return item;
          })
        );

        setActionToast({
          status: true,
          message: 'Updated',
        });
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setSavingNote(false);
      });
  };

  return (
    <div className="note-edit__header">
      <div className="flex items-center">
        <Tooltip placement="bottom" title="To this note detail page">
          <Link
            to={`/notes/${currentNote.id}`}
            className="expand-icon__wrapper"
          >
            <AiOutlineExpand className="expand-icon" />
          </Link>
        </Tooltip>
        <div className="note-edit__header--info">
          <Popover
            rootClassName="custom-popover"
            trigger="click"
            className="custom-popover"
            open={iconChangeOpen}
            onOpenChange={() => setIconChangeOpen(!iconChangeOpen)}
            content={<IconSelector callback={handleChangeIcon} />}
            placement="bottom"
          >
            {currentNote.icon.includes('/') ? (
              <img
                src={currentNote.icon}
                alt="note-icon__sm"
                className="w-7 h-7 object-cover object-center"
              />
            ) : (
              <p className="text-2xl">{currentNote.icon}</p>
            )}
          </Popover>
          <p className="note-edit__header--title">{currentNote.title}</p>
        </div>
      </div>
      <div className="flex items-center">
        {savingNote && (
          <span className="save-loader">
            <span className="my-loader gray-loader mr-2"></span>
            Saving...
          </span>
        )}
        {!savingNote && (
          <Tooltip
            placement="bottomLeft"
            title={
              <>
                <p className="edited-tooltip__content mb-[2px]">
                  Created by{' '}
                  <span className="text-white">{currentUser.profile.name}</span>{' '}
                  {dayjs(currentNote.created_at).fromNow()}
                </p>
                <p className="edited-tooltip__content">
                  Updated by{' '}
                  <span className="text-white">{currentUser.profile.name}</span>{' '}
                  {dayjs(currentNote.updated_at).fromNow()}
                </p>
              </>
            }
          >
            <p className="last-edited__title">
              Edited {dayjs(currentNote.updated_at).fromNow()}
            </p>
          </Tooltip>
        )}
        <div className="header-tools__wrapper">
          <div className="share-wrapper">Share</div>
          {!rightSidebarOpen && (
            <>
              <Tooltip placement="bottom" title={'Edit note content'}>
                <div
                  className="expand-icon__wrapper header-tool__icon"
                  onClick={() => {
                    handleCloseRightSidebar(true);
                  }}
                >
                  <FaRegEdit className="expand-icon" />
                </div>
              </Tooltip>
              <Tooltip placement="bottom" title={'Close all comments'}>
                <div
                  className="expand-icon__wrapper header-tool__icon"
                  onClick={() => {
                    handleCloseRightSidebar(false, 'comments');
                    fetchNoteComments();
                  }}
                >
                  <BiCommentDetail className="expand-icon" />
                </div>
              </Tooltip>
              <Tooltip title={'View all updates'}>
                <div
                  className="expand-icon__wrapper header-tool__icon"
                  onClick={() => {
                    handleCloseRightSidebar(false, 'histories');
                    fetchNoteHistories();
                  }}
                >
                  <AiOutlineClockCircle className="expand-icon" />
                </div>
              </Tooltip>
              <Tooltip title={'Add to starred'} placement="bottom">
                <div className="expand-icon__wrapper header-tool__icon">
                  {currentNote.starred ? (
                    <AiFillStar
                      onClick={handleStarredNote}
                      className="expand-icon text-[22px]"
                    />
                  ) : (
                    <AiOutlineStar
                      onClick={handleStarredNote}
                      className="expand-icon text-[22px]"
                    />
                  )}
                </div>
              </Tooltip>
              <Tooltip placement="bottom" title={'More actions'}>
                <div className="expand-icon__wrapper header-tool__icon">
                  <BsThreeDots className="expand-icon" />
                </div>
              </Tooltip>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteEditHeader;
