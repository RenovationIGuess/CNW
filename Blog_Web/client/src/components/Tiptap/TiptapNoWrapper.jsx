import { BubbleMenu, useEditor, EditorContent } from '@tiptap/react';

import './Tiptap.scss';

import CustomBubbleMenu from './BubbleMenu/CustomBubbleMenu';
import { handlePaste } from './utils/handlePaste';
import { handleDrop } from './utils/handleDrop';
import LinkBubbleMenu from './BubbleMenu/LinkBubbleMenu';
import extensions from './extensions/tiptapExtension';
import { useEffect, useState } from 'react';
import { tiptap } from '~/constants';
import TableBubbleMenu from './BubbleMenu/TableBubbleMenu';

const TiptapNoWrapper = ({ content, setData }) => {
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
      onUpdate({ editor }) {
        const contentJSON = JSON.stringify(editor.getJSON());
        setData(contentJSON);
      },
      content: content ? JSON.parse(content) : tiptap.defaultJSONContent,
    },
    []
  );

  useEffect(() => {
    if (!editor) return;
    editor.commands.setContent(
      content ? JSON.parse(content) : tiptap.defaultJSONContent
    );
  }, [content]);

  return (
    <>
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
      <EditorContent editor={editor} className="note-tiptap-editor" />
    </>
  );
};

export default TiptapNoWrapper;
