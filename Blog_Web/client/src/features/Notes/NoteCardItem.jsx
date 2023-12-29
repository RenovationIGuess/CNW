import { Tooltip } from 'antd';
import React from 'react';
import { AiFillStar, AiOutlineEdit, AiOutlineStar } from 'react-icons/ai';
import { BsTrash } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { BiCommentDetail } from 'react-icons/bi';
import { toast } from 'react-toastify';
import axiosClient from '~/axios';
import useNotesStore from '~/store/useNotesStore';
import useSidebarStore from '~/store/useSidebarStore';
import useModalStore from '~/store/useModalStore';
import removeFile from '~/firebase/removeFile';
dayjs.extend(relativeTime);

const NoteCardItem = ({ note, selected, index, handleCloseRightSidebar }) => {
  const [
    notes,
    setNotes,
    currentNote,
    setCurrentNote,
    setCurrentNoteCommentsFL,
    setCurrentNoteHistoriesFL,
  ] = useNotesStore((state) => [
    state.notes,
    state.setNotes,
    state.currentNote,
    state.setCurrentNote,
    state.setCurrentNoteCommentsFL,
    state.setCurrentNoteHistoriesFL,
  ]);

  const [handleUpdateItems, handleDeleteItems] = useSidebarStore((state) => [
    state.handleUpdateItems,
    state.handleDeleteItems,
  ]);

  const [setConfirmModalLoading, setConfirmModalInfo, setConfirmModalOpen] =
    useModalStore((state) => [
      state.setConfirmModalLoading,
      state.setConfirmModalInfo,
      state.setConfirmModalOpen,
    ]);

  const handleStarredNote = async (e) => {
    e.stopPropagation();
    const id = toast.success('Sending request...', {
      isLoading: true,
    });
    try {
      await axiosClient
        .patch(`/notes/${note.id}`, {
          ...note,
          starred: !note.starred,
        })
        .then(({ data }) => {
          const newNote = data.data;
          const belongsToPublic = newNote.path[0].title === 'Public';

          if (belongsToPublic) {
            handleUpdateItems(newNote, false);
          } else {
            handleUpdateItems(newNote);
          }

          notes[index] = newNote;
          setNotes([...notes]);

          if (Object.keys(currentNote).length > 0) {
            if (currentNote.id === newNote.id) {
              setCurrentNote(newNote);
            }
          }
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

  const handleDeleteNote = async () => {
    // const id = toast.success('Sending request...', {
    //   isLoading: true,
    // });
    removeFile(note.background_image);
    setConfirmModalLoading(true);
    try {
      await axiosClient
        .delete(`/notes/${note.id}`)
        .then(() => {
          const belongsToPublic = note.path[0].title === 'Public';

          if (belongsToPublic) {
            handleDeleteItems(note, false);
          } else {
            handleDeleteItems(note);
          }

          // Neu da load het tat ca phan tu thi chi can loai bo note da xoa
          // Kiem tra lai thong tin cua paginate
          if (note.id === currentNote.id) {
            if (notes.length === 1) setCurrentNote({});
            else {
              if (index === 0) setCurrentNote(notes[index + 1]);
              else setCurrentNote(notes[index - 1]);
            }
          }
          setNotes(notes.filter((n) => n.id !== note.id));

          setConfirmModalLoading(false);
          setTimeout(() => {
            setConfirmModalOpen(false);
          }, 0);

          toast.success('Delete note successfully!', {
            autoClose: 1500,
          });
        })
        .catch((err) => {
          console.log(err);
        });

      // toast.update(id, {
      //   render: 'Delete note successfully!',
      //   // type: "success",
      //   isLoading: false,
      //   autoClose: 3000,
      //   // closeButton: null
      // });
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  return (
    <div
      className={`note-view__item${selected ? ' note-view__item--active' : ''}`}
      onClick={() => {
        setCurrentNote({ ...note });
        // Reset all related thing about note like comment and histories
        setCurrentNoteCommentsFL(false);
        setCurrentNoteHistoriesFL(false);
        handleCloseRightSidebar(true);
      }}
    >
      <div className="note-item__bg--img">
        <img
          className="note-bg__img"
          src={note.background_image}
          alt="note-bg"
        />
        <div className="note-bg__img--mask"></div>
      </div>
      <div className="note-item__info">
        <div className="flex items-center gap-2">
          {note.icon.includes('/') ? (
            <img
              src={note.icon}
              alt="note-icon note-icon__sm"
              className="w-6 h-6 object-cover object-center"
            />
          ) : (
            <p className="text-2xl">{note.icon}</p>
          )}
          <p className="note-item__info--title">{note.title}</p>
        </div>
        <p className="note-content">
          <span>
            <BiCommentDetail className="icon-user__intro inline-block mr-2" />
          </span>
          <span className="text-xs">{note.description}</span>
        </p>
        <p className="last-edited text-xs my-1">
          {dayjs(note.updated_at).fromNow()}
        </p>
        <div className="flex items-center justify-end">
          <div className="flex items-center cursor-pointer gap-2">
            <Tooltip placement="top" title="Edit this note">
              <Link to={`/notes/${note.id}`}>
                <AiOutlineEdit className="note-edit-icon text-lg" />
              </Link>
            </Tooltip>
            <Tooltip
              placement="top"
              title={note.starred ? `Unstarred this note` : `Star this note`}
            >
              <div onClick={(e) => handleStarredNote(e)}>
                {note.starred ? (
                  <AiFillStar className="note-starred-icon text-xl" />
                ) : (
                  <AiOutlineStar className="note-star-icon text-xl" />
                )}
              </div>
            </Tooltip>
            <Tooltip placement="top" title="Remove this note">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmModalOpen(true);
                  setConfirmModalInfo({
                    title: `Xác nhận xóa note?`,
                    message: `Sau khi xóa, note sẽ ở trong thùng rác, bạn có thể vào mục "Thùng rác" để hoàn tác hoặc xóa vĩnh viễn`,
                    callback: () => {
                      handleDeleteNote();
                    },
                  });
                }}
              >
                <BsTrash className="note-remove-icon text-base" />
              </div>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteCardItem;
