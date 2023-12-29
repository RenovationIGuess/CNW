import React, { useState } from 'react';
import NewPostTiptap from '~/components/Tiptap/NewPostTiptap/NewPostTiptap';
import useComponentVisible from '~/hooks/useComponentVisible';
import './NewPostEditor.scss';
import CopyrightSection from './CopyrightSection';
import AttachBanner from './AttachBanner';
import AttachModels from './AttachModels';
import { cn } from '~/utils';

const NewPostEditor = ({ post, setPost, errors }) => {
  const [titleInputRef, isTitleInputFocused, setTitleInputFocused] =
    useComponentVisible(false);

  return (
    <div className="social-new-post__editor">
      <AttachBanner post={post} setPost={setPost} />
      <div className="form-item-container">
        <span className="form-item-container__label">Title</span>
        <div className="social-input-title-text">
          <div
            onClick={() => setTitleInputFocused(true)}
            ref={titleInputRef}
            className={cn(
              'social-input-container',
              isTitleInputFocused && 'social-input-container--active',
              errors.state &&
                post.title.length === 0 &&
                errors.title.length !== 0 &&
                'social-input-container--error'
            )}
          >
            <input
              type="text"
              maxLength="200"
              placeholder="Please enter title (required)"
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
            />
            <span className="count-tip">{post.title.length}/200</span>
          </div>
        </div>
        {errors.state &&
          post.title.length === 0 &&
          errors?.title &&
          errors.title.map((error, index) => (
            <p key={index} className="error-text font-normal">
              {error}
            </p>
          ))}
      </div>
      <div className="form-item-container">
        <span className="form-item-container__label">Content</span>
        <NewPostTiptap
          post={post}
          setPost={setPost}
          error={
            errors.state &&
            (post.content_html === '' || post.content_html === '<p></p>') &&
            errors?.content
          }
        />
        {errors.state &&
          (post.content_html === '' || post.content_html === '<p></p>') &&
          errors?.content &&
          errors.content.map((error, index) => (
            <p key={index} className="error-text font-normal">
              {error}
            </p>
          ))}
      </div>
      <AttachModels />
      <CopyrightSection />
    </div>
  );
};

export default NewPostEditor;
