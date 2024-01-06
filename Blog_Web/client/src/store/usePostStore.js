import { toast } from 'sonner';
import { create } from 'zustand';
import axiosClient from '~/axios';

import useModalStore from './useModalStore';
import { objUtils } from '~/utils';

const usePostStore = create((set, get) => ({
  post: {},
  setPost: (post) => set({ post }),

  comments: [],
  setComments: (comments) => set({ comments }),

  commentInputOpen: [],
  setCommentInputOpen: (commentInputOpen) => set({ commentInputOpen }),

  allRepliesShown: false,
  setAllRepliesShown: (allRepliesShown) => set({ allRepliesShown }),

  /*
    format: {
      comment: {},
      commentIndex: number,
      cioIndex: number,
      commentorId: number,
    }
  */
  selectedComment: {},
  setSelectedComment: (selectedComment) => set({ selectedComment }),

  replyToId: null,
  setReplyToId: (replyToId) => set({ replyToId }),

  openCommentInput: (commentIndex) => {
    const commentInputOpen = get().commentInputOpen;
    set({
      commentInputOpen: commentInputOpen.map((c, ind) => {
        if (ind === commentIndex)
          return {
            ...c,
            state: !c.state,
            edit_state: false,
          };
        return {
          ...c,
          state: false,
          edit_state: false,
        };
      }),
    });
  },

  // Because this will be used for both comment and reply
  toggleEditComment: (index) => {
    const commentInputOpen = get().commentInputOpen;
    set({
      commentInputOpen: commentInputOpen.map((c, ind) => {
        if (ind === index)
          return {
            ...c,
            edit_state: !c.edit_state,
            state: false,
          };
        return {
          ...c,
          edit_state: false,
          state: false,
        };
      }),
    });
  },

  fetchingComments: true,
  setFetchingComments: (fetchingComments) => set({ fetchingComments }),

  fetchingPost: true,
  setFetchingPost: (fetchingPost) => set({ fetchingPost }),

  newPostErrors: [],
  setNewPostErrors: (newPostErrors) => set({ newPostErrors }),

  fetchPost: (id) => {
    set({ fetchingPost: true });
    axiosClient
      .get(`/posts/${id}`)
      .then(({ data }) => {
        set({ post: data.data });
      })
      .catch((err) => {
        console.log(err);
        toast.error('Server Error!', {
          position: 'top-right',
          duration: 3000,
        });
      })
      .finally(() => {
        set({ fetchingPost: false });
      });
  },

  starPost: (payload) => {
    const post = get().post;
    axiosClient
      .patch(`/posts/${post.id}/star`, payload)
      .then(({ data }) => {
        set({ post: data.data });
      })
      .catch((err) => {
        console.log(err);
        toast.error('Server Error!', {
          position: 'top-right',
          duration: 3000,
        });
      })
      .finally(() => {});
  },

  likePost: (payload) => {
    const post = get().post;
    axiosClient
      .patch(`/posts/${post.id}/like`, payload)
      .then(({ data }) => {
        set({ post: data.data });
      })
      .catch((err) => {
        console.log(err);
        toast.error('Server Error!', {
          position: 'top-right',
          duration: 3000,
        });
      })
      .finally(() => {});
  },

  fetchPostComments: (id) => {
    set({ fetchingComments: true });
    axiosClient
      .get(`/posts/${id}/comments`)
      .then(({ data }) => {
        const comments = data.data;
        set({ comments: comments });

        const commentInputOpen = [];
        for (const comment of comments) {
          commentInputOpen.push({
            comment_id: comment.id,
            edit_state: false,
            state: false,
          });

          for (const reply of comment.replies) {
            commentInputOpen.push({
              comment_id: reply.id,
              edit_state: false,
              state: false,
            });
          }
        }

        set({ commentInputOpen: commentInputOpen });
      })
      .catch((err) => {
        console.log(err);
        toast.error('Server Error!', {
          position: 'top-right',
          duration: 3000,
        });
      })
      .finally(() => {
        set({ fetchingComments: false });
      });
  },

  sendCommentLoading: false,
  setSendCommentLoading: (sendCommentLoading) => set({ sendCommentLoading }),

  sendComment: (payload) => {
    const post = get().post;
    const comments = get().comments;
    const commentInputOpen = get().commentInputOpen;
    const { setActionToast } = useModalStore.getState();

    set({ sendCommentLoading: true });
    axiosClient
      .post(`/posts/${post.id}/comments`, payload)
      .then(({ data }) => {
        const newComment = data.data;
        set({ comments: [newComment, ...comments] });

        set({
          commentInputOpen: [
            {
              comment_id: newComment.id,
              edit_state: false,
              state: false,
            },
            ...commentInputOpen,
          ],
        });

        setActionToast({
          status: true,
          message: data.message,
        });
      })
      .catch((err) => {
        console.log(err);
        toast.error('Server Error!', {
          position: 'bottom-center',
          duration: 3000,
        });
      })
      .finally(() => {
        set({ sendCommentLoading: false });
      });
  },

  editCommentLoading: false,
  setEditCommentLoading: (editCommentLoading) => set({ editCommentLoading }),

  editComment: (commentId, payload) => {
    const post = get().post;
    const comments = get().comments;
    const commentInputOpen = get().commentInputOpen;
    const selectedComment = get().selectedComment;
    const { setActionToast } = useModalStore.getState();

    set({ editCommentLoading: true });
    axiosClient
      .patch(`/posts/${post.id}/comments/${commentId}`, payload)
      .then(({ data }) => {
        const updatedComment = data.data;

        // Update the selected comment (if exist)
        if (
          !objUtils.isEmptyObject(selectedComment) &&
          selectedComment.comment.id === updatedComment.id
        ) {
          set({
            selectedComment: {
              ...selectedComment,
              comment: updatedComment,
            },
          });
        }

        // Update the comments array
        set({
          comments: comments.map((c) =>
            c.id === updatedComment.id ? updatedComment : c
          ),
        });

        // Turn off the edit state
        set({
          commentInputOpen: commentInputOpen.map((c) => ({
            ...c,
            edit_state: false,
          })),
        });

        setActionToast({
          status: true,
          message: data.message,
        });
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.response.data.message, {
          position: 'bottom-center',
          duration: 3000,
        });
      })
      .finally(() => {
        set({ editCommentLoading: false });
      });
  },

  sendReplyLoading: false,
  setSendReplyLoading: (sendReplyLoading) => set({ sendReplyLoading }),

  sendReply: (payload, commentIndex, crboIndex) => {
    const post = get().post;
    const comments = get().comments;
    const commentInputOpen = get().commentInputOpen;
    const { setActionToast } = useModalStore.getState();

    set({ sendReplyLoading: true });
    axiosClient
      .post(`/posts/${post.id}/comments`, payload)
      .then(({ data }) => {
        const newComment = data.data;
        comments[commentIndex].replies.unshift(newComment);
        // Update comments
        set({ comments: [...comments] });

        // Close the input box
        commentInputOpen[crboIndex].state = false;
        // Because newest reply will be on top => add new item
        // right after the index of the comment
        commentInputOpen.splice(crboIndex + 1, 0, {
          comment_id: newComment.id,
          edit_state: false,
          state: false,
        });
        set({ commentInputOpen: [...commentInputOpen] });

        // Notify user
        setActionToast({
          status: true,
          message: data.message,
        });
      })
      .catch((err) => {
        console.log(err);
        toast.error('Server Error!', {
          position: 'bottom-center',
          duration: 3000,
        });
      })
      .finally(() => set({ sendReplyLoading: false }));
  },

  editReplyLoading: false,
  setEditReplyLoading: (editReplyLoading) => set({ editReplyLoading }),

  // Basically reply is comment, but its in a comment :))
  editReply: (replyId, commentIndex, payload) => {
    const post = get().post;
    const comments = get().comments;
    const commentInputOpen = get().commentInputOpen;
    const selectedComment = get().selectedComment;
    const { setActionToast } = useModalStore.getState();

    set({ editReplyLoading: true });
    axiosClient
      .patch(`/posts/${post.id}/comments/${replyId}`, payload)
      .then(({ data }) => {
        const newReply = data.data;

        const replies = comments[commentIndex].replies;
        comments[commentIndex].replies = replies.map((r) => {
          if (r.id === newReply.id) return newReply;
          return r;
        });

        if (
          !objUtils.isEmptyObject(selectedComment) &&
          selectedComment.comment.id === comments[commentIndex].id
        ) {
          set({
            selectedComment: {
              ...selectedComment,
              comment: comments[commentIndex],
            },
          });
        }

        // Update comments
        set({ comments: [...comments] });

        // Close the input box
        set({
          commentInputOpen: commentInputOpen.map((c) => ({
            ...c,
            edit_state: false,
          })),
        });

        // Notify user
        setActionToast({
          status: true,
          message: data.message,
        });
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message, {
          position: 'bottom-center',
          duration: 3000,
        });
      })
      .finally(() => set({ editReplyLoading: false }));
  },
}));

export default usePostStore;
