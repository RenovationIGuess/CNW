import { useEditor, EditorContent } from '@tiptap/react';
import './Tiptap.scss';
import { useEffect } from 'react';
import { handlePaste } from './utils/handlePaste';
import { handleDrop } from './utils/handleDrop';
import extensions from './extensions/tiptapExtension';
import { cn, stringUtils } from '~/utils';
import { userStateContext } from '~/contexts/ContextProvider';
import TiptapCommentFooter from './TiptapCommentFooter';
import TiptapBubbleMenu from './BubbleMenu/TiptapBubbleMenu';
import useNotesStore from '~/store/useNotesStore';

// Component used for notes page
const TiptapNotesComment = ({
  initContent,
  commentId,
  commentIndex,
  cioIndex,
  type = 'comment',
}) => {
  const { currentUser } = userStateContext();

  const [currentNote] = useNotesStore((state) => [state.currentNote]);
  const [commentInputOpen] = useNotesStore((state) => [state.commentInputOpen]);
  const [sendComment, sendCommentLoading] = useNotesStore((state) => [
    state.sendComment,
    state.sendCommentLoading,
  ]);
  const [toggleEditComment, editComment, editCommentLoading] = useNotesStore(
    (state) => [
      state.toggleEditComment,
      state.editComment,
      state.editCommentLoading,
    ]
  );
  const [sendReply, sendReplyLoading] = useNotesStore((state) => [
    state.sendReply,
    state.sendReplyLoading,
  ]);
  const [editReply, editReplyLoading] = useNotesStore((state) => [
    state.editReply,
    state.editReplyLoading,
  ]);
  const [replyToId] = useNotesStore((state) => [state.replyToId]);

  const editor = useEditor(
    {
      extensions: extensions,
      editorProps: {
        attributes: {
          spellcheck: 'false',
        },
        editorProps: {
          handlePaste: handlePaste,
          handleDrop: handleDrop,
          transformPastedHTML(html) {
            return html.replace(
              /<img.*?src="(?<imgSrc>.*?)".*?>/g,
              function (match, imgSrc) {
                if (
                  imgSrc.startsWith('https://images.your-image-hosting.com')
                ) {
                  // your saved images
                  return match; // keep the img
                }
                return ''; // replace it
              }
            );
          },
        },
      },
      content: initContent,
    },
    []
  );

  useEffect(() => {
    if (!editor) return;
    if (stringUtils.isContentEmpty(initContent)) {
      editor.commands.setContent('');
    } else editor.commands.setContent(initContent);
  }, [sendCommentLoading, initContent]);

  return (
    <>
      <div
        className={cn(
          'comment-container mt-3',
          cioIndex != null && commentInputOpen[cioIndex].edit_state && 'mt-3'
        )}
      >
        <TiptapBubbleMenu editor={editor} />
        <EditorContent className="comment-content" editor={editor} />
      </div>
      <div className="comment-footer">
        <TiptapCommentFooter editor={editor} />
        <div className="flex items-center">
          {cioIndex != null && commentInputOpen[cioIndex].edit_state && (
            <button
              onClick={() => toggleEditComment(cioIndex)}
              className="account-edit-btn account-edit-cancel-btn"
            >
              Cancel
            </button>
          )}
          <button
            className={cn(
              'send-button',
              editor &&
                stringUtils.isContentEmpty(editor.getHTML(), 'html') &&
                'send-button__disabled'
            )}
            onClick={() => {
              if (
                editor &&
                !stringUtils.isContentEmpty(editor.getHTML(), 'html')
              ) {
                if (cioIndex != null && commentInputOpen[cioIndex].edit_state) {
                  if (type === 'comment') {
                    editComment(commentInputOpen[cioIndex].comment_id, {
                      content_json: JSON.stringify(editor.getJSON()),
                      content_html: editor.getHTML(),
                    });
                  } else {
                    editReply(
                      commentInputOpen[cioIndex].comment_id,
                      commentIndex,
                      {
                        content_json: JSON.stringify(editor.getJSON()),
                        content_html: editor.getHTML(),
                      }
                    );
                  }
                } else {
                  if (type === 'comment') {
                    sendComment({
                      note_id: currentNote.id,
                      user_id: currentUser.id,
                      note_comment_id: null,
                      content_json: JSON.stringify(editor.getJSON()),
                      content_html: editor.getHTML(),
                      reply_to: null,
                      selected_text: '',
                      pinned: false,
                    });
                  } else {
                    sendReply(
                      {
                        note_id: currentNote.id,
                        user_id: currentUser.id,
                        note_comment_id: commentId,
                        content_json: JSON.stringify(editor.getJSON()),
                        content_html: editor.getHTML(),
                        reply_to: replyToId,
                        selected_text: '',
                        pinned: false,
                      },
                      commentIndex,
                      cioIndex
                    );
                  }
                }
              }
            }}
          >
            {(sendCommentLoading ||
              (initContent != null && editCommentLoading) ||
              (type === 'reply' && sendReplyLoading) ||
              (initContent != null && editReplyLoading)) && (
              <span className="my-loader sm-send-comment__loader"></span>
            )}
            <span>
              {sendCommentLoading ||
              (initContent != null && editCommentLoading) ||
              (type === 'reply' && sendReplyLoading) ||
              (initContent != null && editReplyLoading)
                ? 'Sending...'
                : 'Send'}
            </span>
          </button>
        </div>
      </div>
      {/* Mention suggestions */}
      {/* <div></div> */}
    </>
  );
};

export default TiptapNotesComment;
