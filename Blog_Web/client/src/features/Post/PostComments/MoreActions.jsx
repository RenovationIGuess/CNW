import React from 'react';
import { AiOutlineEdit, AiOutlineUserDelete } from 'react-icons/ai';
import { BsFillPinAngleFill, BsFlag, BsTrash } from 'react-icons/bs';
import { MdOutlineEditOff } from 'react-icons/md';
import axiosClient from '~/axios';
import { userStateContext } from '~/contexts/ContextProvider';
import useModalStore from '~/store/useModalStore';
import usePostStore from '~/store/usePostStore';
import { stringUtils } from '~/utils';

const MoreActions = ({
  type,
  setPopoverOpen = () => {},
  commentId,
  commentorId,
  commentIndex,
  replyId,
  replierId,
  cioIndex,
}) => {
  const { currentUser } = userStateContext();

  const [post] = usePostStore((state) => [state.post]);
  const [comments, setComments] = usePostStore((state) => [
    state.comments,
    state.setComments,
  ]);
  const [commentInputOpen, setCommentInputOpen] = usePostStore((state) => [
    state.commentInputOpen,
    state.setCommentInputOpen,
  ]);
  const [setSelectedComment, setAllRepliesShown] = usePostStore((state) => [
    state.setSelectedComment,
    state.setAllRepliesShown,
  ]);
  const [toggleEditComment] = usePostStore((state) => [
    state.toggleEditComment,
  ]);

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
      .delete(`/posts/${post.id}/comments/${replyId}`)
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
      .delete(`/posts/${post.id}/comments/${commentId}`)
      .then(({ data }) => {
        setSelectedComment({});
        setAllRepliesShown(false);

        // Delete the comment in the comments array
        setComments(comments.filter((c) => c.id !== commentId));

        // Delete the comment, as well as its replies
        const comment = comments[commentIndex];
        const commentsToDelete = [
          comment.id,
          ...comment.replies.map((r) => r.id),
        ];
        setCommentInputOpen(
          commentInputOpen.filter(
            (c) => !commentsToDelete.includes(c.comment_id)
          )
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
        {((type === 'reply' && currentUser.id === replierId) ||
          (type === 'comment' && currentUser.id === commentorId)) && (
          <li
            className="action-menu__item"
            onClick={() => {
              toggleEditComment(cioIndex);
              setPopoverOpen(false);
            }}
          >
            {commentInputOpen[cioIndex].edit_state ? (
              <MdOutlineEditOff className="action-menu__icon" />
            ) : (
              <AiOutlineEdit className="action-menu__icon" />
            )}
            <span className="action-menu__label">
              {commentInputOpen[cioIndex].edit_state
                ? 'Cancel Editing'
                : `Edit ${stringUtils.uppercaseStr(type)}`}
            </span>
          </li>
        )}
        {type === 'comment' && currentUser.id === post.poster.id && (
          <li
            className="action-menu__item"
            onClick={() => {
              setPopoverOpen(false);
            }}
          >
            <BsFillPinAngleFill className="action-menu__icon" />
            <span className="action-menu__label">
              Pin this {stringUtils.uppercaseStr(type)}
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
        {(currentUser.id === post.poster.id ||
          (type === 'reply' && currentUser.id === replierId) ||
          (type === 'comment' && currentUser.id === commentorId)) && (
          <li
            onClick={() => {
              setConfirmModalOpen(true);
              setPopoverOpen(false);
              setConfirmModalInfo({
                title: `Xác nhận xóa ${type}?`,
                message: `${stringUtils.uppercaseStr(
                  type
                )} không thể khôi phục sau khi xóa. Bạn có chắc mình muốn xóa?`,
                confirmCallback: () =>
                  type === 'comment'
                    ? handleDeleteComment()
                    : handleDeleteReply(),
                cancelCallback: () => {},
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
