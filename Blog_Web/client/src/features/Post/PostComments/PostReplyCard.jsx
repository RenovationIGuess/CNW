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
import { cn, stringUtils } from '~/utils';
import MoreActions from './MoreActions';
import usePostStore from '~/store/usePostStore';
import { toast } from 'sonner';
dayjs.extend(relativeTime);

const PostReplyCard = ({
  reply,
  replyIndex,
  cioIndex,
  commentIndex,
  commentId,
  commentorId,
}) => {
  const [post] = usePostStore((state) => [state.post]);
  const [comments, setComments] = usePostStore((state) => [
    state.comments,
    state.setComments,
  ]);
  const [setReplyToId] = usePostStore((state) => [state.setReplyToId]);
  const [openCommentInput] = usePostStore((state) => [state.openCommentInput]);
  const [commentInputOpen] = usePostStore((state) => [state.commentInputOpen]);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleVoteReply = (payload) => {
    axiosClient
      .patch(`/posts/${post.id}/comments/${reply.id}/like`, payload)
      .then(({ data }) => {
        comments[commentIndex].replies[replyIndex] = {
          ...data.data,
        };
        setComments([...comments]);
      })
      .catch((err) => {
        console.log(err);
        toast.error('Server Error!', {
          position: 'bottom-center',
          duration: 3000,
        });
      })
      .finally(() => {});
  };

  return (
    <>
      <div className="comment-card-inner-reply">
        <div className="comment-card-inner-reply__body">
          <div className="comment-card-inner-reply__user">
            <Link
              to={`/profile/${reply.commentor.id}/public`}
              className="user-avatar__mini"
            >
              <img
                src={reply.commentor.profile.avatar}
                alt="replier-avatar"
                className="user-avatar__img"
              />
            </Link>
            <div className="comment-card-inner-reply__name">
              <Link
                to={`/profile/${reply.commentor.id}/public`}
                className="account-title__name"
              >
                {reply.commentor.profile.name}
              </Link>
              <span className="account-title__landlord">
                <AiFillCrown />
                &nbsp;Author
              </span>
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
            </div>
          </div>
          {commentInputOpen[cioIndex].edit_state ? (
            <TiptapReply
              initContent={reply.content_html}
              commentId={commentId}
              commentIndex={commentIndex}
              crboIndex={cioIndex}
            />
          ) : (
            <ReplyContent reply={reply} />
          )}
        </div>
        <div
          className={cn(
            'comment-card-inner-reply__bottom',
            commentInputOpen[cioIndex].edit_state && 'mt-4'
          )}
        >
          <span className="comment-card-inner-reply__time">
            {stringUtils.uppercaseStr(dayjs(reply.updated_at).fromNow())}
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
                      setPopoverOpen={setPopoverOpen}
                      commentId={commentId}
                      commentIndex={commentIndex}
                      commentorId={commentorId}
                      replyId={reply.id}
                      replierId={reply.commentor.id}
                      cioIndex={cioIndex}
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
                openCommentInput(cioIndex);
                setReplyToId(reply.commentor.id);
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
            commentId={commentId}
            commentIndex={commentIndex}
            crboIndex={cioIndex}
          />
        )}
      </div>
    </>
  );
};

export default PostReplyCard;
