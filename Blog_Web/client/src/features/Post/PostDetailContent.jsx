import React from 'react';
import PostDetailSection from './PostDetailContent/PostDetailSection';
import PostInteractSection from './PostDetailContent/PostInteractSection';

const PostDetailContent = ({
  post,
  setPost,
  comments,
  setComments,
  commentInputOpen,
  setCommentInputOpen,
  fetchPostLoading,
}) => {
  return (
    <div className="post-skeleton">
      <div>
        <div className="post-page__body">
          <PostDetailSection />
          <PostInteractSection
            postId={post.id}
            posterId={post.poster.id}
            comments={comments}
            setComments={setComments}
            commentInputOpen={commentInputOpen}
            setCommentInputOpen={setCommentInputOpen}
            fetchCommentsLoading={fetchPostLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default PostDetailContent;
