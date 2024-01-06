import { Popover, Tooltip } from 'antd';
import React, { useState } from 'react';
import IconSelector from '../IconSelector/IconSelector';
import { BsEmojiSmile, BsFillImageFill } from 'react-icons/bs';
import { AiOutlineLink } from 'react-icons/ai';
import { MdOutlineAlternateEmail } from 'react-icons/md';
import AddImagePopover from './Popovers/AddImagePopover';
import AddLinkPopover from './Popovers/AddLinkPopover';

// It used for both comment and reply
const TiptapCommentFooter = ({ editor }) => {
  return (
    <div className="comment-footer__toolbar">
      <EmojiButton editor={editor} />
      <ImageButton editor={editor} />
      <LinkButton editor={editor} />
      <Tooltip placement="bottom" title="Add mentions">
        <MdOutlineAlternateEmail className="comment-tool__icon" />
      </Tooltip>
    </div>
  );
};

const EmojiButton = ({ editor }) => {
  return (
    <Popover
      rootClassName="custom-popover"
      placement="bottomLeft"
      arrow={false}
      trigger="click"
      content={
        <IconSelector
          callback={(icon) => {
            if (!editor) return;
            editor.commands.insertContent(icon);
          }}
        />
      }
    >
      <Tooltip placement="bottom" title="Add emojis">
        <BsEmojiSmile className="comment-tool__icon" />
      </Tooltip>
    </Popover>
  );
};

const ImageButton = ({ editor }) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [error, setError] = useState(false);

  // For image inject
  const [imageUrl, setImageUrl] = useState('');

  const addImageThroughUrl = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
    }
  };

  const handleCancel = () => {
    setPopoverOpen(false);
    setImageUrl('');
    setError(false);
  };

  return (
    <Popover
      rootClassName="custom-popover"
      placement="bottomLeft"
      arrow={false}
      trigger="click"
      open={popoverOpen}
      onOpenChange={() => setPopoverOpen(!popoverOpen)}
      content={
        <AddImagePopover
          error={error}
          setError={setError}
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
          addImageThroughUrl={addImageThroughUrl}
          handleCancel={handleCancel}
        />
      }
    >
      <Tooltip placement="bottom" title="Add images">
        <BsFillImageFill className="comment-tool__icon" />
      </Tooltip>
    </Popover>
  );
};

const LinkButton = ({ editor }) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [error, setError] = useState(false);

  // For links func
  const [urlLabel, setUrlLabel] = useState('');
  const [url, setUrl] = useState('');

  const setLink = (selectTextState) => {
    // console.log(selectTextState);
    // If there is no selected text => true because we're using empty
    if (selectTextState) {
      editor.commands.insertContent(
        `
          <a
            target="_blank"
            rel="noopener noreferrer"
            href=${url}
          >
            ${urlLabel || url}
          </a>
        `,
        {
          parseOptions: {
            preserveWhitespace: false,
          },
        }
      );
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run();
    }
  };

  const handleCancel = () => {
    setUrl('');
    setUrlLabel('');
    setPopoverOpen(false);
    setError(false);
  };

  return (
    <Popover
      rootClassName="custom-popover"
      placement="bottomLeft"
      arrow={false}
      trigger="click"
      open={popoverOpen}
      onOpenChange={() => setPopoverOpen(!popoverOpen)}
      content={
        <AddLinkPopover
          editor={editor}
          error={error}
          setError={setError}
          urlLabel={urlLabel}
          setUrlLabel={setUrlLabel}
          url={url}
          setUrl={setUrl}
          setLink={setLink}
          handleCancel={handleCancel}
        />
      }
    >
      <Tooltip placement="bottom" title="Add links">
        <AiOutlineLink className="comment-tool__icon" />
      </Tooltip>
    </Popover>
  );
};

export default TiptapCommentFooter;
