import React from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { AiOutlineComment } from 'react-icons/ai';
import { TiArrowUpOutline } from 'react-icons/ti';
import { IoIosArrowForward } from 'react-icons/io';
import '~/styles/skeletonLoading.scss';
import NoteCommentReplySkeletonLoading from './NoteCommentReplySkeletonLoading';

const NoteCommentsSkeletonLoading = () => {
  return (
    <div className="comment-card">
      <div className="comment-card__left">
        <div className="comment-card__avatar">
          <div className="skeleton-avatar skeleton"></div>
        </div>
      </div>
      <div className="comment-card__container">
        <div className="comment-card__header">
          <div className="comment-card__account">
            <div className="comment-card__account--title">
              <span className="account-title__name">
                <div className="skeleton skeleton-title"></div>
              </span>
            </div>
            <div className="comment-card__account--tags">
              <span className="skeleton skeleton-time"></span>
            </div>
          </div>
          <div className="comment-card__operation--top">
            <div className="comment-card__action">
              <BsThreeDotsVertical className="action-more__icon" />
            </div>
          </div>
        </div>
        <div className="skeleton-comment-content">
          <div className="skeleton-change-row skeleton"></div>
          <div className="skeleton-change-row skeleton"></div>
          <div className="skeleton-change-row skeleton"></div>
        </div>
        <div className="comment-card__operation--bottom">
          <span className="skeleton skeleton-time"></span>

          <div className="comment-card__operation--right">
            <div className="comment-card-operation-bottom__item">
              <AiOutlineComment className="comment-reply__icon" />
              <span className="skeleton-reply-count skeleton"></span>
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
        <div className="comment-card__replies">
          <NoteCommentReplySkeletonLoading />
          <NoteCommentReplySkeletonLoading />
        </div>

        <div className="comment-card-reply__detail">
          <span className="skeleton-reply-count skeleton"></span>
          <IoIosArrowForward className="more-replies__icon" />
        </div>
      </div>
    </div>
  );
};

export default NoteCommentsSkeletonLoading;
