import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { Tilt } from "react-tilt";
import { AiFillStar, AiOutlineEdit, AiOutlineStar } from 'react-icons/ai';
import { Tooltip } from 'antd';
import { BsTrash } from 'react-icons/bs';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { toast } from 'react-toastify';
import axiosClient from '~/axios';
import ConfirmModal from '~/components/ConfirmModal/ConfirmModal';
import { BiCommentDetail } from 'react-icons/bi';
import { Draggable } from 'react-beautiful-dnd';
import { cn } from '~/utils';

dayjs.extend(relativeTime);

const TiltableItem = ({ note, setStarredNotes, setNotes, index }) => {
  const navigate = useNavigate();

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

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
          if (newNote.starred) setStarredNotes((prev) => [...prev, newNote]);
          else
            setStarredNotes((prev) =>
              prev.filter((note) => note.id !== newNote.id)
            );

          setNotes((prev) =>
            prev.map((note) => {
              if (note.id === newNote.id) return newNote;
              return note;
            })
          );
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
    const id = toast.success('Sending request...', {
      isLoading: true,
    });
    try {
      await axiosClient
        .delete(`/notes/${note.id}`)
        .then(() => {
          setNotes((prev) => prev.filter((n) => n.id !== note.id));
          setStarredNotes((prev) => prev.filter((n) => n.id !== note.id));
        })
        .catch((err) => {
          console.log(err);
        });

      toast.update(id, {
        render: 'Delete note successfully!',
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
    <div
      className={cn(
        'note-item'
        // 'note-item--dragged',
      )}
    >
      <div onClick={() => navigate(`/notes/${note.id}`)}>
        <div className="note-glass">
          <div className=""></div>
        </div>
        <div className="note-background">
          <img
            className="note-background-img"
            alt="note-img"
            src={note.background_image}
          />
        </div>
      </div>
      <div className="min-h-0 flex-1 flex flex-col mt-3 px-4">
        <div
          className="min-h-0 flex-1 flex flex-col"
          onClick={() => navigate(`/notes/${note.id}`)}
        >
          <div className="flex items-center gap-3">
            {note.icon.includes('/') ? (
              <img
                src={note.icon}
                alt="note-icon"
                className="w-8 h-8 object-cover object-center"
              />
            ) : (
              <p className="text-2xl">{note.icon}</p>
            )}
            <Tooltip placement="top" title={note.title}>
              <p className="note-title">{note.title}</p>
            </Tooltip>
          </div>
          <p className="note-content">
            <span>
              <BiCommentDetail className="icon-user__intro inline-block mr-2" />
            </span>
            {note.description}
          </p>
        </div>
        <div className="note-footer">
          <p className="last-edited">{dayjs(note.updated_at).fromNow()}</p>
          <div className="flex items-center cursor-pointer gap-2">
            <Tooltip placement="top" title="Edit this note">
              <Link to={`/notes/${note.id}`}>
                <AiOutlineEdit className="note-edit-icon" />
              </Link>
            </Tooltip>
            <Tooltip
              placement="top"
              title={note.starred ? `Unstarred this note` : `Star this note`}
            >
              <div onClick={(e) => handleStarredNote(e)}>
                {note.starred ? (
                  <AiFillStar className="note-starred-icon" />
                ) : (
                  <AiOutlineStar className="note-star-icon" />
                )}
              </div>
            </Tooltip>
            <Tooltip placement="top" title="Remove this note">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmModalOpen(true);
                }}
              >
                <BsTrash className="note-remove-icon" />
              </div>
            </Tooltip>
          </div>
        </div>
      </div>

      <ConfirmModal
        confirmTitle={'Xác nhận xóa note?'}
        confirmMessage={
          'Sau khi xóa, note sẽ ở trong thùng rác, bạn có thể vào mục "Thùng rác" để hoàn tác hoặc xóa vĩnh viễn'
        }
        confirmModalOpen={confirmModalOpen}
        setConfirmModalOpen={setConfirmModalOpen}
        callback={handleDeleteNote}
      />
    </div>
  );
};

export default TiltableItem;
