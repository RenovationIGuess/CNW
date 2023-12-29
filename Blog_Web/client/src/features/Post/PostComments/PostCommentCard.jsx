import { Popover } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useState } from 'react';
import {
  AiFillCrown,
  AiFillLike,
  AiOutlineComment,
  AiOutlineLike,
} from 'react-icons/ai';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import axiosClient from '~/axios';
import CommentContent from '~/components/Tiptap/CommentContent';
import { userStateContext } from '~/contexts/ContextProvider';
import { stringUtils } from '~/utils';
import MoreActions from './MoreActions';
import TiptapReply from '~/components/Tiptap/TiptapReply';
import { images } from '~/constants';
import { IoIosArrowForward } from 'react-icons/io';
import PostReplyCard from './PostReplyCard';
import AllCommentReplies from './AllCommentReplies';
import Liked from '~/components/Actions/Liked';
import useModalStore from '~/store/useModalStore';

dayjs.extend(relativeTime);

// commentInputOpen: cioIndex
// comments: commentIndex
const PostCommentCard = ({
  postId,
  posterId,
  comment,
  commentIndex,
  cioIndex,
  comments,
  setComments,
  inputContent,
  setInputContent,
  commentInputOpen,
  setCommentInputOpen,
  handleOpenCommentInput,
  handleOpenReplyInput,
}) => {
  const { currentUser } = userStateContext();

  const [setActionToast] = useModalStore((state) => [state.setActionToast]);

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [allRepliesShown, setAllRepliesShown] = useState(false);
  const [sendReplyLoading, setSendReplyLoading] = useState(false);

  const handleVoteComment = (payload) => {
    axiosClient
      .patch(`/posts/${postId}/comments/${comment.id}/like`, payload)
      .then(({ data }) => {
        comments[commentIndex] = {
          ...data.data,
        };
        setComments([...comments]);
      })
      .catch((err) => console.log(err))
      .finally(() => {});
  };

  const handleSendReply = (cioIndex) => {
    const payload = {
      post_id: postId,
      post_comment_id: comment.id,
      user_id: currentUser.id,
      content_json: inputContent.content_json,
      content_html: inputContent.content_html,
      reply_to: inputContent.reply_to,
      pinned: false,
    };
    setSendReplyLoading(true);
    axiosClient
      .post(`/posts/${postId}/comments`, payload)
      .then(({ data }) => {
        // Update comments
        comments[commentIndex].replies.unshift(data.data);
        setComments([...comments]);

        // Update input open state
        commentInputOpen[cioIndex].state = false;
        commentInputOpen.splice(cioIndex + 1, 0, {
          comment_id: data.data.id,
          state: false,
        });
        setCommentInputOpen([...commentInputOpen]);

        // Reset input field
        setInputContent({
          content_json: '',
          content_html: '',
          reply_to: null,
        });

        // Notify user
        setActionToast({
          status: true,
          message: data.message,
        });
      })
      .catch((err) => console.log(err))
      .finally(() => setSendReplyLoading(false));
  };

  return (
    <div className="comment-card">
      <div className="comment-card__left">
        <Link to={`/profile/${comment.commentor.id}/public`}>
          <div className="comment-card__avatar">
            <img
              src={comment.commentor.profile.avatar}
              alt="commentor-avatar"
              className="comment-card__avatar--img"
            />
          </div>
        </Link>
      </div>
      <div className="comment-card__container">
        <div className="comment-card__header">
          <div className="comment-card__account">
            <Link
              className="comment-card__account--title"
              to={`/profile/${comment.commentor.id}/public`}
            >
              <span className="account-title__name">
                {comment.commentor.profile.name}
              </span>
              {currentUser.id === posterId && (
                <span className="account-title__landlord">
                  <AiFillCrown />
                  &nbsp;Author
                </span>
              )}
            </Link>
            <div className="comment-card__account--tags">
              <span>Suppose to display user's tags here</span>
            </div>
          </div>
          <div className="comment-card__operation--top">
            <div className="comment-card__action">
              <Popover
                rootClassName="custom-popover"
                placement="bottomRight"
                trigger={'click'}
                open={popoverOpen}
                onOpenChange={() => setPopoverOpen(!popoverOpen)}
                content={
                  <MoreActions
                    type={'comment'}
                    postId={postId}
                    commentIndex={commentIndex}
                    comments={comments}
                    setComments={setComments}
                    commentInputOpen={commentInputOpen}
                    setCommentInputOpen={setCommentInputOpen}
                    setPopoverOpen={setPopoverOpen}
                    commentId={comment.id}
                    posterId={posterId}
                    commentorId={comment.commentor.id}
                  />
                }
              >
                <BsThreeDotsVertical className="action-more__icon" />
              </Popover>
            </div>
          </div>
        </div>
        <CommentContent comment={comment} />
        <div className="comment-card__operation--bottom">
          <span className="comment-card__time">
            {stringUtils.uppercaseStr(dayjs(comment.created_at).fromNow())}
          </span>
          <div className="comment-card__operation--right">
            <div
              className="comment-card-operation-bottom__item"
              onClick={() => {
                handleOpenCommentInput(cioIndex);
                // Consider to change to content of the input here
                setInputContent({
                  content_html: '',
                  content_json: '',
                  reply_to: null,
                });
              }}
            >
              <AiOutlineComment className="comment-reply__icon" />
              <span>Reply ({comment.replies.length})</span>
            </div>
            <div className="comment-card-operation-bottom__item">
              {comment.current_user_interact ? (
                <AiFillLike
                  onClick={() =>
                    handleVoteComment({
                      like: !comment.current_user_interact,
                    })
                  }
                  className="upvoted-icon"
                />
              ) : (
                <AiOutlineLike
                  onClick={() =>
                    handleVoteComment({
                      like: !comment.current_user_interact,
                    })
                  }
                  className="upvote-icon"
                />
              )}
              <span>{comment.likes_count}</span>
            </div>
          </div>
        </div>
        {comment.liked_by_poster && <Liked />}
        {commentInputOpen[cioIndex].state && (
          <TiptapReply
            replyInputOpen={commentInputOpen[cioIndex].state}
            sendReplyLoading={sendReplyLoading}
            reply={inputContent}
            crboIndex={cioIndex}
            setReply={setInputContent}
            handleSendReply={handleSendReply}
          />
        )}
        <div className="comment-card__replies">
          {comment.replies.slice(0, 2).map((reply, index) => (
            <PostReplyCard
              key={reply.id}
              reply={reply}
              replyIndex={index}
              cioIndex={cioIndex + index + 1}
              comments={comments}
              setComments={setComments}
              commentIndex={commentIndex}
              commentId={comment.id}
              postId={postId}
              posterId={posterId}
              commentorId={comment.commentor.id}
              commentInputOpen={commentInputOpen}
              setCommentInputOpen={setCommentInputOpen}
              handleOpenReplyInput={handleOpenReplyInput}
              inputContent={inputContent}
              setInputContent={setInputContent}
              sendReplyLoading={sendReplyLoading}
              handleSendReply={handleSendReply}
            />
          ))}
        </div>
        {comment.replies.length > 2 && (
          <div
            className="comment-card-reply__detail"
            onClick={() => setAllRepliesShown(!allRepliesShown)}
          >
            <span>Replies: {comment.replies.length - 2}</span>
            <IoIosArrowForward className="more-replies__icon" />
          </div>
        )}
      </div>

      <AllCommentReplies
        postId={postId}
        posterId={posterId}
        commentorId={comment.commentor.id}
        comment={comment}
        commentIndex={commentIndex}
        cioIndex={cioIndex}
        comments={comments}
        setComments={setComments}
        inputContent={inputContent}
        setInputContent={setInputContent}
        commentInputOpen={commentInputOpen}
        setCommentInputOpen={setCommentInputOpen}
        handleOpenCommentInput={handleOpenCommentInput}
        handleOpenReplyInput={handleOpenReplyInput}
        allRepliesShown={allRepliesShown}
        setAllRepliesShown={setAllRepliesShown}
        handleVoteComment={handleVoteComment}
        sendReplyLoading={sendReplyLoading}
        handleSendReply={handleSendReply}
      />
    </div>
  );
};

export default PostCommentCard;
