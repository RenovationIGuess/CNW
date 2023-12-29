import React, { useState } from 'react';
import useNotesStore from '~/store/useNotesStore';
import { userStateContext } from '~/contexts/ContextProvider';
import axiosClient from '~/axios';
import TiptapComment from '~/components/Tiptap/TiptapComment';
import NoteComments from '../../components/NoteComments/NoteComments';
import useModalStore from '~/store/useModalStore';

const NoteCommentsSidebar = ({}) => {
  const { currentUser } = userStateContext();

  const [setActionToast] = useModalStore((state) => [state.setActionToast]);

  const [
    currentNote,
    currentNoteComments,
    setCurrentNoteComments,
    fetchCurrentNoteCommentsLoading,
    commentReplyBoxOpen,
    setCommentReplyBoxOpen,
  ] = useNotesStore((state) => [
    state.currentNote,
    state.currentNoteComments,
    state.setCurrentNoteComments,
    state.fetchCurrentNoteCommentsLoading,
    state.commentReplyBoxOpen,
    state.setCommentReplyBoxOpen,
  ]);

  const [commentInfo, setCommentInfo] = useState({
    note_id: null,
    user_id: currentUser.id,
    content_json: '',
    content_html: '',
    selected_text: '',
    pinned: false,
  });
  const [sendCommentLoading, setSendCommentLoading] = useState(false);

  const handleSendComment = () => {
    const payload = {
      ...commentInfo,
      note_id: currentNote.id,
      user_id: currentUser.id,
    };
    setSendCommentLoading(true);
    axiosClient
      .post(`/notes/${currentNote.id}/comments`, payload)
      .then(({ data }) => {
        setCurrentNoteComments([data.data, ...currentNoteComments]);

        setCommentInfo({
          note_id: currentNote.id,
          user_id: currentUser.id,
          content_json: '',
          content_html: '',
          selected_text: '',
          pinned: false,
        });

        setCommentReplyBoxOpen([
          {
            comment_id: data.data.id,
            state: false,
            replies: [],
          },
          ...commentReplyBoxOpen,
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
    <>
      <div className="note-comment__create--section">
        <TiptapComment
          sendCommentLoading={sendCommentLoading}
          comment={commentInfo}
          setComment={setCommentInfo}
          handleSendComment={handleSendComment}
        />
      </div>
      <NoteComments
        comments={currentNoteComments}
        setComments={setCurrentNoteComments}
        note={currentNote}
        setCommentReplyBoxOpen={setCommentReplyBoxOpen}
        commentReplyBoxOpen={commentReplyBoxOpen}
        fetchCommentsLoading={fetchCurrentNoteCommentsLoading}
        sidebar={true}
      />
      <div className="note-comment__bottom">
        <span>This is the end ~</span>
      </div>
    </>
  );
};

export default NoteCommentsSidebar;
