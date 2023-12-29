import { useEditor, EditorContent } from '@tiptap/react';
import './Tiptap.scss';
import { useEffect } from 'react';
import { handlePaste } from './utils/handlePaste';
import { handleDrop } from './utils/handleDrop';
import extensions from './extensions/tiptapExtension';

const CommentContent = ({ comment }) => {
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
      content: JSON.parse(comment.content_json),
    },
    []
  );

  useEffect(() => {
    if (!editor) return;
    // console.log(comment.content_json)
    editor.commands.setContent(JSON.parse(comment.content_json));
  }, [comment.id]);

  return (
    <div className="comment-card__content">
      <EditorContent editor={editor} />
    </div>
  );
};

export default CommentContent;
