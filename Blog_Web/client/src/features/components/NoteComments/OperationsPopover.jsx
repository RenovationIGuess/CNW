import React from 'react';
import { AiOutlineEdit, AiOutlineUserDelete } from 'react-icons/ai';
import { BsFlag, BsTrash } from 'react-icons/bs';
import axiosClient from '~/axios';
import { userStateContext } from '~/contexts/ContextProvider';
import { stringUtils } from '~/utils';
import useModalStore from '~/store/useModalStore';

// Data could be comment or reply
const OperationsPopover = ({
  note,
  type,
  reply,
  comment,
  commentIndex,
  comments,
  setComments,
  commentReplyBoxOpenArr,
  setCommentReplyBoxOpen,
  setPopoverOpen,
  setAllRepliesShown,
}) => {
  const { currentUser } = userStateContext();
  // Confirm Modal
  const [setConfirmModalLoading, setConfirmModalInfo, setConfirmModalOpen] =
    useModalStore((state) => [
      state.setConfirmModalLoading,
      state.setConfirmModalInfo,
      state.setConfirmModalOpen,
    ]);

  const [setActionToast] = useModalStore((state) => [state.setActionToast]);

  const handleDeleteReply = () => {
    setConfirmModalLoading(true);
    axiosClient
      .delete(`/notes/${note.id}/comments/${reply.id}`)
      .then(({ data }) => {
        comments[commentIndex].replies = comments[commentIndex].replies.filter(
          (r) => r.id !== reply.id
        );
        setComments([...comments]);

        setCommentReplyBoxOpen(
          commentReplyBoxOpenArr.filter((r) => r.comment_id !== reply.id)
        );

        setActionToast({
          status: true,
          message: data.message,
        });

        setConfirmModalLoading(false);
        setTimeout(() => {
          setConfirmModalOpen(false);
        }, 0);
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteComment = () => {
    setConfirmModalLoading(true);
    setAllRepliesShown && setAllRepliesShown(false);
    axiosClient
      .delete(`/notes/${note.id}/comments/${comment.id}`)
      .then(({ data }) => {
        setComments(comments.filter((c) => c.id !== comment.id));

        setCommentReplyBoxOpen(
          commentReplyBoxOpenArr.filter(
            (item) => item.comment_id !== comment.id
          )
        );

        setActionToast({
          status: true,
          message: data.message,
        });

        setConfirmModalLoading(false);
        setTimeout(() => {
          setConfirmModalOpen(false);
        }, 0);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="action-menu">
      <div className="action-menu__title">More</div>
      <ul className="action-menu__list">
        {(currentUser.id === note.user_id ||
          currentUser.id === reply?.user_id ||
          currentUser.id === comment.user_id) && (
          <li
            className="action-menu__item"
            onClick={() => {
              setPopoverOpen(false);
            }}
          >
            <AiOutlineEdit className="action-menu__icon" />
            <span className="action-menu__label">
              Edit {stringUtils.uppercaseStr(type)}
            </span>
          </li>
        )}
        <li
          className="action-menu__item"
          onClick={() => {
            setPopoverOpen(false);
          }}
        >
          <BsFlag className="action-menu__icon" />
          <span className="action-menu__label">
            Report {stringUtils.uppercaseStr(type)}
          </span>
        </li>
        <li
          className="action-menu__item"
          onClick={() => {
            setPopoverOpen(false);
          }}
        >
          <AiOutlineUserDelete className="action-menu__icon" />
          <span className="action-menu__label">Block User</span>
        </li>
        {(currentUser.id === note.user_id ||
          currentUser.id === reply?.user_id ||
          currentUser.id === comment.user_id) && (
          <li
            onClick={() => {
              setConfirmModalOpen(true);
              setConfirmModalInfo({
                title: `Xác nhận xóa ${type}?`,
                message: `${stringUtils.uppercaseStr(
                  type
                )} không thể khôi phục sau khi xóa. Bạn có chắc mình muốn xóa?`,
                callback: () =>
                  type === 'comment'
                    ? handleDeleteComment()
                    : handleDeleteReply(),
              });
              setPopoverOpen(false);
            }}
            className="action-menu__item"
          >
            <BsTrash className="action-menu__icon" />
            <span className="action-menu__label">
              Delete {stringUtils.uppercaseStr(type)}
            </span>
          </li>
        )}
      </ul>
    </div>
  );
};

export default OperationsPopover;
