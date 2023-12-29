import React from 'react';
import './RightSidebar.scss';
import { Tooltip } from 'antd';
import { MdKeyboardDoubleArrowRight } from 'react-icons/md';
import { FaRegEdit } from 'react-icons/fa';
import { BiCommentDetail } from 'react-icons/bi';
import {
  AiFillStar,
  AiOutlineClockCircle,
  AiOutlineStar,
} from 'react-icons/ai';
import { BsThreeDots } from 'react-icons/bs';
import useNotesStore from '~/store/useNotesStore';
import { toast } from 'react-toastify';
import axiosClient from '~/axios';
import useModalStore from '~/store/useModalStore';
import useSidebarStore from '~/store/useSidebarStore';

const RightSidebarWrapper = ({
  children,
  type,
  handleCloseRightSidebar,
  fetchNoteHistories,
  fetchNoteComments,
}) => {
  const [currentNote, setCurrentNote, notes, setNotes] = useNotesStore(
    (state) => [
      state.currentNote,
      state.setCurrentNote,
      state.notes,
      state.setNotes,
    ]
  );

  const [handleUpdateItems] = useSidebarStore((state) => [
    state.handleUpdateItems,
  ]);

  const [setActionToast] = useModalStore((state) => [state.setActionToast]);

  const handleStarredNote = async () => {
    const id = toast.success('Sending request...', {
      isLoading: true,
    });
    try {
      await axiosClient
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

          // setActionToast({
          //   status: true,
          //   message: 'Starred',
          // });
        })
        .catch((err) => {
          console.log(err);
        });

      toast.update(id, {
        render: 'Update note successfully!',
        // type: "success",
        isLoading: false,
        autoClose: 3000,
        // closeButton: null
      });
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  return (
    <div className="right-sidebar__wrapper right-sidebar--closed">
      <div className="right-sidebar__header">
        <Tooltip placement="bottom" title="Minimized">
          <div
            onClick={handleCloseRightSidebar}
            className="expand-icon__wrapper"
          >
            <MdKeyboardDoubleArrowRight className="expand-icon expand-icon--bg" />
          </div>
        </Tooltip>
        <div className="flex items-center cursor-pointer">
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
              className={`expand-icon__wrapper header-tool__icon${
                type === 'comments' ? ' expand-icon__wrapper--active' : ''
              }`}
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
              className={`expand-icon__wrapper header-tool__icon${
                type === 'histories' ? ' expand-icon__wrapper--active' : ''
              }`}
              onClick={() => {
                handleCloseRightSidebar(false, 'histories');
                fetchNoteHistories();
              }}
            >
              <AiOutlineClockCircle className="expand-icon" />
            </div>
          </Tooltip>
          <Tooltip placement="bottom" title={'Add to starred'}>
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
          <Tooltip title={'More actions'}>
            <div className="expand-icon__wrapper header-tool__icon">
              <BsThreeDots className="expand-icon" />
            </div>
          </Tooltip>
        </div>
      </div>
      {children}
    </div>
  );
};

export default RightSidebarWrapper;
