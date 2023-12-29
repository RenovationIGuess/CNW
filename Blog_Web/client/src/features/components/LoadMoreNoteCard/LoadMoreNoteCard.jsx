import React from 'react';
import './LoadMoreNoteCard.scss';
import { GiNotebook } from 'react-icons/gi';

const LoadMoreNoteCard = ({ paginate, getNotes }) => {
  return (
    <div className="note-item" onClick={() => getNotes(paginate?.current_page)}>
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center">
          {paginate?.loading ? (
            <span className="my-loader load-more__loader"></span>
          ) : (
            <div className="note-icon__wrapper">
              <GiNotebook className="text-white text-5xl" />
            </div>
          )}
          <p className="load-more__title">
            {paginate?.loading
              ? 'Loading...'
              : `Load More (${
                  paginate.total -
                  (paginate.current_page - 1) * paginate.per_page
                })`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadMoreNoteCard;
