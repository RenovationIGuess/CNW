import { BubbleMenu, useEditor, EditorContent } from '@tiptap/react';
import './Tiptap.scss';
import CustomBubbleMenu from './BubbleMenu/CustomBubbleMenu';
import { useEffect, useState } from 'react';
import { BsEmojiSmile, BsFillImageFill } from 'react-icons/bs';
import { MdOutlineAlternateEmail } from 'react-icons/md';
import { AiOutlineLink } from 'react-icons/ai';
import { Tooltip } from 'antd';
import { handlePaste } from './utils/handlePaste';
import { handleDrop } from './utils/handleDrop';
import LinkBubbleMenu from './BubbleMenu/LinkBubbleMenu';
import extensions from './extensions/tiptapExtension';
import TableBubbleMenu from './BubbleMenu/TableBubbleMenu';
import { cn } from '~/utils';

const TiptapReply = ({
  sendReplyLoading,
  reply,
  crboIndex,
  setReply,
  handleSendReply,
  replyInputOpen,
  editState = false,
  setEditState = () => {},
}) => {
  const [linkContent, setLinkContent] = useState(false);
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
      onUpdate({ editor }) {
        setReply({
          ...reply,
          content_json: JSON.stringify(editor.getJSON()),
          content_html: editor.getHTML(),
        });
      },
      content: reply.content_html,
    },
    []
  );

  useEffect(() => {
    if (!editor) return;
    editor.commands.setContent('');
  }, [sendReplyLoading, replyInputOpen]);

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
      <div className={cn('comment-footer', editState && 'mb-3')}>
        <div className="comment-footer__toolbar">
          <Tooltip placement="bottom" title="Add emojis">
            <BsEmojiSmile className="comment-tool__icon" />
          </Tooltip>
          <Tooltip placement="bottom" title="Add images">
            <BsFillImageFill className="comment-tool__icon" />
          </Tooltip>
          <Tooltip placement="bottom" title="Add links">
            <AiOutlineLink className="comment-tool__icon" />
          </Tooltip>
          <Tooltip placement="bottom" title="Add mentions">
            <MdOutlineAlternateEmail className="comment-tool__icon" />
          </Tooltip>
        </div>
        <div className="flex items-center">
          {editState && (
            <button
              onClick={() => setEditState(false)}
              className="account-edit-btn account-edit-cancel-btn"
            >
              Cancel
            </button>
          )}
          <button
            className={`send-button${
              reply.content_html === '<p></p>' || reply.content_html === ''
                ? ' send-button__disabled'
                : ''
            }`}
            onClick={() =>
              reply.content_html === '<p></p>' || reply.content_html === ''
                ? {}
                : handleSendReply(crboIndex)
            }
          >
            {sendReplyLoading && (
              <span className="my-loader sm-send-comment__loader"></span>
            )}
            <span>{sendReplyLoading ? 'Sending...' : 'Send'}</span>
          </button>
        </div>
      </div>
      {/* Mention suggestions */}
      {/* <div></div> */}
    </>
  );
};

export default TiptapReply;
