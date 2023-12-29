import React from 'react';
import { images } from '~/constants';

const Liked = ({ content = 'Author liked this' }) => {
  return (
    <div className="comment-card-common-label">
      <div className="comment-brand--reply-like">
        <div className="comment-brand__icon">
          <img
            className="comment-img-icon"
            src={images.author_like_icon}
            alt="author-liked-this-icon"
          />
        </div>
        <div className="comment-brand__text">{content}</div>
      </div>
    </div>
  );
};

export default Liked;
