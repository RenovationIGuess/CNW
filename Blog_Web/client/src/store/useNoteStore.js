// Use to control the current selected note - for Note.jsx page
import { create } from 'zustand';

const useNoteStore = create((set) => ({
  note: {},
  // Both comments and histories are belongs to the note
  comments: [],
  histories: [],

  fetchNoteLoading: true,
  fetchCommentsLoading: true,
  fetchHistoriesLoading: true,

  updateNoteLoading: false,
  setUpdateNoteLoading: (state) => set({ updateNoteLoading: state }),

  saveContentLoading: false,
  setSaveContentLoading: (state) => set({ saveContentLoading: state }),

  setNote: (note) => set({ note }),
  setFetchNoteLoading: (state) => set({ fetchNoteLoading: state }),

  setComments: (comments) => set({ comments }),
  setFetchCommentsLoading: (state) => set({ fetchCommentsLoading: state }),

  setHistories: (histories) => set({ histories }),
  setFetchHistoriesLoading: (state) => set({ fetchHistoriesLoading: state }),
}));

export default useNoteStore;
