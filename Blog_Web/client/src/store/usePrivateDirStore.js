import { create } from 'zustand';
import { Tree } from '../ds/tree/Tree';

const usePrivateDirStore = create((set) => ({
  privateDir: null,
  fetchPrivateDirLoading: false,
  privateDirInit: (data) => {
    const tree = new Tree(data.id, data);
    set({ privateDir: tree });
  },
  setPrivateDir: (state) => set({ privateDir: state }),
  addItem: (parentDirId, data, state) => {
    // Insert new data to the tree
    state.insert(parentDirId, data.id, data);
    set({ privateDir: state });
  },
  removeItem: (dataId, state) => {
    // Remove old data from the tree
    state.remove(dataId);
    set({ privateDir: state });
  },
  editItem: (dataId, newData, state) => {
    // Create a copy
    const privateDirCopy = new Tree();
    privateDirCopy.setRoot(state.copy());
    privateDirCopy.edit(dataId, newData);

    // // Set the state
    set({ privateDir: privateDirCopy });
  },
}));

export default usePrivateDirStore;
