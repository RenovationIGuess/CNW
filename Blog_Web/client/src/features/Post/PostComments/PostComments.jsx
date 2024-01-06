import React, { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { images } from '~/constants';
import PostCommentCard from './PostCommentCard';
import usePostStore from '~/store/usePostStore';
import { cn } from '~/utils';
import AllCommentReplies from './AllCommentReplies';
import PostCommentsSkeletonLoading from './PostCommentsSkeletonLoading';

const Comments = ({}) => {
  const [comments] = usePostStore((state) => [state.comments]);

  // Index for commentInputOpen array
  let curIndex = 0;
  return comments.map((comment, ind) => {
    const index = curIndex;
    curIndex += comment.replies.length + 1;
    return (
      <PostCommentCard
        key={comment.id}
        comment={comment}
        commentIndex={ind}
        cioIndex={index}
      />
    );
  });
};

const PostComments = ({}) => {
  const [comments, fetchingComments] = usePostStore((state) => [
    state.comments,
    state.fetchingComments,
  ]);
  const [selectedComment] = usePostStore((state) => [state.selectedComment]);

  const [openAllRepliesModal, setOpenAllRepliesModal] = useState(false);
  const [commentFilterOpen, setCommentFilterOpen] = useState(false);

  if (fetchingComments) {
    return <PostCommentsSkeletonLoading />;
  }

  return (
    <div className="comment-list__container">
      {/* <SearchBar searchValue={searchValue} setSearchValue={setSearchValue} /> */}
      <div className="comment-list__container--header">
        <div className="comment-list__filter">
          <div
            className={cn(
              'filter-select__container',
              commentFilterOpen && ' filter-select__container--active'
            )}
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
        {comments.length === 0 && (
          <div className="flex flex-col mt-6 items-center justify-center">
            <img
              src={images.no_comment}
              alt="nothing"
              className="w-[168px] mb-6"
            />
            <p className="note-comment__empty--title">
              There are no comments ~.~
            </p>
          </div>
        )}
        {comments.length > 0 && <Comments />}
      </div>

      <AllCommentReplies
        comment={selectedComment.comment}
        commentIndex={selectedComment.commentIndex}
        cioIndex={selectedComment.cioIndex}
        open={openAllRepliesModal}
        setOpen={setOpenAllRepliesModal}
      />
    </div>
  );
};

export default PostComments;
