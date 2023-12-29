import React from 'react';
import '../Tiptap.scss';
import { BubbleMenu, useEditor, EditorContent } from '@tiptap/react';
import { handlePaste } from '../utils/handlePaste';
import { handleDrop } from '../utils/handleDrop';
import NewPostMenuBar from './NewPostMenuBar';
import CustomBubbleMenu from '../BubbleMenu/CustomBubbleMenu';
import { cn } from '~/utils';
import extensions from '../extensions/tiptapExtension';

const NewPostTiptap = ({ post, setPost, error }) => {
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

        setPost({
          ...post,
          content_json: contentJSON,
          content_html: contentHTML,
        });
      },
      content: post.content_json ? JSON.parse(post.content_json) : '',
    },
    []
  );

  return (
    <div className="editor-container social-post-editor-container">
      <div className={cn('post-editor', error && 'error-border-color')}>
        <NewPostMenuBar editor={editor} />
        {editor && (
          <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
            <CustomBubbleMenu editor={editor} />
          </BubbleMenu>
        )}
        <div className="post-editor-component">
          <div className="tiptap-content-container">
            <EditorContent className="post-tiptap-editor" editor={editor} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPostTiptap;
