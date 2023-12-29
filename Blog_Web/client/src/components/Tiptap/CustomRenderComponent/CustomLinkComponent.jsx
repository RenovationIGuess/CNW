import { NodeViewWrapper } from '@tiptap/react';
import React from 'react';
import { AiOutlineEdit } from 'react-icons/ai';
import { MdOutlineLinkOff } from 'react-icons/md';

const CustomLinkComponent = ({ url, urlLabel }) => {
  return (
    <NodeViewWrapper className="custom-link">
      <a href={url} target="blank" rel="noopener noreferrer">
        {urlLabel}
      </a>
      <div className="tool-tips">
        <div className="tool-tips__content">
          <span className="link-content"></span>
          <AiOutlineEdit className="button-icon" />
          <MdOutlineLinkOff
            className="button-icon"
            onClick={() =>
              editor.chain().focus().extendMarkRange('link').unsetLink().run()
            }
          />
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export default CustomLinkComponent;
