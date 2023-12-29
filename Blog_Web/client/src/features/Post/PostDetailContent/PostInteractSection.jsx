// Interact here means: comment and liking :D
import React, { useState } from 'react';
import TiptapComment from '~/components/Tiptap/TiptapComment';
import PostComments from '../PostComments/PostComments';
import axiosClient from '~/axios';
import { userStateContext } from '~/contexts/ContextProvider';
import useModalStore from '~/store/useModalStore';

const PostInteractSection = ({
  postId,
  posterId,
  comments,
  setComments,
  commentInputOpen,
  setCommentInputOpen,
  fetchCommentsLoading,
}) => {
  const { currentUser } = userStateContext();

  const [setActionToast] = useModalStore((state) => [state.setActionToast]);

  const [sendCommentLoading, setSendCommentLoading] = useState(false);
  const [inputContent, setInputContent] = useState({
    content_json: '',
    content_html: '',
    reply_to: null,
  });

  const handleSendComment = () => {
    const payload = {
      post_id: postId,
      user_id: currentUser.id,
      post_comment_id: null,
      reply_to: null,
      content_json: inputContent.content_json,
      content_html: inputContent.content_html,
      pinned: false,
    };
    setSendCommentLoading(true);
    axiosClient
      .post(`/posts/${postId}/comments`, payload)
      .then(({ data }) => {
        setComments([data.data, ...comments]);

        setInputContent({
          content_html: '',
          content_json: '',
          reply_to: null,
        });

        setCommentInputOpen([
          {
            comment_id: data.data.id,
            state: false,
          },
          ...commentInputOpen,
        ]);

        setActionToast({
          status: true,
          message: data.message,
        });
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setSendCommentLoading(false);
      });
  };

  return (
    <div className="post-page-reply">
      <div className="post-page-reply-action">
        <TiptapComment
          comment={inputContent}
          setComment={setInputContent}
          sendCommentLoading={sendCommentLoading}
          handleSendComment={handleSendComment}
        />
      </div>
      <PostComments
        postId={postId}
        posterId={posterId}
        comments={comments}
        setComments={setComments}
        inputContent={inputContent}
        setInputContent={setInputContent}
        commentInputOpen={commentInputOpen}
        setCommentInputOpen={setCommentInputOpen}
        fetchCommentsLoading={fetchCommentsLoading}
      />
      <div className="note-comment__bottom">
        <span>This is the end ~</span>
      </div>
    </div>
  );
};

export default PostInteractSection;
