import { Modal, Popover } from 'antd';
import React, { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import CommentContent from '~/components/Tiptap/CommentContent';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { TiArrowUpOutline, TiArrowUpThick } from 'react-icons/ti';
import { AiOutlineComment } from 'react-icons/ai';
import { stringUtils } from '~/utils';
import TiptapReply from '~/components/Tiptap/TiptapReply';
import NoteCommentReplyCard from './NoteCommentReplyCard';
import OperationsPopover from './OperationsPopover';
import { images } from '~/constants';
dayjs.extend(relativeTime);

const AllCommentReplies = ({
  comment,
  commentIndex,
  crboIndex,
  allRepliesShown,
  setAllRepliesShown,
  handleVoteComment,
  commentReplyBoxOpenArr,
  commentReplyBoxOpen,
  handleOpenCommentReplyBox,
  note,
  handleOpenReplyReplyBox,
  setCommentReplyBoxOpen,
  replyInfo,
  setReplyInfo,
  sendReplyLoading,
  handleSendReply,
  comments,
  setComments,
}) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <Modal
      width={680}
      centered
      open={allRepliesShown}
      onCancel={() => {
        setAllRepliesShown(!allRepliesShown);
      }}
      footer={null}
      className="custom-modal replies-modal__container"
      title="View comment's detail"
    >
      <div className="reply-detail-container">
        <div className="reply-detail-list">
          <div className="reply-card">
            <div className="reply-card__container">
              <div className="reply-card__header">
                <Link to={`/profile/${comment.commentor.id}/public`}>
                  <div className="reply-card__avatar">
                    <img
                      className="avatar__img"
                      src={comment.commentor.profile.avatar}
                      alt="commentor-avatar"
                    />
                  </div>
                </Link>
                <div className="reply-card__account">
                  <Link
                    to={`/profile/${comment.commentor.id}/public`}
                    className="reply-card__nickname"
                  >
                    <span className="account-title__name reply-card__nickname--label">
                      {comment.commentor.profile.name}
                    </span>
                  </Link>
                  <div className="comment-card__account--tags">
                    <span>Suppose to display user's tags here</span>
                  </div>
                </div>
                <div className="reply-card-operation-top">
                  <div className="comment-card__action">
                    <Popover
                      rootClassName="custom-popover"
                      placement="bottomRight"
                      trigger={'click'}
                      open={popoverOpen}
                      onOpenChange={() => setPopoverOpen(!popoverOpen)}
                      content={
                        <OperationsPopover
                          note={note}
                          type="comment"
                          comment={comment}
                          comments={comments}
                          setComments={setComments}
                          commentReplyBoxOpenArr={commentReplyBoxOpenArr}
                          setCommentReplyBoxOpen={setCommentReplyBoxOpen}
                          setPopoverOpen={setPopoverOpen}
                          setAllRepliesShown={setAllRepliesShown}
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
                  {stringUtils.uppercaseStr(
                    dayjs(comment.created_at).fromNow()
                  )}
                </span>
                <div className="comment-card__operation--right">
                  <div
                    className="comment-card-operation-bottom__item"
                    onClick={() => {
                      handleOpenCommentReplyBox(crboIndex);
                      setReplyInfo({
                        ...replyInfo,
                        content_json: '',
                        content_html: '',
                        reply_to: null,
                      });
                    }}
                  >
                    <AiOutlineComment className="comment-reply__icon" />
                    <span>Reply ({comment.replies.length})</span>
                  </div>
                  <div className="comment-card-operation-bottom__item">
                    {comment.current_user_interact.upvote ? (
                      <TiArrowUpThick
                        onClick={() =>
                          handleVoteComment({
                            upvote: !comment.current_user_interact.upvote,
                            downvote: comment.current_user_interact.downvote,
                          })
                        }
                        className="upvoted-icon"
                      />
                    ) : (
                      <TiArrowUpOutline
                        onClick={() =>
                          handleVoteComment({
                            upvote: !comment.current_user_interact.upvote,
                            downvote: comment.current_user_interact.downvote,
                          })
                        }
                        className="upvote-icon"
                      />
                    )}
                    <span>{comment.upvote_count}</span>
                  </div>
                  <div className="comment-card-operation-bottom__item">
                    {comment.current_user_interact.downvote ? (
                      <TiArrowUpThick
                        onClick={() =>
                          handleVoteComment({
                            upvote: comment.current_user_interact.upvote,
                            downvote: !comment.current_user_interact.downvote,
                          })
                        }
                        className="downvoted-icon"
                      />
                    ) : (
                      <TiArrowUpOutline
                        onClick={() =>
                          handleVoteComment({
                            upvote: comment.current_user_interact.upvote,
                            downvote: !comment.current_user_interact.downvote,
                          })
                        }
                        className="downvote-icon"
                      />
                    )}
                    <span>{comment.downvote_count}</span>
                  </div>
                </div>
              </div>
              {commentReplyBoxOpen.state && (
                <TiptapReply
                  replyInputOpen={commentReplyBoxOpen.state}
                  sendReplyLoading={sendReplyLoading}
                  reply={replyInfo}
                  crboIndex={crboIndex}
                  setReply={setReplyInfo}
                  handleSendReply={handleSendReply}
                />
              )}
            </div>
          </div>
          <div className="reply-list__title">All replies</div>
          <div className="reply-list">
            {comment.replies.length === 0 ? (
              <div className="flex flex-col my-6 items-center justify-center">
                <img src={images.nothing} alt="nothing" className="w-[276px]" />
                <p className="note-comment__empty--title">
                  There are no comments ~.~
                </p>
              </div>
            ) : (
              comment.replies.map((reply, index) => (
                <div className="reply-card" key={reply.id}>
                  <NoteCommentReplyCard
                    note={note}
                    reply={reply}
                    replyIndex={index}
                    crboIndex={crboIndex + index + 1}
                    commentIndex={commentIndex}
                    comment={comment}
                    commentReplyBoxOpenArr={commentReplyBoxOpenArr}
                    replyReplyBoxOpen={
                      commentReplyBoxOpenArr[crboIndex + index + 1]
                    }
                    handleOpenReplyReplyBox={handleOpenReplyReplyBox}
                    setCommentReplyBoxOpen={setCommentReplyBoxOpen}
                    replyInfo={replyInfo}
                    setReplyInfo={setReplyInfo}
                    sendReplyLoading={sendReplyLoading}
                    handleSendReply={handleSendReply}
                    comments={comments}
                    setComments={setComments}
                  />
                </div>
              ))
            )}
          </div>
          <div className="loadmore-scroll">
            <div className="loadmore__nomore">That's all ~</div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AllCommentReplies;
