import React, { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import NoteHistoryCard from './NoteHistoryCard';
import { images } from '~/constants';

// rightSidebar use to check if this component is used for Notes.jsx's RightSidebar or not
const NoteHistories = ({
  note,
  setNote,
  histories,
  setHistories,
  rightSidebar = false,
}) => {
  const [viewState, setViewState] = useState('updates');
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <>
      <div className="comment-list__container--header histories-list__header">
        <ul className="switch-tab__list">
          <li
            className={`switch-tab__icon${
              viewState === 'updates' ? ' switch-tab__icon--active' : ''
            } histories-list__header--item`}
            onClick={() => setViewState('updates')}
          >
            <span className="histories-item__header--label">Updates</span>
            <span className="switch-tab__line"></span>
          </li>
          <li
            className={`switch-tab__icon${
              viewState === 'analytics' ? ' switch-tab__icon--active' : ''
            } histories-list__header--item`}
            onClick={() => setViewState('analytics')}
          >
            <span className="histories-item__header--label">Analytics</span>
            <span className="switch-tab__line"></span>
          </li>
        </ul>
        <div className="comment-list__filter">
          <div
            className={`filter-select__container${
              filterOpen ? ' filter-select__container--active' : ''
            }`}
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <span className="select-label">
              <span className="selected-label">All changes</span>
            </span>
            <IoIosArrowDown
              className={`select-arrow${
                filterOpen ? ' select-arrow__reverse' : ''
              }`}
            />
          </div>
        </div>
      </div>

      {histories.length > 0 ? (
        <div
          className={`histories-list__body${
            rightSidebar ? ' histories-list__body--sidebar' : ''
          }`}
        >
          {histories.map((history, ind) => (
            <NoteHistoryCard
              note={note}
              key={ind}
              setNote={setNote}
              history={history}
              histories={histories}
              setHistories={setHistories}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col flex-1 items-center justify-center px-4">
          <img src={images.nothing} alt="nothing" className="w-[276px]" />
          <p className="note-comment__empty--title">
            There are no histories ~.~
          </p>
          <p className="note-history__empty--guide">
            A note's history will be created when you make{' '}
            <span className="text-[#657ef8] font-medium">changes</span> to the
            note ^_^
          </p>
        </div>
      )}
      <div className="note-comment__bottom">
        <span>This is the end ~</span>
      </div>
    </>
  );
};

export default NoteHistories;
