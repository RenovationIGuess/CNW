import React, { useEffect } from 'react';
import SocialPageHeader from '~/features/components/SocialPageHeader/SocialPageHeader';
import './styles/Post.scss';
import PostDetailHeader from '~/features/Post/PostDetailHeader';
import { useParams } from 'react-router-dom';
import usePostStore from '~/store/usePostStore';
import PostDetailSection from '~/features/Post/PostDetailContent/PostDetailSection';
import PostComments from '~/features/Post/PostComments/PostComments';
import TiptapComment from '~/components/Tiptap/TiptapComment';
import { objUtils } from '~/utils';
import NotFound from '~/features/components/NotFound';

const Post = () => {
  const { id } = useParams();

  // Variable that store the fetched data aka post
  const [post] = usePostStore((state) => [state.post]);
  const [fetchPost, fetchingPost] = usePostStore((state) => [
    state.fetchPost,
    state.fetchingPost,
  ]);

  const [fetchPostComments, fetchingComments] = usePostStore((state) => [
    state.fetchPostComments,
    state.fetchingComments,
  ]);

  useEffect(() => {
    fetchPost(id);
  }, [id]);

  useEffect(() => {
    fetchPostComments(id);
  }, [id]);

  useEffect(() => {
    if (fetchingPost) document.title = 'Loading...';
    else if (Object.keys(post).length !== 0)
      document.title = `${post.title}: NFC Social`;
    else document.title = 'Post Not Found!';
  }, [fetchingPost]);

  if (!fetchingPost && objUtils.isEmptyObject(post)) {
    return (
      <NotFound
        message={
          'Unable to locate a post with this ID. It may have been deleted or never existed. >_<'
        }
      />
    );
  }

  if (fetchingPost) {
    return <>Loading...</>;
  }

  return (
    <div className="flex flex-1 flex-col relative">
      <SocialPageHeader />
      <div className="root-page-container social-root-page-container">
        <div className="root-page-container__content">
          <div className="root-page-container__left root-page-container__left--bg overflow-visible">
            <div className="post-main-page">
              <div className="post-layout__main">
                <PostDetailHeader />
                <div className="post-skeleton">
                  <div>
                    <div className="post-page__body">
                      <PostDetailSection />
                      <div className="post-page-reply">
                        <div className="post-page-reply-action">
                          <TiptapComment />
                        </div>
                        <PostComments />
                        <div className="note-comment__bottom">
                          <span>This is the end ~</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
