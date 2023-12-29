import { BubbleMenu, useEditor, EditorContent } from '@tiptap/react';
import './Tiptap.scss';
import MenuBar from './MenuBar/MenuBar.jsx';
import CustomBubbleMenu from './BubbleMenu/CustomBubbleMenu';
import axiosClient from '../../axios';
import { handlePaste } from './utils/handlePaste';
import { handleDrop } from './utils/handleDrop';
import { useCallback, useEffect, useState } from 'react';
import { debounce } from 'lodash';
import useNoteStore from '~/store/useNoteStore';
import { cn } from '~/utils';
import LinkBubbleMenu from './BubbleMenu/LinkBubbleMenu';
import extensions from './extensions/tiptapExtension';
import TableBubbleMenu from './BubbleMenu/TableBubbleMenu';
import useNotesStore from '~/store/useNotesStore';
import { useLocation } from 'react-router-dom';

const Tiptap = ({ noteId, contentHTML, contentJSON, setNote }) => {
  const { pathname } = useLocation();

  // Current selected text
  // const [selectedText, setSelectedText] = useState("");
  const [linkContent, setLinkContent] = useState('');
  const [linkNodePos, setLinkNodePos] = useState({});

  // const [content, setContent] = useState({
  //   content_json: contentJSON,
  //   content_html: contentHTML,
  // });

  const [setSavingNote] = useNotesStore((state) => [state.setSavingNote]);

  const [setSaveContentLoading] = useNoteStore((state) => [
    state.setSaveContentLoading,
  ]);

  const debouncedSave = useCallback(
    debounce((contentJSON, contentHTML) => {
      if (pathname === '/notes') {
        setSavingNote(true);
      }
      if (pathname === `/notes/${noteId}`) {
        setSaveContentLoading(true);
      }
      axiosClient
        .patch(`/notes/${noteId}/content`, {
          content_html: contentHTML,
          content_json: contentJSON,
        })
        .then(({ data }) => {
          setNote(data.data);
        })
        .catch((error) => console.error('Error saving note content:', error))
        .finally(() => {
          if (pathname === '/notes') {
            setSavingNote(false);
          }
          if (pathname === `/notes/${noteId}`) {
            setSaveContentLoading(false);
          }
        });
    }, 1000),
    [noteId]
  );

  useEffect(() => {
    return () => {
      debouncedSave.flush();
    };
  }, [debouncedSave]);

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
        const contentHTML = editor.getHTML();

        // setContent({
        //   content_json: contentJSON,
        //   content_html: contentHTML,
        // });

        debouncedSave(contentJSON, contentHTML);
      },
      // content: JSON.parse(content.content_json),
      content: contentHTML,
    },
    []
  );

  useEffect(() => {
    if (!editor) return;
    // setContent({
    //   content_json: contentJSON,
    //   content_html: contentHTML,
    // });
    editor.commands.setContent(contentHTML);
  }, [noteId]);

  // useEffect(() => {
  //   setSelectedText(
  //     editor?.view.state.selection.content().content.firstChild?.content
  //       .firstChild?.text
  //   );
  // }, [
  //   editor?.view.state.selection.content().content.firstChild?.content
  //     .firstChild?.text,
  // ]);

  return (
    <div className="editor-container">
      <MenuBar editor={editor} />
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
      <div
        className="tiptap-frame"
        onClick={() => editor && editor.chain().focus().scrollIntoView()}
      >
        <div className="tiptap-scroller">
          <div
            className={cn(
              'tiptap-editor-layout'
              // 'tiptap-editor-layout--wide'
            )}
          >
            <div className="tiptap-editor-layout__content">
              <div className="tiptap-content">
                <div className="tiptap-content-container">
                  <EditorContent
                    editor={editor}
                    className="note-tiptap-editor"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tiptap;
