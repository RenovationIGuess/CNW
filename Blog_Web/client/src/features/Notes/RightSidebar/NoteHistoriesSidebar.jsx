import React from 'react';
import useNotesStore from '~/store/useNotesStore';
import NoteHistoriesSkeletonLoading from '../../components/NoteHistories/NoteHistoriesSkeletonLoading';
import NoteHistories from '../../components/NoteHistories/NoteHistories';

const NoteHistoriesSidebar = ({}) => {
  const [
    currentNote,
    setCurrentNote,
    currentNoteHistories,
    setCurrentNoteHistories,
    fetchCurrentNoteHistoriesLoading,
  ] = useNotesStore((state) => [
    state.currentNote,
    state.setCurrentNote,
    state.currentNoteHistories,
    state.setCurrentNoteHistories,
    state.fetchCurrentNoteHistoriesLoading,
  ]);

  return fetchCurrentNoteHistoriesLoading ? (
    <>
      <NoteHistoriesSkeletonLoading />
      <NoteHistoriesSkeletonLoading />
    </>
  ) : (
    <>
      <NoteHistories
        note={currentNote}
        setNote={setCurrentNote}
        histories={currentNoteHistories}
        setHistories={setCurrentNoteHistories}
        rightSidebar={true}
      />
    </>
  );
};

export default NoteHistoriesSidebar;
