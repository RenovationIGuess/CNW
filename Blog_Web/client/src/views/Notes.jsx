import React, { useEffect, useState } from 'react';
import './styles/Notes.scss';
import axiosClient from '../axios';
import NoteEditHeader from '../features/Notes/NoteEditHeader';
import NoteEditBody from '../features/Notes/NoteEditBody';
import NoteEditFooter from '../features/Notes/NoteEditFooter';
import ActionNotiToast from '../components/ActionNotiToast';
import useNotesStore from '../store/useNotesStore';
import NoteList from '../features/Notes/NoteList';
import RightSidebar from '../features/Notes/RightSidebar/RightSidebar';
import useModalStore from '~/store/useModalStore';

const Notes = () => {
  const [
    notes,
    setNotes,
    setFetchCurrentNoteCommentsLoading,
    currentNoteCommentsFL,
    currentNoteHistoriesFL,
    setCurrentNoteCommentsFL,
    setCurrentNoteHistoriesFL,
    setCurrentNoteHistories,
    setFetchCurrentNoteHistoriesLoading,
  ] = useNotesStore((state) => [
    state.notes,
    state.setNotes,
    state.setFetchCurrentNoteCommentsLoading,
    state.currentNoteCommentsFL,
    state.currentNoteHistoriesFL,
    state.setCurrentNoteCommentsFL,
    state.setCurrentNoteHistoriesFL,
    state.setCurrentNoteHistories,
    state.setFetchCurrentNoteHistoriesLoading,
  ]);

  const [setCurrentNoteComments] = useNotesStore((state) => [
    state.setCurrentNoteComments,
  ]);

  const [setPaginateNotes] = useNotesStore((state) => [state.setPaginateNotes]);

  const [currentNote, setCurrentNote] = useNotesStore((state) => [
    state.currentNote,
    state.setCurrentNote,
  ]);

  const [fetchNotesLoading, setFetchNotesLoading] = useNotesStore((state) => [
    state.fetchNotesLoading,
    state.setFetchNotesLoading,
  ]);

  const [commentReplyBoxOpen, setCommentReplyBoxOpen] = useNotesStore(
    (state) => [state.commentReplyBoxOpen, state.setCommentReplyBoxOpen]
  );

  const [setSavingNote] = useNotesStore((state) => [state.setSavingNote]);

  // Action toast state manage
  const [setActionToast] = useModalStore((state) => [state.setActionToast]);

  // Control rightSidebar state and what data does sidebar rendering
  // type: ['comments', 'histories'] && state: [true - open, false -closed]
  const [rightSidebarOpen, setRightSidebarOpen] = useState({
    state: false,
    type: '',
  });

  useEffect(() => {
    if (Object.keys(currentNote).length === 0) {
      document.title = `Notes`;
    } else document.title = `Notes | ${currentNote.title}`;
  }, [currentNote]);

  // Get all the notes (recently)
  useEffect(() => {
    // Fetch notes
    axiosClient
      .get('/notes')
      .then(({ data }) => {
        const fetchedNotes = data.data.data;
        setNotes(fetchedNotes);
        // setSearchNotes(fetchedNotes);
        // Default: first note in the notes array will be first selected
        setCurrentNote(fetchedNotes.length > 0 ? fetchedNotes[0] : {});
        const fetchedPagination = data.data.links;
        setPaginateNotes(
          fetchedPagination.length > 3
            ? fetchedPagination.slice(2, fetchedPagination.length - 1)
            : []
        );
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setFetchNotesLoading(false);
      });
    // Fetch pagination
  }, []);

  // Update the notes array when user update the currentDir
  useEffect(() => {
    // If currentNote is not empty then update the notes array
    if (Object.keys(currentNote).length > 0) {
      setNotes(
        notes.map((note) => (note.id === currentNote.id ? currentNote : note))
      );
    }
  }, [currentNote]);

  // Them event listener cho Ctrl + S => de luu note
  useEffect(() => {
    window.removeEventListener('keydown', handleKeyDown);
    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentNote]);

  const handleKeyDown = (event) => {
    const code = event.which || event.keyCode;

    let charCode = String.fromCharCode(code).toLowerCase();
    if ((event.ctrlKey || event.metaKey) && charCode === 's') {
      event.preventDefault();
      handleSaveContent();
      setActionToast({
        status: true,
        message: 'Saved',
      });
    }
  };

  const handleSaveContent = async () => {
    setSavingNote(true);
    await axiosClient
      .patch(`/notes/${currentNote.id}/content`, {
        content_html: currentNote.content_html,
        content_json: currentNote.content_json,
      })
      .catch((err) => console.log(err))
      .finally(() => setSavingNote(false));
  };

  // editContent is use to track if the user click in the edit content icon
  // in that case, instead of open the sidebar, we should close if its open and
  // continue to close if its being closed
  // type: ['comments', 'histories']
  const handleCloseRightSidebar = (editContent = false, type = '') => {
    const rightSidebar = document.querySelector('.right-sidebar__wrapper');

    if (rightSidebar) {
      if (editContent) {
        if (rightSidebarOpen.state) {
          rightSidebar.classList.add('right-sidebar--closed');
          setRightSidebarOpen({
            state: false,
            type: '',
          });
        }
      } else {
        // If the sidebar is being opened and the the clicked icon is the same
        // as the previous clicked => close the sidebar
        if (rightSidebarOpen.state) {
          if (type === rightSidebarOpen.type) {
            rightSidebar.classList.add('right-sidebar--closed');
            setRightSidebarOpen({
              state: false,
              type: '',
            });
          } else {
            setRightSidebarOpen({
              ...rightSidebarOpen,
              type: type,
            });
          }
        } else {
          rightSidebar.classList.toggle('right-sidebar--closed');
          setRightSidebarOpen({
            state: !rightSidebar.state,
            type: type,
          });
        }
      }
    }
  };

  const fetchNoteHistories = () => {
    if (!currentNoteHistoriesFL) {
      setCurrentNoteHistoriesFL(true);
      setFetchCurrentNoteHistoriesLoading(true);
      axiosClient
        .get(`/notes/${currentNote.id}/histories`)
        .then(({ data }) => {
          setCurrentNoteHistories(data.data);
        })
        .catch((err) => console.log(err))
        .finally(() => setFetchCurrentNoteHistoriesLoading(false));
    }
  };

  const fetchNoteComments = () => {
    if (!currentNoteCommentsFL) {
      setCurrentNoteCommentsFL(true);
      setFetchCurrentNoteCommentsLoading(true);
      axiosClient
        .get(`/notes/${currentNote.id}/comments`)
        .then(({ data }) => {
          setCurrentNoteComments(data.data);

          for (const comment of data.data) {
            // Push the comment in first
            commentReplyBoxOpen.push({
              comment_id: comment.id,
              state: false,
            });

            // Then the replies
            for (const reply of comment.replies) {
              commentReplyBoxOpen.push({
                comment_id: reply.id,
                state: false,
              });
            }
          }
          setCommentReplyBoxOpen([...commentReplyBoxOpen]);
        })
        .catch((err) => console.log(err))
        .finally(() => setFetchCurrentNoteCommentsLoading(false));
    }
  };

  return (
    <div className="flex flex-1 max-h-full min-h-0 min-w-0 relative overflow-hidden">
      <NoteList handleCloseRightSidebar={handleCloseRightSidebar} />
      <main className="note-edit__container">
        <div className="note-content__container">
          {fetchNotesLoading ? (
            <div>Loading...</div>
          ) : Object.keys(currentNote).length > 0 ? (
            <>
              <NoteEditHeader
                currentNote={currentNote}
                setCurrentNote={setCurrentNote}
                notes={notes}
                setNotes={setNotes}
                rightSidebarOpen={rightSidebarOpen.state}
                handleCloseRightSidebar={handleCloseRightSidebar}
                fetchNoteHistories={fetchNoteHistories}
                fetchNoteComments={fetchNoteComments}
              />
              <NoteEditBody
                noteId={currentNote.id}
                contentHTML={currentNote.content_html}
                contentJSON={currentNote.content_json}
                setNote={setCurrentNote}
              />
              <NoteEditFooter />
            </>
          ) : (
            <></>
          )}
        </div>
        <RightSidebar
          type={rightSidebarOpen.type}
          handleCloseRightSidebar={handleCloseRightSidebar}
          fetchNoteHistories={fetchNoteHistories}
          fetchNoteComments={fetchNoteComments}
        />
      </main>
    </div>
  );
};

export default Notes;
