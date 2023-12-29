// Use to control list of notes for Notes.jsx page
import { create } from 'zustand';
import axiosClient from '../axios';

const useNotesStore = create((set) => ({
  // FL stands for FirstLoad
  notes: [],
  currentNote: {}, // The current selected note when in the Notes.jsx page
  paginateNotes: {}, // The pagination information for scrolling & loading more contents
  starredNotes: [],

  currentNoteComments: [],
  currentNoteCommentsFL: false,
  commentReplyBoxOpen: [], // Use to control which reply box is opened

  currentNoteHistories: [],
  currentNoteHistoriesFL: false,

  fetchNotesLoading: true,
  fetchMoreNotesLoading: false,
  fetchStarredNotesLoading: true,

  fetchCurrentNoteCommentsLoading: true,

  fetchCurrentNoteHistoriesLoading: true,

  setNotes: (notes) => set({ notes }),
  setPaginateNotes: (paginateNotes) => set({ paginateNotes }),
  setFetchNotesLoading: (state) => set({ fetchNotesLoading: state }),
  setFetchMoreNotesLoading: (state) => set({ fetchMoreNotesLoading: state }),
  setStarredNotes: (starredNotes) => set({ starredNotes }),
  setFetchStarredNotesLoading: (state) =>
    set({ fetchStarredNotesLoading: state }),

  setCurrentNote: (currentNote) => set({ currentNote }),

  setCurrentNoteCommentsFL: (state) => set({ currentNoteCommentsFL: state }),
  setFetchCurrentNoteCommentsLoading: (state) =>
    set({ fetchCurrentNoteCommentsLoading: state }),
  setCurrentNoteComments: (currentNoteComments) => set({ currentNoteComments }),
  setCommentReplyBoxOpen: (commentReplyBoxOpen) => set({ commentReplyBoxOpen }),

  setCurrentNoteHistoriesFL: (state) => set({ currentNoteHistoriesFL: state }),
  setCurrentNoteHistories: (currentNoteHistories) =>
    set({ currentNoteHistories }),
  setFetchCurrentNoteHistoriesLoading: (state) =>
    set({ fetchCurrentNoteHistoriesLoading: state }),

  savingNote: false,
  setSavingNote: (state) => set({ savingNote: state }),
}));

export default useNotesStore;
