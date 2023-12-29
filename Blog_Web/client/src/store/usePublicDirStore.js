import { create } from 'zustand';
import { Tree } from '../ds/tree/Tree';

const usePublicDirStore = create((set) => ({
  publicDir: null,
  fetchPublicDirLoading: false,
  publicDirInit: (data) => {
    const tree = new Tree(data.id, data);
    set({ publicDir: tree });
  },
  setPublicDir: (state) => set({ publicDir: state }),
  addItem: (parentDirId, data, state) => {
    // Insert new data to the tree
    state.insert(parentDirId, data.id, data);
    set({ publicDir: state });
  },
  removeItem: (dataId, state) => {
    // Remove old data from the tree
    state.remove(dataId);
    set({ publicDir: state });
  },
  editItem: (dataId, newData, state) => {
    // Create a copy
    const publicDirCopy = new Tree();
    publicDirCopy.setRoot(state.copy());
    publicDirCopy.edit(dataId, newData);
    set({ publicDir: publicDirCopy });
  },
}));

export default usePublicDirStore;
