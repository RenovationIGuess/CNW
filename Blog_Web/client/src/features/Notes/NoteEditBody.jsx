import React from 'react';
import Tiptap from '~/components/Tiptap/Tiptap';

const NoteEditBody = ({ noteId, contentHTML, contentJSON, setNote }) => {
  return (
    <>
      <Tiptap
        noteId={noteId}
        contentHTML={contentHTML}
        contentJSON={contentJSON}
        setNote={setNote}
      />
    </>
  );
};

export default NoteEditBody;
