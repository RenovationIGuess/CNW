import React, { useState } from 'react';
import { AiOutlineEdit, AiOutlineUserDelete } from 'react-icons/ai';
import { BsFlag, BsTrash } from 'react-icons/bs';
import axiosClient from '~/axios';
import ConfirmModal from '~/components/ConfirmModal/ConfirmModal';
import { userStateContext } from '~/contexts/ContextProvider';
import useModalStore from '~/store/useModalStore';
import { stringUtils } from '~/utils';

const MoreActions = ({
  postId,
  type,
  commentId,
  replyId,
  commentIndex,
  comments,
  setComments,
  commentInputOpen,
  setCommentInputOpen,
  setEditState,
  setPopoverOpen,
  posterId,
  replierId,
  commentorId,
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
      .delete(`/posts/${postId}/comments/${replyId}`)
      .then(({ data }) => {
        comments[commentIndex].replies = comments[commentIndex].replies.filter(
          (r) => r.id !== replyId
        );
        setComments([...comments]);

        setCommentInputOpen(
          commentInputOpen.filter((r) => r.comment_id !== replyId)
        );

        setConfirmModalLoading(false);
        setTimeout(() => {
          setConfirmModalOpen(false);
        }, 0);

        setActionToast({
          status: true,
          message: data.message,
        });
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteComment = () => {
    setConfirmModalLoading(true);
    axiosClient
      .delete(`/posts/${postId}/comments/${commentId}`)
      .then(({ data }) => {
        setAllRepliesShown && setAllRepliesShown(false);

        setComments(comments.filter((c) => c.id !== commentId));

        setCommentInputOpen(
          commentInputOpen.filter((c) => c.comment_id !== commentId)
        );

        setConfirmModalLoading(false);
        setTimeout(() => {
          setConfirmModalOpen(false);
        }, 0);

        setActionToast({
          status: true,
          message: data.message,
        });
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="action-menu">
      <div className="action-menu__title">More</div>
      <ul className="action-menu__list">
        {(currentUser.id === posterId ||
          (replierId && currentUser.id === replierId) ||
          currentUser.id === commentorId) && (
          <li
            className="action-menu__item"
            onClick={() => {
              setEditState(true);
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
        {(currentUser.id === posterId ||
          (replierId && currentUser.id === replierId) ||
          currentUser.id === commentorId) && (
          <li
            onClick={() => {
              setConfirmModalOpen(true);
              setPopoverOpen(false);
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

export default MoreActions;
