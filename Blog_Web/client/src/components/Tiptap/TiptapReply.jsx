import { BubbleMenu, useEditor, EditorContent } from '@tiptap/react';
import './Tiptap.scss';
import CustomBubbleMenu from './BubbleMenu/CustomBubbleMenu';
import { useEffect, useState } from 'react';
import { handlePaste } from './utils/handlePaste';
import { handleDrop } from './utils/handleDrop';
import LinkBubbleMenu from './BubbleMenu/LinkBubbleMenu';
import extensions from './extensions/tiptapExtension';
import TableBubbleMenu from './BubbleMenu/TableBubbleMenu';
import { userStateContext } from '~/contexts/ContextProvider';
import usePostStore from '~/store/usePostStore';
import { cn, stringUtils } from '~/utils';
import TiptapCommentFooter from './TiptapCommentFooter';

const TiptapReply = ({ initContent, commentId, commentIndex, crboIndex }) => {
  const { currentUser } = userStateContext();

  const [post] = usePostStore((state) => [state.post]);
  const [sendReply, sendReplyLoading] = usePostStore((state) => [
    state.sendReply,
    state.sendReplyLoading,
  ]);
  const [commentInputOpen] = usePostStore((state) => [state.commentInputOpen]);
  const [toggleEditComment, editReply, editReplyLoading] = usePostStore(
    (state) => [
      state.toggleEditComment,
      state.editReply,
      state.editReplyLoading,
    ]
  );
  const [replyToId] = usePostStore((state) => [state.replyToId]);

  const [linkContent, setLinkContent] = useState('');
  const [linkNodePos, setLinkNodePos] = useState({});

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
    } else {
      editor.commands.setContent(initContent);
    }
  }, [sendReplyLoading, initContent]);

  return (
    <>
      <div className="comment-container mt-3">
        {/* <MenuBar editor={editor} /> */}
        {editor && (
          <BubbleMenu
            editor={editor}
            shouldShow={({ editor, from, to }) => {
              return (
                from !== to &&
                !editor.isActive('link') &&
                !editor.isActive('image') &&
                !editor.isActive('youtubeEmbed')
              );
            }}
            tippyOptions={{ duration: 100 }}
          >
            <CustomBubbleMenu editor={editor} />
          </BubbleMenu>
        )}
        {editor && (
          <BubbleMenu
            editor={editor}
            shouldShow={({ editor, state, from }) => {
              if (editor.isActive('link')) {
                const { doc } = state;
                // const linkNode = doc.nodeAt(from);
                const resolvedPos = doc.resolve(from);
                const linkNode = resolvedPos.nodeAfter;

                if (linkNode) {
                  const linkContent = linkNode.textContent;
                  setLinkContent(linkContent);

                  const linkFrom = resolvedPos.pos;
                  const linkTo = resolvedPos.pos + linkNode.nodeSize;
                  setLinkNodePos({ from: linkFrom, to: linkTo });

                  return true;
                }
              }
              return false;
            }}
            tippyOptions={{ duration: 100 }}
          >
            <LinkBubbleMenu
              editor={editor}
              url={editor.getAttributes('link').href}
              label={linkContent}
              linkNodePos={linkNodePos}
            />
          </BubbleMenu>
        )}
        {editor && (
          <BubbleMenu
            editor={editor}
            shouldShow={({ editor }) => {
              return editor.isActive('table');
            }}
            tippyOptions={{ duration: 100 }}
          >
            <TableBubbleMenu editor={editor} />
          </BubbleMenu>
        )}
        <EditorContent className="comment-content" editor={editor} />
      </div>
      <div className="comment-footer">
        <div className="comment-footer__toolbar">
          <TiptapCommentFooter editor={editor} />
        </div>
        <div className="flex items-center">
          {crboIndex != null && commentInputOpen[crboIndex].edit_state && (
            <button
              onClick={() => toggleEditComment(crboIndex)}
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
                if (
                  crboIndex != null &&
                  commentInputOpen[crboIndex].edit_state
                ) {
                  editReply(
                    commentInputOpen[crboIndex].comment_id,
                    commentIndex,
                    {
                      content_json: JSON.stringify(editor.getJSON()),
                      content_html: editor.getHTML(),
                    }
                  );
                } else {
                  sendReply(
                    {
                      post_id: post.id,
                      user_id: currentUser.id,
                      post_comment_id: commentId,
                      content_json: JSON.stringify(editor.getJSON()),
                      content_html: editor.getHTML(),
                      reply_to: replyToId,
                      pinned: false,
                    },
                    commentIndex,
                    crboIndex
                  );
                }
              }
            }}
          >
            {sendReplyLoading ||
              (initContent != null && editReplyLoading && (
                <span className="my-loader sm-send-comment__loader"></span>
              ))}
            <span>
              {sendReplyLoading || (initContent != null && editReplyLoading)
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

export default TiptapReply;
