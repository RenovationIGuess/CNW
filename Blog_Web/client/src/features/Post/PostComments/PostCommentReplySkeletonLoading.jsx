import React from 'react';
import { AiOutlineComment } from 'react-icons/ai';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { TiArrowUpOutline } from 'react-icons/ti';

const PostCommentReplySkeletonLoading = () => {
  return (
    <div className="comment-card-inner-reply">
      <div className="comment-card-inner-reply__body">
        <div className="comment-card-inner-reply__user">
          <div className="user-avatar__mini">
            <div className="skeleton-avatar skeleton"></div>
          </div>
          <div className="comment-card-inner-reply__name">
            <span className="account-title__name">
              <div className="skeleton skeleton-title"></div>
            </span>
          </div>
        </div>
        <div className="skeleton-comment-content">
          <div className="skeleton-change-row skeleton"></div>
          <div className="skeleton-change-row skeleton"></div>
        </div>
      </div>
      <div className="comment-card-inner-reply__bottom">
        <span className="skeleton skeleton-time"></span>

        <div className="flex items-center">
          <div className="comment-card-inner-reply__actions">
            <div className="ml-0 relative z-[100]">
              <BsThreeDotsVertical className="action-more__icon text-xl" />
            </div>
          </div>
          <div className="comment-card-operation-bottom__item">
            <AiOutlineComment className="comment-reply__icon" />
            <span>Reply</span>
          </div>
          <div className="comment-card-operation-bottom__item">
            <TiArrowUpOutline className="upvote-icon" />
            <span className="skeleton-vote-count skeleton"></span>
          </div>
          <div className="comment-card-operation-bottom__item">
            <TiArrowUpOutline className="downvote-icon" />
            <span className="skeleton-vote-count skeleton"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCommentReplySkeletonLoading;
