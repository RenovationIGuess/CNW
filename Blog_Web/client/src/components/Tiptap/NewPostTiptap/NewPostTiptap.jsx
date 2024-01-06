import React, { useCallback, useEffect, useState } from 'react';
import '../Tiptap.scss';
import { useEditor, EditorContent } from '@tiptap/react';
import { handlePaste } from '../utils/handlePaste';
import { handleDrop } from '../utils/handleDrop';
import NewPostMenuBar from './NewPostMenuBar';
import { cn } from '~/utils';
import extensions from '../extensions/tiptapExtension';
import TiptapBubbleMenu from '../BubbleMenu/TiptapBubbleMenu';
import { debounce } from 'lodash';

const NewPostTiptap = ({ post, setPost, error }) => {
  const debouncedSave = useCallback(
    debounce((contentJSON, contentHTML) => {
      console.log('re-render');
      setPost({
        ...post,
        content_json: contentJSON,
        content_html: contentHTML,
      });
    }, 0),
    [post]
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

        debouncedSave(contentJSON, contentHTML);
      },
      content: post.content_html,
    },
    []
  );

  return (
    <div className="editor-container social-post-editor-container">
      <div className={cn('post-editor', error && 'error-border-color')}>
        <TiptapBubbleMenu editor={editor} />
        <NewPostMenuBar editor={editor} />
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
