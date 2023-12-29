import { useEditor, EditorContent } from '@tiptap/react';
import './Tiptap.scss';
import { useEffect } from 'react';
import { handlePaste } from './utils/handlePaste';
import { handleDrop } from './utils/handleDrop';
import extensions from './extensions/tiptapExtension';
import { tiptap } from '~/constants';
import { cn } from '~/utils';

const TiptapContent = ({ content }) => {
  const editor = useEditor(
    {
      editable: false,
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
    <EditorContent
      editor={editor}
      className={cn(!editor?.editable && 'non-editable')}
    />
  );
};

export default TiptapContent;
