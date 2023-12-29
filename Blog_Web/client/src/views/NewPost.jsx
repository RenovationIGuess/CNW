import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '~/axios';
import HoyoButton from '~/components/HoyoButton/HoyoButton';
import NewPostEditor from '~/features/NewPost/NewPostEditor';
import '~/features/components/SocialPageContainer/SocialPageContainer.scss';
import SocialPageHeader from '~/features/components/SocialPageHeader/SocialPageHeader';

const NewPost = () => {
  const navigate = useNavigate();

  // const [searchValue, setSearchValue] = useState('');
  const [post, setPost] = useState({
    title: '',
    post_type: '',
    banner: '',
    content_json: '',
    content_html: '',
  });

  // Loading when click upload button
  const [uploadPostLoading, setUploadPostLoading] = useState(false);

  // Action toast state manage
  const [errors, setErrors] = useState({});

  useEffect(() => {
    document.title = 'New Post';
  }, []);

  const handleUploadPost = () => {
    setUploadPostLoading(true);
    axiosClient
      .post('/posts', post)
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
        }

        console.log(err);
      })
      .finally(() => setUploadPostLoading(false));
  };

  return (
    <div className="flex flex-1 flex-col relative" data-route-name="newPost">
      <SocialPageHeader
      // searchValue={searchValue}
      // setSearchValue={setSearchValue}
      />
      {/* <SocialPageContainer /> */}
      <div className="root-page-container social-root-page-container">
        <div className="root-page-container__content">
          <div className="root-page-container__side"></div>
          <div className="root-page-container__left root-page-container__left--bg">
            <div className="social-main-page">
              <div className="social-new-post">
                <div className="social-new-richtext-post">
                  <div className="social-new-post__header">
                    <h1>Post</h1>
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
                    handleFunc={handleUploadPost}
                    description="Publish"
                    style={{ width: 250, marginTop: 0, fontWeight: 500 }}
                    loading={uploadPostLoading}
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

export default NewPost;
