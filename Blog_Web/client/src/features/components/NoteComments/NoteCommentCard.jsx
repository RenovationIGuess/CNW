import React, { useEffect, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { userStateContext } from '~/contexts/ContextProvider';
import CommentContent from '~/components/Tiptap/CommentContent';
import { AiOutlineComment } from 'react-icons/ai';
import { TiArrowUpOutline, TiArrowUpThick } from 'react-icons/ti';
import { IoIosArrowForward } from 'react-icons/io';
import axiosClient from '~/axios';
import OperationsPopover from './OperationsPopover';
import { Popover } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import TiptapReply from '~/components/Tiptap/TiptapReply';
import NoteCommentReplyCard from './NoteCommentReplyCard';
import AllCommentReplies from './AllCommentReplies';
import { stringUtils } from '~/utils';
import useModalStore from '~/store/useModalStore';
dayjs.extend(relativeTime);

// commentIndex is used to get the index of the comment in the comments array
// crboIndex is used to get the index of the comment in the commentReplyBoxOpen array
const NoteCommentCard = ({
  note,
  comment,
  commentIndex,
  crboIndex,
  comments,
  setComments,
  commentReplyBoxOpenArr,
  commentReplyBoxOpen,
  setCommentReplyBoxOpen,
  handleOpenCommentReplyBox,
  sidebar,
}) => {
  const { currentUser } = userStateContext();

  const [setActionToast] = useModalStore((state) => [state.setActionToast]);

  const [sendReplyLoading, setSendReplyLoading] = useState(false);
  const [replyInfo, setReplyInfo] = useState({
    note_id: note.id,
    user_id: currentUser.id,
    note_comment_id: comment.id,
    reply_to: null,
    content_json: '',
    content_html: '',
    selected_text: '',
    pinned: false,
  });
  const [allRepliesShown, setAllRepliesShown] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    setReplyInfo({
      ...replyInfo,
      note_comment_id: comment.id,
    });
  }, [comment.id]);

  const handleSendReply = (crboIndex) => {
    setSendReplyLoading(true);
    axiosClient
      .post(`/notes/${note.id}/comments`, replyInfo)
      .then(({ data }) => {
        comments[commentIndex].replies.unshift(data.data);
        setComments([...comments]);

        // Close the input box
        commentReplyBoxOpenArr[crboIndex].state = false;
        // Because newest reply will be on top => add new item
        // right after the index of the comment
        commentReplyBoxOpenArr.splice(crboIndex + 1, 0, {
          comment_id: data.data.id,
          state: false,
        });
        setCommentReplyBoxOpen([...commentReplyBoxOpenArr]);

        // Reset input field
        setReplyInfo({
          ...replyInfo,
          content_json: '',
          content_html: '',
          reply_to: null,
        });

        setActionToast({
          status: true,
          message: data.message,
        });
      })
      .catch((err) => console.log(err))
      .finally(() => setSendReplyLoading(false));
  };

  const handleVoteComment = (payload) => {
    axiosClient
      .patch(`/notes/${note.id}/comments/${comment.id}/vote`, payload)
      .then(({ data }) => {
        comments[commentIndex] = {
          ...data.data,
        };
        setComments([...comments]);
      })
      .catch((err) => console.log(err))
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
                  <OperationsPopover
                    note={note}
                    type="comment"
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
        <div className="comment-card__replies">
          {comment.replies.slice(0, 2).map((reply, index) => (
            <NoteCommentReplyCard
              note={note}
              reply={reply}
              replyIndex={index}
              crboIndex={crboIndex + index + 1}
              key={reply.id}
              commentIndex={commentIndex}
              comment={comment}
              replyReplyBoxOpen={commentReplyBoxOpenArr[crboIndex + index + 1]}
              handleOpenReplyReplyBox={handleOpenCommentReplyBox}
              commentReplyBoxOpenArr={commentReplyBoxOpenArr}
              setCommentReplyBoxOpen={setCommentReplyBoxOpen}
              replyInfo={replyInfo}
              setReplyInfo={setReplyInfo}
              sendReplyLoading={sendReplyLoading}
              handleSendReply={handleSendReply}
              comments={comments}
              setComments={setComments}
              sidebar={sidebar}
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
        comment={comment}
        commentIndex={commentIndex}
        crboIndex={crboIndex}
        allRepliesShown={allRepliesShown}
        setAllRepliesShown={setAllRepliesShown}
        handleVoteComment={handleVoteComment}
        commentReplyBoxOpenArr={commentReplyBoxOpenArr}
        commentReplyBoxOpen={commentReplyBoxOpen}
        handleOpenCommentReplyBox={handleOpenCommentReplyBox}
        note={note}
        handleOpenReplyReplyBox={handleOpenCommentReplyBox}
        setCommentReplyBoxOpen={setCommentReplyBoxOpen}
        replyInfo={replyInfo}
        setReplyInfo={setReplyInfo}
        sendReplyLoading={sendReplyLoading}
        handleSendReply={handleSendReply}
        comments={comments}
        setComments={setComments}
      />
    </div>
  );
};

export default NoteCommentCard;
