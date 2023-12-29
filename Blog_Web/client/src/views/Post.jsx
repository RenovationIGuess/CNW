import React, { useEffect, useState } from 'react';
import SocialPageHeader from '~/features/components/SocialPageHeader/SocialPageHeader';
import './styles/Post.scss';
import PostDetailHeader from '~/features/Post/PostDetailHeader';
import PostDetailContent from '~/features/Post/PostDetailContent';
import { useParams } from 'react-router-dom';
import axiosClient from '~/axios';

const Post = () => {
  const { id } = useParams();

  // const [searchValue, setSearchValue] = useState('');
  // Variable that store the fetched data aka post
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [fetchPostLoading, setFetchPostLoading] = useState(true);
  const [commentInputOpen, setCommentInputOpen] = useState([]);

  useEffect(() => {
    setFetchPostLoading(true);
    axiosClient
      .get(`/posts/${id}`)
      .then(({ data }) => {
        setPost(data.data);

        axiosClient
          .get(`/posts/${id}/comments`)
          .then(({ data }) => {
            setComments(data.data);

            for (const comment of data.data) {
              commentInputOpen.push({
                comment_id: comment.id,
                state: false,
              });

              for (const reply of comment.replies) {
                commentInputOpen.push({
                  comment_id: reply.id,
                  state: false,
                });
              }
            }

            setCommentInputOpen([...commentInputOpen]);
          })
          .catch((err) => console.log(err))
          .finally(() => setFetchPostLoading(false));
      })
      .catch((err) => console.log(err));
  }, [id]);

  useEffect(() => {
    if (fetchPostLoading) document.title = 'Loading...';
    else if (Object.keys(post).length !== 0)
      document.title = `${post.title}: Ramu Blog Web`;
    else document.title = 'Blog Not Found!';
  }, [fetchPostLoading]);

  return (
    <div className="flex flex-1 flex-col relative">
      <SocialPageHeader />
      <div className="root-page-container social-root-page-container">
        <div className="root-page-container__content">
          <div className="root-page-container__left root-page-container__left--bg overflow-visible">
            <div className="post-main-page">
              <div className="post-layout__main">
                {!fetchPostLoading && (
                  <>
                    <PostDetailHeader post={post} />
                    <PostDetailContent
                      post={post}
                      setPost={setPost}
                      comments={comments}
                      setComments={setComments}
                      commentInputOpen={commentInputOpen}
                      setCommentInputOpen={setCommentInputOpen}
                      fetchPostLoading={fetchPostLoading}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
