import { Tooltip } from 'antd';
import React from 'react';
import { AiOutlineClockCircle, AiOutlineUndo } from 'react-icons/ai';
import { BsThreeDotsVertical } from 'react-icons/bs';
import '~/styles/skeletonLoading.scss';

const NoteHistoriesSkeletonLoading = () => {
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
              <span className="history-card__header--label">
                <div className="skeleton skeleton-title"></div>
              </span>
            </div>
            <div className="comment-card__account--tags">
              <span className="skeleton skeleton-time"></span>
            </div>
          </div>
          <div className="comment-card__operation--top">
            <div className="comment-card__action">
              <Tooltip placement="top" title={<>Roll back to this version</>}>
                <AiOutlineUndo className="action-more__icon" />
              </Tooltip>
            </div>
            <div className="comment-card__action">
              <Tooltip
                placement="top"
                title={<>View version for this update</>}
              >
                <AiOutlineClockCircle className="action-more__icon" />
              </Tooltip>
            </div>
            <div className="comment-card__action">
              <BsThreeDotsVertical className="action-more__icon" />
            </div>
          </div>
        </div>
        <div className="change-log-item">
          <div className="change-header">
            <div className="skeleton-change-icon skeleton"></div>
            <div className="skeleton-change-label skeleton"></div>
          </div>
          <div className="flex flex-col mt-4 gap-3">
            <div className="skeleton-change-row skeleton"></div>
            <div className="skeleton-change-row skeleton"></div>
            <div className="skeleton-change-row skeleton"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteHistoriesSkeletonLoading;
