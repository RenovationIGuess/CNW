import React, { useEffect } from 'react';
import SocialPageContainer from '~/features/components/SocialPageContainer/SocialPageContainer';
import SocialPageHeader from '~/features/components/SocialPageHeader/SocialPageHeader';
import usePostsStore from '~/store/usePostsStore';
import './styles/Dashboard.scss';
import './styles/UserInfoEditModal.scss';

const Posts = () => {
  // const [searchValue, setSearchValue] = useState('');
  const [fetchingPosts] = usePostsStore((state) => [state.fetchingPosts]);

  useEffect(() => {
    if (fetchingPosts) document.title = 'Loading...';
    else document.title = 'Home | NFC Social';
  }, [fetchingPosts]);

  return (
    <div className="flex flex-1 flex-col relative">
      <SocialPageHeader
      // searchValue={searchValue}
      // setSearchValue={setSearchValue}
      />
      <SocialPageContainer />
    </div>
  );
};

export default Posts;
