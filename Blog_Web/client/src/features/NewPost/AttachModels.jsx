import React, { useState } from 'react';
import { AiFillFolder, AiFillFolderOpen } from 'react-icons/ai';
import useModalStore from '~/store/useModalStore';

// Models: [Note, Calendar, Flashcard]
const AttachModels = ({}) => {
  const [hovered, setHovered] = useState(false);
  const [setDirectoryModalOpen, setDirModalUseType] = useModalStore((state) => [
    state.setDirectoryModalOpen,
    state.setDirModalUseType,
  ]);

  return (
    <>
      <div className="form-item-container">
        <span className="form-item-container__label">
          Attach note | schedule | flashcard
        </span>
        <div
          className={`banner-entry`}
          onMouseOver={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => {
            setDirModalUseType('attach');
            setDirectoryModalOpen(true);
          }}
        >
          {hovered ? (
            <AiFillFolderOpen className="icon" />
          ) : (
            <AiFillFolder className="icon" />
          )}
          <p>Browse Folder</p>
        </div>
      </div>
      {/* <div className="form-item-container">
        <span className="form-item-container__label">
          Attach schedule | calendar
        </span>
      </div>
      <div className="form-item-container">
        <span className="form-item-container__label">Attach flashcard set</span>
      </div> */}
    </>
  );
};

export default AttachModels;
