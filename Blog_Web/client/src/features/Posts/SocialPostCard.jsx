import dayjs from 'dayjs';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { images } from '~/constants';
import relativeTime from 'dayjs/plugin/relativeTime';
import { userStateContext } from '~/contexts/ContextProvider';
import {
  AiFillEyeInvisible,
  AiFillLike,
  AiFillStar,
  AiOutlineComment,
  AiOutlineEye,
  AiOutlineLike,
  AiOutlineShareAlt,
  AiOutlineStar,
} from 'react-icons/ai';
import TiptapContent from '~/components/Tiptap/TiptapContent';
import axiosClient from '~/axios';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { Popover } from 'antd';
import PostActions from '../Post/PostActions';
import usePostsStore from '~/store/usePostsStore';
dayjs.extend(relativeTime);

const SocialPostCard = ({ post, postIndex }) => {
  const { currentUser } = userStateContext();

  const [posts, setPosts] = usePostsStore((state) => [
    state.posts,
    state.setPosts,
  ]);

  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleStarPost = (payload) => {
    axiosClient
      .patch(`/posts/${post.id}/star`, payload)
      .then(({ data }) => {
        posts[postIndex] = data.data;
        setPosts([...posts]);
      })
      .catch((err) => console.log(err))
      .finally(() => {});
  };

  const handleLikePost = (payload) => {
    axiosClient
      .patch(`/posts/${post.id}/like`, payload)
      .then(({ data }) => {
        posts[postIndex] = data.data;
        setPosts([...posts]);
      })
      .catch((err) => console.log(err))
      .finally(() => {});
  };

  return (
    <div className="social-post-card-wrapper">
      {/* When a user click I don't want to see this kind of post */}
      {/* <div className="hide-post">
        <div className="post-card-hidden">
          <div className="post-card-hidden__content">
            <header>
              <AiFillEyeInvisible className="icon" />
              <p className="post-card-hidden__title">
                This blog has been hidden
              </p>
              <p className="post-card-hidden__revocation">Undo</p>
            </header>
            <p className="post-card-hidden__desc">
              We'll recommend less of such content
            </p>
          </div>
        </div>
      </div> */}
      <div className="social-post-card">
        {/* Header */}
        <div className="social-post-card__header">
          <div className="social-post-card__userinfo">
            <div className="social-post-card__user">
              <Link
                to={`/profile/${post.poster.id}/public`}
                className="social-user-card__link"
              >
                <div className="social-user-card__avatar">
                  <img
                    className="social-avatar__img"
                    src={post.poster.profile.avatar}
                    alt="avatar"
                  />
                </div>
              </Link>
              <div className="social-user-card__info">
                <div className="social-user-card__name">
                  <Link
                    to={`/profile/${post.poster.id}/public`}
                    className="social-account-title"
                  >
                    <span className="social-account-title__name">
                      {post.poster.profile.name}
                    </span>
                    <span className="social-account-title__cert">
                      <img
                        className="mark-icon"
                        alt="cert_icon"
                        src={images.certificate_icon}
                      />
                    </span>
                  </Link>
                </div>
                <p className="social-post-card__info">
                  {dayjs(post.created_at).fromNow()}
                </p>
              </div>
              <div className="social-user-card__follow">
                <div className="social-follow-button">
                  <span>Follow</span>
                </div>
              </div>
            </div>
          </div>
          <div className="social-post-card__actions">
            <div className="action">
              <Popover
                rootClassName="custom-popover"
                trigger={'click'}
                placement="bottomRight"
                open={popoverOpen}
                onOpenChange={() => setPopoverOpen(!popoverOpen)}
                content={
                  <PostActions post={post} setPopoverOpen={setPopoverOpen} />
                }
              >
                <div className="action-button" role="button">
                  <BsThreeDotsVertical className="icon" />
                </div>
              </Popover>
            </div>
          </div>
        </div>
        {/* Content */}
        <Link
          className="social-post-card__link"
          to={`/blogs/${post.id}`}
          rel="noopener noreferrer"
        >
          <h3 className="social-post-card__title">
            <div className="social-post-card__type"></div>
            <span className="social-post-card__text">{post.title}</span>
          </h3>
          <div className="social-post-card__content">
            <TiptapContent content={post.content_json} />
          </div>
        </Link>
        {/* Tags */}
        <div className="social-post-card__footer">
          <div className="social-post-card__data">
            <div className="social-post-card__data-item">
              <AiOutlineEye className="icon" />
              <span>15k</span>
            </div>
            <div className="social-post-card__data-item">
              <div className="post-interact">
                <Link
                  to={`/post/${post.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-router-link"
                >
                  <AiOutlineComment className="icon" />
                  <span>15k</span>
                </Link>
              </div>
            </div>
            <div className="social-post-card__data-item">
              <div
                className="post-interact"
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
            <div className="social-post-card__data-item">
              <div
                className="post-interact"
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
            <div className="social-post-card__data-item">
              <div className="post-interact">
                <AiOutlineShareAlt className="icon" />
                <span>15</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialPostCard;
