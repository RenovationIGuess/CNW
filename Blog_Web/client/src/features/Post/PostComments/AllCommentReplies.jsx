import { Modal, Popover } from 'antd';
import React, { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import CommentContent from '~/components/Tiptap/CommentContent';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { AiFillLike, AiOutlineComment, AiOutlineLike } from 'react-icons/ai';
import { stringUtils } from '~/utils';
import TiptapReply from '~/components/Tiptap/TiptapReply';
import { images } from '~/constants';
import MoreActions from './MoreActions';
import PostReplyCard from './PostReplyCard';
import Liked from '~/components/Actions/Liked';
dayjs.extend(relativeTime);

const AllCommentReplies = ({
  postId,
  posterId,
  commentorId,
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
  allRepliesShown,
  setAllRepliesShown,
  handleVoteComment,
  handleSendReply,
  sendReplyLoading,
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
      title="View comments"
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
                        <MoreActions
                          type={'comment'}
                          postId={postId}
                          commentId={comment.id}
                          commentIndex={commentIndex}
                          comments={comments}
                          setComments={setComments}
                          commentInputOpen={commentInputOpen}
                          setCommentInputOpen={setCommentInputOpen}
                          setPopoverOpen={setPopoverOpen}
                          posterId={posterId}
                          commentorId={commentorId}
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
                      handleOpenCommentInput(cioIndex);
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
                  setReply={setInputContent}
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
                <div className="reply-card" key={index}>
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
                    commentInputOpen={commentInputOpen}
                    setCommentInputOpen={setCommentInputOpen}
                    handleOpenReplyInput={handleOpenReplyInput}
                    inputContent={inputContent}
                    setInputContent={setInputContent}
                    handleSendReply={handleSendReply}
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
