import React from 'react';
import { GiNotebook } from 'react-icons/gi';

const NewNoteCard = ({ createNewNote, newNoteLoading, horizontal }) => {
  return (
    <div
      className={`note-view__item${
        horizontal ? ' note-view__item--horizontal' : ''
      }`}
      onClick={() => createNewNote()}
    >
      <div className="flex-1 flex items-center justify-center">
        <div className={`flex items-center${horizontal ? '' : ' flex-col'}`}>
          {newNoteLoading ? (
            <span className="my-loader add-more__loader"></span>
          ) : (
            <div className="note-icon__wrapper w-[56px] h-[56px]">
              <GiNotebook
                className={`text-white${
                  horizontal ? ' text-3xl' : ' text-4xl'
                }`}
              />
            </div>
          )}
          <p className="load-more__title new-note__title">
            {newNoteLoading ? 'Adding...' : `+ New Note`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewNoteCard;
