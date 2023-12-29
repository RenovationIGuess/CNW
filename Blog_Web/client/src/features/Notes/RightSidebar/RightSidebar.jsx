import React from 'react';
import NoteCommentsSidebar from './NoteCommentsSidebar';
import NoteHistoriesSidebar from './NoteHistoriesSidebar';
import RightSidebarWrapper from './RightSidebarWrapper';

const RightSidebar = ({
  type,
  handleCloseRightSidebar,
  fetchNoteHistories,
  fetchNoteComments,
}) => {
  return (
    <RightSidebarWrapper
      type={type}
      handleCloseRightSidebar={handleCloseRightSidebar}
      fetchNoteHistories={fetchNoteHistories}
      fetchNoteComments={fetchNoteComments}
    >
      {type === 'comments' ? (
        <NoteCommentsSidebar />
      ) : (
        type === 'histories' && <NoteHistoriesSidebar />
      )}
    </RightSidebarWrapper>
  );
};

export default RightSidebar;
