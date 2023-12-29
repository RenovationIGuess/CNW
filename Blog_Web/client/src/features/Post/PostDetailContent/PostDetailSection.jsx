import dayjs from 'dayjs';
import React from 'react';
import {
  AiFillLike,
  AiFillStar,
  AiOutlineComment,
  AiOutlineInfoCircle,
  AiOutlineLike,
  AiOutlineShareAlt,
  AiOutlineStar,
} from 'react-icons/ai';
import { Link } from 'react-router-dom';
import axiosClient from '~/axios';
import TiptapContent from '~/components/Tiptap/TiptapContent';
import { images } from '~/constants';
import { userStateContext } from '~/contexts/ContextProvider';

const PostDetailSection = ({
  post,
  setPost,
  commentsNumber,
  fetchPostLoading,
}) => {
  const { currentUser } = userStateContext();

  const handleStarPost = (payload) => {
    axiosClient
      .patch(`/posts/${post.id}/star`, payload)
      .then(({ data }) => {
        setPost(data.data);
      })
      .catch((err) => console.log(err))
      .finally(() => {});
  };

  const handleLikePost = (payload) => {
    axiosClient
      .patch(`/posts/${post.id}/like`, payload)
      .then(({ data }) => {
        setPost(data.data);
      })
      .catch((err) => console.log(err))
      .finally(() => {});
  };

  return (
    <div className="post-page__main">
      {post.banner && (
        <img className="post-cover" src={post.banner} alt="post-cover" />
      )}
      <div className="post-page__title">
        <div className="post-type"></div>
        <h1>{post.title}</h1>
      </div>
      <div className="post-page-author-header">
        <div className="social-page-header-mask">
          <div className="social-page-header-wrp rounded-none">
            <div className="post-page-header-content">
              <div className="post-page-header-main">
                <div className="post-page-header__left">
                  <div className="post-poster-card">
                    <Link
                      to={`/profile/${post.poster.id}/public`}
                      className="post-poster-card__link"
                    >
                      <div className="post-poster-card__avatar">
                        <img
                          className="poster-avatar__img"
                          src={post.poster.profile.avatar}
                          alt="poster-avatar"
                        />
                      </div>
                    </Link>
                    <div className="post-poster-card__info">
                      <div className="post-poster-card__name">
                        <Link
                          to={`/profile/${post.poster.id}/public`}
                          className="post-poster-title"
                        >
                          <span className="post-poster-title__name">
                            {post.poster.profile.name}
                          </span>
                          <span className="poster-authentication-mark">
                            <img
                              src={images.certificate_icon}
                              className="poster-authentication-mark__icon"
                              alt="certified-icon"
                            />
                          </span>
                        </Link>
                      </div>
                      <p className="post-upload-date">
                        {dayjs(post.created_at).format('YYYY/MM/DD')}
                      </p>
                    </div>
                    {currentUser.id !== post.poster.id && (
                      <div className="post-poster-card__follow">
                        <div className="poster-follow-button" role="button">
                          <span>Follow</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="post-page-header__right"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="post-page__content">
        <TiptapContent content={post.content_json} />
      </div>
      <div className="post-page__footer">
        <div className="post-page__auth">
          <div className="auth-type">
            <AiOutlineInfoCircle className="auth-icon" />
            <span className="auth-type__label">Reblog allowed</span>
          </div>
        </div>
        <div className="post-page-stats">
          <div className="post-page-stats__item">
            <div className="post-page-stats__icon">
              <AiOutlineComment className="icon" />
              <span>{commentsNumber}</span>
            </div>
          </div>
          <div className="post-page-stats__item">
            <div
              className="post-page-stats__icon"
              onClick={() =>
                handleStarPost({ star: !post.current_user_interact.star })
              }
            >
              {post.current_user_interact.star ? (
                <AiFillStar className="icon active" />
              ) : (
                <AiOutlineStar className={`icon`} />
              )}
              <span>{post.stars_count}</span>
            </div>
          </div>
          <div className="post-page-stats__item">
            <div
              className="post-page-stats__icon"
              onClick={() =>
                handleLikePost({ like: !post.current_user_interact.like })
              }
            >
              {post.current_user_interact.like ? (
                <AiFillLike className="icon active" />
              ) : (
                <AiOutlineLike className={`icon`} />
              )}
              <span>{post.likes_count}</span>
            </div>
          </div>
          <div className="post-page-stats__item">
            <div className="post-page-stats__icon">
              <AiOutlineShareAlt className="icon" />
              <span>12</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailSection;
