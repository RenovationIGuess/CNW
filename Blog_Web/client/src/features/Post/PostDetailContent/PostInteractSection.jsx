// Interact here means: comment and liking :D
import React from 'react';
import TiptapComment from '~/components/Tiptap/TiptapComment';
import PostComments from '../PostComments/PostComments';

const PostInteractSection = ({}) => {
  return (
    <div className="post-page-reply">
      <div className="post-page-reply-action">
        <TiptapComment />
      </div>
      <PostComments />
      <div className="note-comment__bottom">
        <span>This is the end ~</span>
      </div>
    </div>
  );
};

export default PostInteractSection;
