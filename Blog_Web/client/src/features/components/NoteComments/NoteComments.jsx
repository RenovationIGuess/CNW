import React, { useState } from 'react';
// import SearchBar from "../../SearchBar/SearchBar.jsx";
import { IoIosArrowDown } from 'react-icons/io';
import NoteCommentCard from './NoteCommentCard';
import NoteCommentsSkeletonLoading from './NoteCommentsSkeletonLoading';
import { images } from '~/constants';

const Comments = ({
  comments,
  commentReplyBoxOpen,
  handleOpenCommentReplyBox,
  setCommentReplyBoxOpen,
  note,
  setComments,
  sidebar,
}) => {
  // The index of the current comment in the commentReplyBoxOpen array
  // Ex: second element in comments array <=> ind = 1
  // => its index in commentReplyBoxOpen array is
  // (comments[0].replies.length + 0 = prevIndex) + 1
  let curIndex = 0;
  return comments.map((comment, ind) => {
    const index = curIndex;
    curIndex += comment.replies.length + 1;
    return (
      <NoteCommentCard
        // Below is the main | root array of commentReplyBoxOpen
        commentReplyBoxOpenArr={commentReplyBoxOpen}
        commentReplyBoxOpen={commentReplyBoxOpen[index]}
        handleOpenCommentReplyBox={handleOpenCommentReplyBox}
        setCommentReplyBoxOpen={setCommentReplyBoxOpen}
        note={note}
        comment={comment}
        commentIndex={ind}
        crboIndex={index}
        key={comment.id}
        comments={comments}
        setComments={setComments}
        sidebar={sidebar}
      />
    );
  });
};

const NoteComments = ({
  note,
  comments,
  setComments,
  commentReplyBoxOpen,
  setCommentReplyBoxOpen,
  fetchCommentsLoading,
  sidebar = false,
}) => {
  // const { currentUser } = userStateContext();
  // const [searchValue, setSearchValue] = useState("");
  const [commentFilterOpen, setCommentFilterOpen] = useState(false);

  const handleOpenCommentReplyBox = (index) => {
    setCommentReplyBoxOpen(
      commentReplyBoxOpen.map((item, ind) => {
        if (ind === index)
          return {
            ...item,
            state: !item.state,
          };
        return {
          ...item,
          state: false,
        };
      })
    );
  };

  return (
    <>
      <div className="comment-list__container">
        {/* <SearchBar searchValue={searchValue} setSearchValue={setSearchValue} /> */}
        <div className="comment-list__container--header">
          <div className="comment-list__filter">
            <div
              className={`filter-select__container${
                commentFilterOpen ? ' filter-select__container--active' : ''
              }`}
              onClick={() => setCommentFilterOpen(!commentFilterOpen)}
            >
              <span className="select-label">
                <span className="selected-label">All comments</span>
              </span>
              <IoIosArrowDown
                className={`select-arrow${
                  commentFilterOpen ? ' select-arrow__reverse' : ''
                }`}
              />
            </div>
          </div>
        </div>
        <div className={`comment-list__body`}>
          {fetchCommentsLoading ? (
            <NoteCommentsSkeletonLoading />
          ) : comments.length === 0 ? (
            <div className="flex flex-col mt-6 items-center justify-center">
              <img src={images.nothing} alt="nothing" className="w-[276px]" />
              <p className="note-comment__empty--title">
                There are no comments ~.~
              </p>
            </div>
          ) : (
            <>
              <Comments
                comments={comments}
                commentReplyBoxOpen={commentReplyBoxOpen}
                handleOpenCommentReplyBox={handleOpenCommentReplyBox}
                setCommentReplyBoxOpen={setCommentReplyBoxOpen}
                note={note}
                setComments={setComments}
                sidebar={sidebar}
              />
              <div className="note-comment__bottom">
                <span>This is the end ~</span>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default NoteComments;
