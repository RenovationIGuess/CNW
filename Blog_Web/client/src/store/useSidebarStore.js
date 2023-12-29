import { create } from 'zustand';

/*
  Could convert to this type
  {
    [id]: {
      child_items: {
        [id]: {
          ...info
        }
      }
    }
  }

  => Khi thay doi thong tin chi can VD: privateItems[id].child_items[id]
  => Do phuc tap O(1)
*/

// Sidebar state management file
const useSidebarStore = create((set, get) => ({
  isSidebarMinimized: false,
  setIsSidebarMinimized: (state) => set({ isSidebarMinimized: state }),

  isUserModalOpen: false,
  setIsUserModalOpen: (state) => set({ isUserModalOpen: state }),

  privateItems: {},
  setPrivateItems: (privateItems) => set({ privateItems }),

  publicItems: {},
  setPublicItems: (publicItems) => set({ publicItems }),

  // Because I named them publicItems and privateItems => Items in common
  setItemsLoading: (id, isPrivate = true) => {
    const items = isPrivate ? get().privateItems : get().publicItems;
    const setItems = isPrivate ? get().setPrivateItems : get().setPublicItems;

    const newItems = {
      ...items,
      [id]: {
        ...items[id],
        loading: true,
      },
    };
    setItems(newItems);
  },

  setItemsLoading: (id, isPrivate = true) => {
    const items = isPrivate ? get().privateItems : get().publicItems;
    const setItems = isPrivate ? get().setPrivateItems : get().setPublicItems;

    const newItems = {
      ...items,
      [id]: {
        ...items[id],
        loading: true,
      },
    };
    setItems(newItems);
  },

  handleUpdateItems: (newData, isPrivate = true) => {
    const items = isPrivate ? get().privateItems : get().publicItems;
    const setItems = isPrivate ? get().setPrivateItems : get().setPublicItems;

    if (items[newData.directory_id] !== undefined) {
      const newItems = {
        ...items,
        [newData.directory_id]: {
          ...items[newData.directory_id],
          child_items: items[newData.directory_id].child_items.map((item) => {
            if (
              item.id === newData.id &&
              item.data_type === newData.data_type
            ) {
              return newData;
            } else return item;
          }),
        },
      };
      setItems(newItems);
    }
  },

  handleUpdateItemWithParentId: (
    newData,
    itemParentId,
    parentId,
    rootType,
    dirDiff
  ) => {
    const privateItems = get().privateItems;
    const setPrivateItems = get().setPrivateItems;

    const publicItems = get().publicItems;
    const setPublicItems = get().setPublicItems;

    if (dirDiff) {
      if (rootType === 'private') {
        if (publicItems[itemParentId] != null) {
          const newPublicItems = {
            ...publicItems,
            [itemParentId]: {
              ...publicItems[itemParentId],
              child_items: publicItems[itemParentId].child_items.filter(
                (item) =>
                  !(
                    item.id === newData.id &&
                    item.data_type === newData.data_type
                  )
              ),
            },
          };
          setPublicItems(newPublicItems);
        }

        if (privateItems[parentId] != null) {
          const childItems = privateItems[parentId].child_items;
          const itemIndex = childItems.findIndex(
            (item) =>
              item.id === newData.id && item.data_type === newData.data_type
          );

          if (itemIndex !== -1) {
            // The item exists in the array, update it
            childItems[itemIndex] = newData;
          } else {
            // The item does not exist in the array, add it
            childItems.unshift(newData);
          }

          const newPrivateItems = {
            ...privateItems,
            [parentId]: {
              ...privateItems[parentId],
              child_items: childItems,
              loading: false,
            },
          };
          setPrivateItems(newPrivateItems);
        }
      } else {
        if (privateItems[itemParentId] != null) {
          const newPrivateItems = {
            ...privateItems,
            [itemParentId]: {
              ...privateItems[itemParentId],
              child_items: privateItems[itemParentId].child_items.filter(
                (item) =>
                  !(
                    item.id === newData.id &&
                    item.data_type === newData.data_type
                  )
              ),
            },
          };
          setPrivateItems(newPrivateItems);
        }

        if (publicItems[parentId] != null) {
          const childItems = publicItems[parentId].child_items;
          const itemIndex = childItems.findIndex(
            (item) =>
              item.id === newData.id && item.data_type === newData.data_type
          );

          if (itemIndex !== -1) {
            // The item exists in the array, update it
            childItems[itemIndex] = newData;
          } else {
            // The item does not exist in the array, add it
            childItems.unshift(newData);
          }

          const newPublicItems = {
            ...publicItems,
            [parentId]: {
              ...publicItems[parentId],
              child_items: childItems,
              loading: false,
            },
          };
          setPublicItems(newPublicItems);
        }
      }
    } else {
      if (rootType === 'private') {
        const newPrivateItems = {
          ...privateItems,
        };

        if (privateItems[itemParentId] != null && itemParentId !== parentId) {
          newPrivateItems[itemParentId] = {
            ...privateItems[itemParentId],
            child_items: privateItems[itemParentId].child_items.filter(
              (item) =>
                !(
                  item.id === newData.id && item.data_type === newData.data_type
                )
            ),
          };
        }

        if (privateItems[parentId] != null) {
          const childItems = privateItems[parentId].child_items;
          const itemIndex = childItems.findIndex(
            (item) =>
              item.id === newData.id && item.data_type === newData.data_type
          );

          if (itemIndex !== -1) {
            // The item exists in the array, update it
            childItems[itemIndex] = newData;
          } else {
            // The item does not exist in the array, add it
            childItems.unshift(newData);
          }

          newPrivateItems[parentId] = {
            ...privateItems[parentId],
            child_items: childItems,
            loading: false,
          };
        }

        setPrivateItems(newPrivateItems);
      } else {
        const newPublicItems = {
          ...publicItems,
        };

        if (publicItems[itemParentId] != null && itemParentId !== parentId) {
          newPublicItems[itemParentId] = {
            ...publicItems[itemParentId],
            child_items: publicItems[itemParentId].child_items.filter(
              (item) =>
                !(
                  item.id === newData.id && item.data_type === newData.data_type
                )
            ),
          };
        }

        if (publicItems[parentId] != null) {
          const childItems = publicItems[parentId].child_items;
          const itemIndex = childItems.findIndex(
            (item) =>
              item.id === newData.id && item.data_type === newData.data_type
          );

          if (itemIndex !== -1) {
            // The item exists in the array, update it
            childItems[itemIndex] = newData;
          } else {
            // The item does not exist in the array, add it
            childItems.unshift(newData);
          }

          newPublicItems[parentId] = {
            ...publicItems[parentId],
            child_items: childItems,
            loading: false,
          };
        }

        setPublicItems(newPublicItems);
      }
    }
  },

  handleDeleteItems: (data, isPrivate = true) => {
    const items = isPrivate ? get().privateItems : get().publicItems;
    const setItems = isPrivate ? get().setPrivateItems : get().setPublicItems;

    setItems({
      ...items,
      [data.directory_id]: {
        ...items[data.directory_id],
        child_items: items[data.directory_id].child_items.filter(
          (item) => !(item.id === data.id && item.data_type === data.data_type)
        ),
      },
    });
  },

  // Quickly add item to root private | public dir
  handleAddItems: (newData, isPrivate = true) => {
    const items = isPrivate ? get().privateItems : get().publicItems;
    const setItems = isPrivate ? get().setPrivateItems : get().setPublicItems;

    if (items[newData.directory_id] !== undefined) {
      const newItems = {
        ...items,
        [newData.directory_id]: {
          ...items[newData.directory_id],
          loading: false,
          child_items: [newData, ...items[newData.directory_id].child_items],
        },
      };
      setItems(newItems);
    }
  },

  // ParentId is specified
  handleAddItemWithParentId: (newData, parentId) => {
    const privateItems = get().privateItems;
    const setPrivateItems = get().setPrivateItems;

    const publicItems = get().publicItems;
    const setPublicItems = get().setPublicItems;

    if (privateItems[parentId] != null) {
      setPrivateItems({
        ...privateItems,
        [parentId]: {
          ...privateItems[parentId],
          child_items: [newData, ...privateItems[parentId].child_items],
          loading: false,
        },
      });
    }

    if (publicItems[parentId] != null) {
      setPublicItems({
        ...publicItems,
        [parentId]: {
          ...publicItems[parentId],
          child_items: [newData, ...publicItems[parentId].child_items],
          loading: false,
        },
      });
    }
  },
}));

export default useSidebarStore;
