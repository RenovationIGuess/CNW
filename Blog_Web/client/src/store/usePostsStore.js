import { create } from 'zustand';
import axiosClient from '~/axios';

const usePostsStore = create((set, get) => ({
  posts: [],
  setPosts: (posts) => set({ posts }),

  fetchingPosts: false,
  setFetchingPosts: (fetchingPosts) => set({ fetchingPosts }),

  newPostErrors: [],
  setNewPostErrors: (newPostErrors) => set({ newPostErrors }),

  fetchPosts: () => {
    set({ fetchingPosts: true });
    axiosClient
      .get(`/posts`)
      .then(({ data }) => {
        set({ posts: data.data });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        set({ fetchingPosts: false });
      });
  },
}));

export default usePostsStore;
