import { create } from 'zustand';

const useModalStore = create((set) => ({
  // From Bottom Up Toast
  bottomToast: {
    show: false,
    message: '',
  },
  setBottomToast: (bottomToast) => set({ bottomToast }),

  // Centered Toast
  actionToast: {
    status: false,
    message: '',
  },
  setActionToast: (actionToast) => set({ actionToast }),

  confirmModalInfo: {
    title: '',
    message: '',
    confirmCallback: () => {},
    cancelCallback: () => {},
  },
  setConfirmModalInfo: (confirmModalInfo) => set({ confirmModalInfo }),

  confirmModalLoading: false,
  setConfirmModalLoading: (confirmModalLoading) => set({ confirmModalLoading }),

  confirmModalOpen: false,
  setConfirmModalOpen: (confirmModalOpen) => set({ confirmModalOpen }),

  // Directory Modal
  directoryModalOpen: false,
  setDirectoryModalOpen: (directoryModalOpen) => set({ directoryModalOpen }),

  // Locate file - 'locate' | Attach file - 'attach' | Choose path - 'path'
  dirModalUseType: 'locate',
  setDirModalUseType: (dirModalUseType) => set({ dirModalUseType }),

  // Use for chosing path
  dataToSetPath: {},
  setDataToSetPath: (dataToSetPath) => set({ dataToSetPath }),

  // The chosen path
  selectedPath: [],
  setSelectedPath: (selectedPath) => set({ selectedPath }),

  currentDir: {},
  setCurrentDir: (currentDir) => set({ currentDir }),

  currentClickedItem: {},
  setCurrentClickedItem: (currentClickedItem) => set({ currentClickedItem }),
}));

export default useModalStore;
