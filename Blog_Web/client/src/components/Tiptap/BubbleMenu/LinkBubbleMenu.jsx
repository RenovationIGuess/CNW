import React, { useState } from 'react';
import { AiOutlineEdit } from 'react-icons/ai';
import { MdOutlineLinkOff } from 'react-icons/md';
import LinkEditModal from './LinkEditModal';
import { Tooltip } from 'antd';

// linkNodePos will be { from, to }
const LinkBubbleMenu = ({ editor, url, label, linkNodePos }) => {
  // console.log(linkNodePos);

  const [editModalOpen, setEditModalOpen] = useState(false);

  return (
    <div className="tool-tips" id="link-bubble-menu">
      <div className="tool-tips__content">
        <Tooltip placement="top" title={'Click to navigate'}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={url}
            className="link-content"
          >
            {url}
          </a>
        </Tooltip>

        <Tooltip placement="top" title={'Edit'}>
          <AiOutlineEdit
            onClick={() => setEditModalOpen(true)}
            className="button-icon"
          />
        </Tooltip>
        <Tooltip placement="top" title={'Remove'}>
          <MdOutlineLinkOff
            className="button-icon"
            onClick={() =>
              editor.chain().focus().extendMarkRange('link').unsetLink().run()
            }
          />
        </Tooltip>
      </div>

      <LinkEditModal
        editor={editor}
        open={editModalOpen}
        setOpen={setEditModalOpen}
        oldUrl={url}
        oldLabel={label}
      />
    </div>
  );
};

export default LinkBubbleMenu;
