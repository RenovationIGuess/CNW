import { Popover, Tooltip } from 'antd';
import React, { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import OperationsPopover from './OperationsPopover';
import ReplyContent from '~/components/Tiptap/ReplyContent';
import { AiFillCrown, AiOutlineComment } from 'react-icons/ai';
import { TiArrowUpOutline, TiArrowUpThick } from 'react-icons/ti';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import TiptapReply from '~/components/Tiptap/TiptapReply';
import axiosClient from '~/axios';
import { stringUtils } from '~/utils';
dayjs.extend(relativeTime);

// replyIndex is the index of the reply (aka comment) in the comment.replies array
// crboIndex - CommentReplyBoxOpen index - the index of the reply in the commentReplyBoxOpen array
// commentIndex used in comments array
// commentCrboIndex used in commentReplyBoxOpen array
const NoteCommentReplyCard = ({
  note,
  commentIndex,
  comment,
  replyReplyBoxOpen,
  handleOpenReplyReplyBox,
  sendReplyLoading,
  handleSendReply,
  reply,
  replyIndex,
  crboIndex,
  replyInfo,
  setReplyInfo,
  comments,
  setComments,
  commentReplyBoxOpenArr,
  setCommentReplyBoxOpen,
  sidebar,
}) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleVoteReply = (payload) => {
    axiosClient
      .patch(`/notes/${note.id}/comments/${reply.id}/vote`, payload)
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
              <span className="account-title__landlord">
                {sidebar ? (
                  <Tooltip placement="top" title={`Note's owner`}>
                    <AiFillCrown />
                  </Tooltip>
                ) : (
                  `Note's owner`
                )}
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
            </Link>
          </Link>
          <ReplyContent reply={reply} />
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
                    <OperationsPopover
                      note={note}
                      type="reply"
                      reply={reply}
                      comment={comment}
                      commentIndex={commentIndex}
                      comments={comments}
                      setComments={setComments}
                      commentReplyBoxOpenArr={commentReplyBoxOpenArr}
                      setCommentReplyBoxOpen={setCommentReplyBoxOpen}
                      setPopoverOpen={setPopoverOpen}
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
                handleOpenReplyReplyBox(crboIndex);
                setReplyInfo({
                  ...replyInfo,
                  content_json: '',
                  content_html: '',
                  reply_to: reply.user_id,
                });
              }}
            >
              <AiOutlineComment className="comment-reply__icon" />
              <span>Reply</span>
            </div>
            <div className="comment-card-operation-bottom__item">
              {reply.current_user_interact.upvote ? (
                <TiArrowUpThick
                  onClick={() => {
                    handleVoteReply({
                      upvote: !reply.current_user_interact.upvote,
                      downvote: reply.current_user_interact.downvote,
                    });
                  }}
                  className="upvoted-icon"
                />
              ) : (
                <TiArrowUpOutline
                  onClick={() => {
                    handleVoteReply({
                      upvote: !reply.current_user_interact.upvote,
                      downvote: reply.current_user_interact.downvote,
                    });
                  }}
                  className="upvote-icon"
                />
              )}
              <span>{reply.upvote_count}</span>
            </div>
            <div className="comment-card-operation-bottom__item">
              {reply.current_user_interact.downvote ? (
                <TiArrowUpThick
                  onClick={() => {
                    handleVoteReply({
                      upvote: reply.current_user_interact.upvote,
                      downvote: !reply.current_user_interact.downvote,
                    });
                  }}
                  className="downvoted-icon"
                />
              ) : (
                <TiArrowUpOutline
                  onClick={() => {
                    handleVoteReply({
                      upvote: reply.current_user_interact.upvote,
                      downvote: !reply.current_user_interact.downvote,
                    });
                  }}
                  className="downvote-icon"
                />
              )}
              <span>{reply.downvote_count}</span>
            </div>
          </div>
        </div>
        {replyReplyBoxOpen.state && (
          <TiptapReply
            replyInputOpen={replyReplyBoxOpen.state}
            sendReplyLoading={sendReplyLoading}
            reply={replyInfo}
            crboIndex={crboIndex}
            setReply={setReplyInfo}
            handleSendReply={handleSendReply}
          />
        )}
      </div>
    </>
  );
};

export default NoteCommentReplyCard;
