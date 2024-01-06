import { BubbleMenu, useEditor, EditorContent } from '@tiptap/react';
import './Tiptap.scss';
import CustomBubbleMenu from './BubbleMenu/CustomBubbleMenu';
import { useEffect, useState } from 'react';
import { handlePaste } from './utils/handlePaste';
import { handleDrop } from './utils/handleDrop';
import LinkBubbleMenu from './BubbleMenu/LinkBubbleMenu';
import extensions from './extensions/tiptapExtension';
import TableBubbleMenu from './BubbleMenu/TableBubbleMenu';
import usePostStore from '~/store/usePostStore';
import { cn, stringUtils } from '~/utils';
import { userStateContext } from '~/contexts/ContextProvider';
import TiptapCommentFooter from './TiptapCommentFooter';

// The init content will HTML type
const TiptapComment = ({ initContent, cioIndex }) => {
  const { currentUser } = userStateContext();

  const [post] = usePostStore((state) => [state.post]);
  const [commentInputOpen] = usePostStore((state) => [state.commentInputOpen]);
  const [sendComment, sendCommentLoading] = usePostStore((state) => [
    state.sendComment,
    state.sendCommentLoading,
  ]);
  const [toggleEditComment, editComment, editCommentLoading] = usePostStore(
    (state) => [
      state.toggleEditComment,
      state.editComment,
      state.editCommentLoading,
    ]
  );

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
    } else editor.commands.setContent(initContent);
  }, [sendCommentLoading, initContent]);

  return (
    <>
      <div
        className={cn(
          'comment-container',
          cioIndex != null && commentInputOpen[cioIndex].edit_state && 'mt-3'
        )}
      >
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
                  editComment(commentInputOpen[cioIndex].comment_id, {
                    content_json: JSON.stringify(editor.getJSON()),
                    content_html: editor.getHTML(),
                  });
                } else {
                  sendComment({
                    post_id: post.id,
                    user_id: currentUser.id,
                    post_comment_id: null,
                    content_json: JSON.stringify(editor.getJSON()),
                    content_html: editor.getHTML(),
                    reply_to: null,
                    pinned: false,
                  });
                }
              }
            }}
          >
            {(sendCommentLoading ||
              (initContent != null && editCommentLoading)) && (
              <span className="my-loader sm-send-comment__loader"></span>
            )}
            <span>
              {sendCommentLoading || (initContent != null && editCommentLoading)
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

export default TiptapComment;
