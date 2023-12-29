import React, { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { images } from '~/constants';
import NoteCommentsSkeletonLoading from '~/features/components/NoteComments/NoteCommentsSkeletonLoading';
import PostCommentCard from './PostCommentCard';

const Comments = ({
  postId,
  posterId,
  comments,
  setComments,
  commentInputOpen,
  setCommentInputOpen,
  handleOpenCommentInput,
  inputContent,
  setInputContent,
}) => {
  // Index for commentInputOpen array
  let curIndex = 0;
  return comments.map((comment, ind) => {
    const index = curIndex;
    curIndex += comment.replies.length + 1;
    return (
      <PostCommentCard
        key={comment.id}
        postId={postId}
        posterId={posterId}
        comment={comment}
        commentIndex={ind}
        cioIndex={index}
        comments={comments}
        setComments={setComments}
        commentInputOpen={commentInputOpen}
        setCommentInputOpen={setCommentInputOpen}
        handleOpenCommentInput={handleOpenCommentInput}
        handleOpenReplyInput={handleOpenCommentInput}
        inputContent={inputContent}
        setInputContent={setInputContent}
      />
    );
  });
};

const PostComments = ({
  postId,
  posterId,
  comments,
  setComments,
  inputContent,
  setInputContent,
  commentInputOpen,
  setCommentInputOpen,
  fetchCommentsLoading,
}) => {
  const [commentFilterOpen, setCommentFilterOpen] = useState(false);

  const handleOpenCommentInput = (commentIndex) => {
    setCommentInputOpen(
      commentInputOpen.map((c, ind) => {
        if (ind === commentIndex)
          return {
            ...c,
            state: !c.state,
          };
        return {
          ...c,
          state: false,
        };
      })
    );
  };

  return (
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
              <span className="selected-label">
                All comments {comments.length}
              </span>
            </span>
            <IoIosArrowDown
              className={`select-arrow${
                commentFilterOpen ? ' select-arrow__reverse' : ''
              }`}
            />
          </div>
        </div>
      </div>
      <div className={``}>
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
          <Comments
            comments={comments}
            postId={postId}
            posterId={posterId}
            setComments={setComments}
            commentInputOpen={commentInputOpen}
            setCommentInputOpen={setCommentInputOpen}
            handleOpenCommentInput={handleOpenCommentInput}
            inputContent={inputContent}
            setInputContent={setInputContent}
          />
        )}
      </div>
    </div>
  );
};

export default PostComments;
