import { Popover } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useState } from 'react';
import { AiFillLike, AiOutlineComment, AiOutlineLike } from 'react-icons/ai';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import axiosClient from '~/axios';
import CommentContent from '~/components/Tiptap/CommentContent';
import { cn, stringUtils } from '~/utils';
import MoreActions from './MoreActions';
import TiptapReply from '~/components/Tiptap/TiptapReply';
import { IoIosArrowForward } from 'react-icons/io';
import PostReplyCard from './PostReplyCard';
import Liked from '~/components/Actions/Liked';
import usePostStore from '~/store/usePostStore';
import { toast } from 'sonner';
import TiptapComment from '~/components/Tiptap/TiptapComment';

dayjs.extend(relativeTime);

// commentInputOpen: cioIndex
// comments: commentIndex
const PostCommentCard = ({ comment, commentIndex, cioIndex }) => {
  const [post] = usePostStore((state) => [state.post]);
  const [comments, setComments] = usePostStore((state) => [
    state.comments,
    state.setComments,
  ]);
  const [commentInputOpen] = usePostStore((state) => [state.commentInputOpen]);
  const [setReplyToId] = usePostStore((state) => [state.setReplyToId]);
  const [openCommentInput] = usePostStore((state) => [state.openCommentInput]);
  const [setSelectedComment, setAllRepliesShown] = usePostStore((state) => [
    state.setSelectedComment,
    state.setAllRepliesShown,
  ]);

  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleVoteComment = (payload) => {
    axiosClient
      .patch(`/posts/${post.id}/comments/${comment.id}/like`, payload)
      .then(({ data }) => {
        setComments(comments.map((c) => (c.id === comment.id ? data.data : c)));
      })
      .catch((err) => {
        console.log(err);
        toast.error('Server Error!', {
          position: 'top-right',
          duration: 3000,
        });
      })
      .finally(() => {});
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
                    setPopoverOpen={setPopoverOpen}
                    commentId={comment.id}
                    commentIndex={commentIndex}
                    commentorId={comment.commentor.id}
                    cioIndex={cioIndex}
                  />
                }
              >
                <BsThreeDotsVertical className="action-more__icon" />
              </Popover>
            </div>
          </div>
        </div>
        {commentInputOpen[cioIndex].edit_state ? (
          <TiptapComment
            initContent={comment.content_html}
            cioIndex={cioIndex}
          />
        ) : (
          <CommentContent comment={comment} />
        )}
        <div
          className={cn(
            'comment-card__operation--bottom',
            commentInputOpen[cioIndex].edit_state && 'mt-4'
          )}
        >
          <span className="comment-card__time">
            {stringUtils.uppercaseStr(dayjs(comment.updated_at).fromNow())}
          </span>
          <div className="comment-card__operation--right">
            <div
              className="comment-card-operation-bottom__item"
              onClick={() => {
                openCommentInput(cioIndex);
                setReplyToId(null);
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
            commentId={comment.id}
            commentIndex={commentIndex}
            crboIndex={cioIndex}
          />
        )}
        <div className="comment-card__replies">
          {comment.replies.slice(0, 2).map((reply, index) => (
            <PostReplyCard
              key={reply.id}
              reply={reply}
              replyIndex={index}
              cioIndex={cioIndex + index + 1}
              commentIndex={commentIndex}
              commentId={comment.id}
              commentorId={comment.commentor.id}
            />
          ))}
        </div>
        {comment.replies.length > 2 && (
          <div
            className="comment-card-reply__detail"
            onClick={() => {
              setSelectedComment({
                comment: comment,
                commentIndex: commentIndex,
                cioIndex: cioIndex,
                commentorId: comment.commentor.id,
              });
              setAllRepliesShown(true);
            }}
          >
            <span>Replies: {comment.replies.length - 2}</span>
            <IoIosArrowForward className="more-replies__icon" />
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCommentCard;
