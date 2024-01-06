import React from 'react';
import { FaFirstdraft } from 'react-icons/fa';
import { AiFillCamera, AiFillEdit } from 'react-icons/ai';
import { BsFillImageFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

const PostNow = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="side-section new-post-card">
        <div className="side-section__header">
          <h2 className="side-section__title">
            <p className="new-post-card__title">Blog now ~</p>
          </h2>
          <div className="post-draft">
            <FaFirstdraft className="icon" />
            <span>Draft (10)</span>
          </div>
        </div>
        <div className="side-section__body">
          <div className="new-post-card__content">
            <div
              className="new-post-card__post"
              onClick={() => navigate('/newBlog?type=all')}
            >
              <div className="new-post-card__item">
                <div className="post-icon">
                  <AiFillEdit className="icon" />
                </div>
                <span>Blog</span>
              </div>
            </div>
            <div className="new-post-card__post">
              <div className="new-post-card__item">
                <div className="post-icon image-type">
                  <BsFillImageFill className="icon" />
                </div>
                <span>Image</span>
              </div>
            </div>
            <div className="new-post-card__post">
              <div className="new-post-card__item">
                <div className="post-icon video-type">
                  <AiFillCamera className="icon" />
                </div>
                <span>Video</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostNow;
