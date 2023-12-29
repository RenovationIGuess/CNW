import { Popover } from 'antd';
import React, { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import ReplyContent from '~/components/Tiptap/ReplyContent';
import {
  AiFillCrown,
  AiFillLike,
  AiOutlineComment,
  AiOutlineLike,
} from 'react-icons/ai';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import TiptapReply from '~/components/Tiptap/TiptapReply';
import axiosClient from '~/axios';
import { stringUtils } from '~/utils';
import MoreActions from './MoreActions';
import { userStateContext } from '~/contexts/ContextProvider';
dayjs.extend(relativeTime);

const PostReplyCard = ({
  replyIndex,
  cioIndex,
  commentIndex,
  reply,
  comments,
  setComments,
  postId,
  commentId,
  inputContent,
  setInputContent,
  commentInputOpen,
  setCommentInputOpen,
  handleOpenReplyInput,
  posterId,
  commentorId,
  sendReplyLoading,
  handleSendReply,
}) => {
  const { currentUser } = userStateContext();

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [editState, setEditState] = useState(false);

  const handleVoteReply = (payload) => {
    axiosClient
      .patch(`/posts/${postId}/comments/${reply.id}/like`, payload)
      .then(({ data }) => {
        comments[commentIndex].replies[replyIndex] = {
          ...data.data,
        };
        setComments([...comments]);
      })
      .catch((err) => console.log(err))
      .finally(() => {});
  };

  return (
    <>
      <div className="comment-card-inner-reply">
        <div className="comment-card-inner-reply__body">
          <Link
            to={`/profile/${reply.commentor.id}/public`}
            className="comment-card-inner-reply__user"
          >
            <div className="user-avatar__mini">
              <img
                src={reply.commentor.profile.avatar}
                alt="replier-avatar"
                className="user-avatar__img"
              />
            </div>
            <Link
              to={`/profile/${reply.commentor.id}/public`}
              className="comment-card-inner-reply__name"
            >
              <span className="account-title__name">
                {reply.commentor.profile.name}
              </span>
              {currentUser.id === posterId && (
                <span className="account-title__landlord">
                  <AiFillCrown />
                  &nbsp;Author
                </span>
              )}
              {reply.reply_to && (
                <span className="reply-to">
                  Replied to{' '}
                  <Link
                    to={`/profile/${reply.reply_to_info.id}/public`}
                    className="text-[#657ef8] font-bold"
                  >
                    {reply.reply_to_info.profile.name}
                  </Link>
                </span>
              )}
            </Link>
          </Link>
          {editState ? (
            <TiptapReply
              reply={reply}
              editState={editState}
              setEditState={setEditState}
            />
          ) : (
            <ReplyContent reply={reply} />
          )}
        </div>
        <div className="comment-card-inner-reply__bottom">
          <span className="comment-card-inner-reply__time">
            {stringUtils.uppercaseStr(dayjs(reply.created_at).fromNow())}
          </span>
          <div className="flex items-center">
            <div className="comment-card-inner-reply__actions">
              <div className="ml-0 relative z-[100]">
                <Popover
                  rootClassName="custom-popover"
                  placement="bottomRight"
                  trigger={'click'}
                  open={popoverOpen}
                  onOpenChange={() => setPopoverOpen(!popoverOpen)}
                  content={
                    <MoreActions
                      type={'reply'}
                      postId={postId}
                      commentId={commentId}
                      replyId={reply.id}
                      commentIndex={commentIndex}
                      comments={comments}
                      setComments={setComments}
                      commentInputOpen={commentInputOpen}
                      setCommentInputOpen={setCommentInputOpen}
                      setEditState={setEditState}
                      setPopoverOpen={setPopoverOpen}
                      posterId={posterId}
                      commentorId={commentorId}
                      replierId={reply.commentor.id}
                    />
                  }
                >
                  <BsThreeDotsVertical className="action-more__icon text-xl" />
                </Popover>
              </div>
            </div>
            <div
              className="comment-card-operation-bottom__item"
              onClick={() => {
                handleOpenReplyInput(cioIndex);
                setInputContent({
                  content_html: '',
                  content_json: '',
                  reply_to: reply.commentor.id,
                });
              }}
            >
              <AiOutlineComment className="comment-reply__icon" />
              <span>Reply</span>
            </div>
            <div className="comment-card-operation-bottom__item">
              {reply.current_user_interact ? (
                <AiFillLike
                  onClick={() => {
                    handleVoteReply({
                      like: !reply.current_user_interact,
                    });
                  }}
                  className="upvoted-icon"
                />
              ) : (
                <AiOutlineLike
                  onClick={() => {
                    handleVoteReply({
                      like: !reply.current_user_interact,
                    });
                  }}
                  className="upvote-icon"
                />
              )}
              <span>{reply.likes_count}</span>
            </div>
          </div>
        </div>
        {commentInputOpen[cioIndex].state && (
          <TiptapReply
            replyInputOpen={commentInputOpen[cioIndex].state}
            crboIndex={cioIndex}
            sendReplyLoading={sendReplyLoading}
            reply={inputContent}
            setReply={setInputContent}
            handleSendReply={handleSendReply}
          />
        )}
      </div>
    </>
  );
};

export default PostReplyCard;
