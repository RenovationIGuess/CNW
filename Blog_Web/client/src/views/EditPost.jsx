import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import axiosClient from '~/axios';
import HoyoButton from '~/components/HoyoButton/HoyoButton';
import NewPostEditor from '~/features/NewPost/NewPostEditor';
import NotFound from '~/features/components/NotFound';
import '~/features/components/SocialPageContainer/SocialPageContainer.scss';
import SocialPageHeader from '~/features/components/SocialPageHeader/SocialPageHeader';
import { objUtils } from '~/utils';

const defaultPost = {
  title: '',
  post_type: '',
  banner: '',
  content_json: '',
  content_html: '',
};

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // const [searchValue, setSearchValue] = useState('');
  const [post, setPost] = useState(defaultPost);
  const [fetchingPost, setFetchingPost] = useState(true);

  // Loading when click upload button
  const [editPostLoading, setEditPostLoading] = useState(false);

  // Action toast state manage
  const [errors, setErrors] = useState({});

  useEffect(() => {
    document.title = 'Edit Post | NFC Social';
  }, []);

  useEffect(() => {
    if (id) {
      setFetchingPost(true);
      axiosClient
        .get(`/posts/${id}`)
        .then(({ data }) => {
          setPost(data.data);
        })
        .catch((err) => {
          console.log(err);
          toast.error('Server Error!', {
            position: 'top-right',
            duration: 3000,
          });
        })
        .finally(() => setFetchingPost(false));
    }
  }, [id]);

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

  const handleEditPost = () => {
    setEditPostLoading(true);
    axiosClient
      .patch(`/posts/${id}`, post)
      .then(({ data }) => {
        navigate(`/blogs/${data.data.id}`);
      })
      .catch((err) => {
        if (err.response && err.response.status === 422) {
          const responseErrors = err.response.data.errors;
          const errorsObj = {
            title: [],
            content: [],
            state: false, // This will tell us do we have errors or not
          };
          for (const key of Object.keys(responseErrors)) {
            if (key === 'title') {
              errorsObj.title = responseErrors[key];
              errorsObj.state = true;
            }
            if (key.includes('content') && errorsObj.content.length === 0) {
              errorsObj.content = responseErrors[key];
              errorsObj.state = true;
            }
          }
          setErrors(errorsObj);

          toast.error('Please resolve all required fields.', {
            position: 'bottom-center',
            duration: 3000,
          });
        }

        console.log(err);
      })
      .finally(() => setEditPostLoading(false));
  };

  return (
    <div className="flex flex-1 flex-col relative" data-route-name="newPost">
      <SocialPageHeader />
      {/* <SocialPageContainer /> */}
      <div className="root-page-container social-root-page-container">
        <div className="root-page-container__content">
          <div className="root-page-container__side"></div>
          <div className="root-page-container__left root-page-container__left--bg">
            <div className="social-main-page">
              <div className="social-new-post">
                <div className="social-new-richtext-post">
                  <div className="social-new-post__header">
                    <h1>Blog</h1>
                    <div></div>
                  </div>
                  <NewPostEditor
                    post={post}
                    setPost={setPost}
                    errors={errors}
                  />
                </div>
                <div className="social-new-post__footer">
                  <HoyoButton
                    description="Preview"
                    style={{ width: 250, marginTop: 0, fontWeight: 500 }}
                  />
                  <HoyoButton
                    handleFunc={handleEditPost}
                    description="Update"
                    style={{ width: 250, marginTop: 0, fontWeight: 500 }}
                    loading={editPostLoading}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
