import { BubbleMenu } from '@tiptap/react';
import React, { useState } from 'react';
import CustomBubbleMenu from './CustomBubbleMenu';
import LinkBubbleMenu from './LinkBubbleMenu';
import TableBubbleMenu from './TableBubbleMenu';

// Sums up of all kind of bubble menus in my custom tiptap
const TiptapBubbleMenu = ({ editor }) => {
  const [linkContent, setLinkContent] = useState('');
  const [linkNodePos, setLinkNodePos] = useState({});

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
    </>
  );
};

export default TiptapBubbleMenu;
