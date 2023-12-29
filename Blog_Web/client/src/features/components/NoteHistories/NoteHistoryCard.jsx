import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Image, Popover, Tooltip } from 'antd';
import {
  BsFillEmojiSmileFill,
  BsFillImageFill,
  BsThreeDotsVertical,
} from 'react-icons/bs';
import {
  AiOutlineAlignLeft,
  AiOutlineArrowDown,
  AiOutlineArrowRight,
  AiOutlineClockCircle,
  AiOutlineFontSize,
  AiOutlineUndo,
} from 'react-icons/ai';
import { BiCommentDetail } from 'react-icons/bi';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import OperationsPopover from './OperationsPopover';
import { stringUtils } from '~/utils';
import axiosClient from '~/axios';
import { toast } from 'react-toastify';
import useNotesStore from '~/store/useNotesStore';
import useSidebarStore from '~/store/useSidebarStore';
dayjs.extend(relativeTime);

const NoteHistoryCard = ({
  note,
  setNote,
  history,
  histories,
  setHistories,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [notes, setNotes] = useNotesStore((state) => [
    state.notes,
    state.setNotes,
  ]);

  const [handleUpdateItems] = useSidebarStore((state) => [
    state.handleUpdateItems,
  ]);

  const [changeFields, setChangeFields] = useState(
    history.change_fields.split(';')
  );
  const [changeFrom, setChangeFrom] = useState(history.change_from.split(';'));
  const [changeTo, setChangeTo] = useState(history.change_to.split(';'));
  // const [rollbackLoading, setRollbackLoading] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  // Should use useMemo here
  useEffect(() => {
    setChangeFields(history.change_fields.split(';'));
    setChangeFrom(history.change_from.split(';'));
    setChangeTo(history.change_to.split(';'));
  }, [history.id]);

  const handleUpdateNote = async () => {
    const rollbackInfo = {};
    for (const ind in changeFields) {
      rollbackInfo[changeFields[ind]] = changeFrom[ind];
    }
    // setRollbackLoading(true);
    const id = toast.success('Sending request...', {
      isLoading: true,
    });

    try {
      await axiosClient
        .patch(`/notes/${note.id}`, {
          ...note,
          ...rollbackInfo,
        })
        .then(({ data }) => {
          const newNote = data.data;
          const belongsToPublic = newNote.path[0].title === 'Public';

          // Update the item in the sidebar (if is shown)
          // Only update if its the rollback version of title + icon ???
          if (rollbackInfo['title'] || rollbackInfo['icon']) {
            if (belongsToPublic) {
              handleUpdateItems(newNote, false);
            } else {
              handleUpdateItems(newNote);
            }
          }

          setNote({ ...data.data });

          // Update the directory
          // For better performance, we may only need to update the directory data
          // when the history contains [title, icon] changes
          // But if we want synchronous data, then delete the if statement
          // But the problem is that the data needs to be synchronous to not have errors
          // when we do actions like change the icon from the sidebar

          if (location.pathname === '/notes') {
            setNotes(
              notes.map((item) => {
                if (item.id === data.data.id) return data.data;
                return item;
              })
            );
          }

          // After change the note we have to delete the chosen rollback
          axiosClient
            .delete(`/notes/${note.id}/histories/${history.id}`)
            .then(() => {
              setHistories(histories.filter((item) => item.id !== history.id));
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
      // .finally(() => setRollbackLoading(false));

      toast.update(id, {
        render: `Rollback successfully!`,
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  return (
    <div className="comment-card">
      <div className="comment-card__left">
        <Link to={`/profile/${history.user.id}/public`}>
          <div className="comment-card__avatar">
            <img
              src={history.user.profile.avatar}
              alt="commentor-avatar"
              className="comment-card__avatar--img"
            />
          </div>
        </Link>
      </div>
      <div className="comment-card__container">
        <div className="comment-card__header">
          <div className="comment-card__account">
            <div className="comment-card__account--title">
              <span
                className="history-card__header--label"
                // onClick={() => console.log("Propagated")}
              >
                Edited by{' '}
                <span
                  className="font-bold"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/profile/${history.user.id}/public`);
                  }}
                >
                  {history.user.profile.name}
                </span>
              </span>
            </div>
            <div className="comment-card__account--tags">
              <span>
                {stringUtils.uppercaseStr(dayjs(history.created_at).fromNow())}
              </span>
            </div>
          </div>
          <div className="comment-card__operation--top">
            <div className="comment-card__action">
              <Tooltip placement="top" title={<>Roll back to this version</>}>
                <AiOutlineUndo
                  onClick={handleUpdateNote}
                  className="action-more__icon"
                />
              </Tooltip>
            </div>
            <div className="comment-card__action">
              <Tooltip
                placement="top"
                title={<>View version for this update</>}
              >
                <AiOutlineClockCircle className="action-more__icon" />
              </Tooltip>
            </div>
            <div className="comment-card__action">
              <Popover
                rootClassName="custom-popover"
                placement="bottomRight"
                trigger={'click'}
                content={
                  <OperationsPopover
                    note={note}
                    history={history}
                    setHistories={setHistories}
                    setPopoverOpen={setPopoverOpen}
                  />
                }
                open={popoverOpen}
                onOpenChange={() => setPopoverOpen(!popoverOpen)}
              >
                <BsThreeDotsVertical className="action-more__icon" />
              </Popover>
            </div>
          </div>
        </div>
        {changeFields.map((field, ind) =>
          field === 'title' ? (
            <div className="change-log-item" key={ind}>
              <div className="change-header">
                <AiOutlineFontSize className="change-icon" />
                <p className="change-lable">Note's title</p>
              </div>
              <div className="change-log__wrapper">
                <span className="title-before">{changeFrom[ind]}</span>
                <AiOutlineArrowRight className="change-arrow--sm" />
                <span className="title-after">{changeTo[ind]}</span>
              </div>
            </div>
          ) : field === 'description' ? (
            <div className="change-log-item" key={ind}>
              <div className="change-header">
                <BiCommentDetail className="change-icon" />
                <p className="change-lable">Note's description</p>
              </div>
              <div className="change-log__wrapper">
                <span className="title-after">{changeTo[ind]}</span>
              </div>
            </div>
          ) : field === 'icon' ? (
            <div className="change-log-item" key={ind}>
              <div className="change-header">
                <BsFillEmojiSmileFill className="change-icon" />
                <p className="change-lable">Note's icon</p>
              </div>
              <div className="change-log__wrapper">
                <div className="icon-change__log--item">
                  {!changeFrom[ind].includes('/') ? (
                    <p className="text-5xl">{changeFrom[ind]}</p>
                  ) : (
                    <img
                      className="icon-change__log--img"
                      alt="icon-change-from"
                      src={changeFrom[ind]}
                    />
                  )}
                </div>
                <AiOutlineArrowRight className="change-arrow" />
                <div className="icon-change__log--item">
                  {!changeTo[ind].includes('/') ? (
                    <p className="text-5xl">{changeTo[ind]}</p>
                  ) : (
                    <img
                      className="icon-change__log--img"
                      alt="icon-change-from"
                      src={changeTo[ind]}
                    />
                  )}
                </div>
              </div>
            </div>
          ) : field === 'background_image' ? (
            <div className="change-log-item" key={ind}>
              <div className="change-header">
                <BsFillImageFill className="change-icon" />
                <p className="change-label">Note's background</p>
              </div>
              <div className="bg-change-log__wrapper">
                {/* <div className="bg-change__item--wrap"> */}
                <Image src={changeFrom[ind]} rootClassName="bg-change__img" />
                <AiOutlineArrowDown className="change-arrow bg-change-arrow" />
                <Image src={changeTo[ind]} rootClassName="bg-change__img" />
                {/* </div> */}
              </div>
            </div>
          ) : (
            field === 'content' && (
              <div className="change-log-item" key={ind}>
                <div className="change-header">
                  <AiOutlineAlignLeft className="change-icon" />
                  <p className="change-lable">Note's content</p>
                </div>
                <div className="change-log__wrapper">
                  <span className="title-after">
                    {/* {history.change_to[ind]} */}
                    {/* <div className="title-overflow__mask"></div> */}
                  </span>
                </div>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
};

export default NoteHistoryCard;
