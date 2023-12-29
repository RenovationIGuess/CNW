import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import DirectoryNoItem from './DirectoryNoItem';
import NoteItem from './NoteItem';
import ScheduleItem from './ScheduleItem';
import DirectoryItem from './DirectoryItem';
import useSidebarStore from '~/store/useSidebarStore';
import axiosClient from '~/axios';
import { Tooltip } from 'antd';
import { cn, stringUtils } from '~/utils';
import useModalStore from '~/store/useModalStore';
import { useDrop } from 'react-dnd';
import { dragTypes } from '~/constants';
import { userStateContext } from '~/contexts/ContextProvider';
import useNoteStore from '~/store/useNoteStore';
import useNotesStore from '~/store/useNotesStore';
import useCalendarStore from '~/store/useCalendarStore';
import DeckItem from './DeckItem';
import useFlashcardStore from '~/store/useFlashcardStore';

// rootType: private | public
const ItemList = ({
  parentId,
  rootType = 'private',
  level = 0,
  data,
  isModal = false,
  callback = () => {},
}) => {
  const { pathname } = useLocation();

  const { currentUser } = userStateContext();

  const [privateItems, setPrivateItems] = useSidebarStore((state) => [
    state.privateItems,
    state.setPrivateItems,
  ]);

  const [publicItems, setPublicItems] = useSidebarStore((state) => [
    state.publicItems,
    state.setPublicItems,
  ]);

  const [setItemsLoading] = useSidebarStore((state) => [state.setItemsLoading]);

  const [notes, setNotes, currentNote, setCurrentNote] = useNotesStore(
    (state) => [
      state.notes,
      state.setNotes,
      state.currentNote,
      state.setCurrentNote,
    ]
  );

  const [note, setNote] = useNoteStore((state) => [state.note, state.setNote]);

  const [curSchedule, setCurSchedule] = useCalendarStore((state) => [
    state.curSchedule,
    state.setCurSchedule,
  ]);

  const [schedules, setSchedules] = useCalendarStore((state) => [
    state.schedules,
    state.setSchedules,
  ]);

  const [decks, setDecks] = useFlashcardStore((state) => [
    state.decks,
    state.setDecks,
  ]);

  const [currentDir] = useModalStore((state) => [state.currentDir]);

  const [setActionToast] = useModalStore((state) => [state.setActionToast]);

  const [expanded, setExpanded] = useState({});

  // const droppableId = useMemo(() => {
  //   let res = `${rootType}-dir`;
  //   if (isModal) res = res + '-modal';
  //   if (parentId) return res + `-parent-${parentId}`;
  //   return res;
  // }, [isModal, rootType, parentId]);

  const scheduleSideEffects = (newData) => {
    if (newData.data_type === 'schedule') {
      if (pathname === `/schedules/${newData.id}`) {
        setCurSchedule({
          ...curSchedule,
          directory_id: newData.directory_id,
          path: newData.path,
        });
      }

      if (pathname === '/calendar') {
        setSchedules(
          schedules.map((item) => {
            if (item.id === newData.id)
              return {
                ...item,
                directory_id: newData.directory_id,
                path: newData.path,
              };
            return item;
          })
        );
      }
    }
  };

  const noteSideEffects = (newData) => {
    if (newData.data_type === 'note') {
      if (pathname === `/notes/${newData.id}`) {
        setNote({
          ...note,
          directory_id: newData.directory_id,
          path: newData.path,
        });
      }

      if (pathname === '/notes') {
        if (Object.keys(currentNote).length > 0) {
          if (currentNote.id === newData.id) {
            setCurrentNote({
              ...currentNote,
              directory_id: newData.directory_id,
              path: newData.path,
            });
          }
        }

        setNotes(
          notes.map((item) => {
            if (item.id === newData.id)
              return {
                ...item,
                directory_id: newData.directory_id,
                path: newData.path,
              };
            return item;
          })
        );
      }
    }
  };

  const deckSideEffects = (newData) => {
    if (newData.data_type === 'deck') {
      if (pathname === '/decks') {
        setDecks(
          decks.map((item) => {
            if (item.id === newData.id)
              return {
                ...item,
                directory_id: newData.directory_id,
                path: newData.path,
              };
            return item;
          })
        );
      }
    }
  };

  const handlePrivateDirDrop = (url, item, itemParentId, parentId, dirDiff) => {
    setItemsLoading(parentId);

    axiosClient
      .patch(url, {
        ...item,
        directory_id: parentId,
      })
      .then(({ data }) => {
        const newData = data.data;

        let newPrivateItems = null;

        if (dirDiff) {
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

          newPrivateItems = {
            ...privateItems,
            [parentId]: {
              ...privateItems[parentId],
              child_items: [newData, ...privateItems[parentId].child_items],
              loading: false,
            },
          };
        } else {
          newPrivateItems = {
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
            [parentId]: {
              ...privateItems[parentId],
              child_items: [newData, ...privateItems[parentId].child_items],
              loading: false,
            },
          };
        }
        setPrivateItems(newPrivateItems);

        // Side effects
        scheduleSideEffects(newData);
        noteSideEffects(newData);
        deckSideEffects(newData);

        setActionToast({
          status: true,
          message: 'Updated',
        });
      })
      .catch((err) => console.error(err));
  };

  const handlePublicDirDrop = (url, item, itemParentId, parentId, dirDiff) => {
    setItemsLoading(parentId, false);

    axiosClient
      .patch(url, {
        ...item,
        directory_id: parentId,
      })
      .then(({ data }) => {
        const newData = data.data;

        let newPublicItems = null;

        if (dirDiff) {
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

          newPublicItems = {
            ...publicItems,
            [parentId]: {
              ...publicItems[parentId],
              child_items: [newData, ...publicItems[parentId].child_items],
              loading: false,
            },
          };
        } else {
          newPublicItems = {
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
            [parentId]: {
              ...publicItems[parentId],
              child_items: [newData, ...publicItems[parentId].child_items],
              loading: false,
            },
          };
        }
        setPublicItems(newPublicItems);

        // Side effects
        scheduleSideEffects(newData);
        noteSideEffects(newData);
        deckSideEffects(newData);

        setActionToast({
          status: true,
          message: 'Updated',
        });
      })
      .catch((err) => console.error(err));
  };

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: [
        dragTypes.NOTE,
        dragTypes.DIR,
        dragTypes.SCHEDULE,
        dragTypes.DECK,
      ],
      drop: (item, monitor) => {
        if (monitor.isOver({ shallow: true })) {
          // console.log('Dragging item:', item.getData());
          // console.log('Dragged into item id:', parentId);
          const latestItem = item.getData();

          let url = '';
          const itemParentId = latestItem.directory_id;

          switch (latestItem.data_type) {
            case 'directory':
              url = `/directories/${latestItem.id}`;
              break;
            case 'note':
              url = `/notes/${latestItem.id}`;
              break;
            case 'schedule':
              url = `/schedules/${latestItem.id}`;
              break;
            case 'deck':
              url = `/decks/${latestItem.id}/location`;
              break;
            default:
              break;
          }

          if (parentId) {
            if (itemParentId !== parentId) {
              // Set the loading for the dir that will be dropped into
              if (rootType === 'private') {
                // Check if the item is dragged into other dir type
                // Which means if its in private and move it to public => dirDiff true and vice versa
                const dirDiff =
                  latestItem.path[0].id !== currentUser.private_dir.id;

                handlePrivateDirDrop(
                  url,
                  latestItem,
                  itemParentId,
                  parentId,
                  dirDiff
                );
              } else {
                const dirDiff =
                  latestItem.path[0].id !== currentUser.public_dir.id;

                handlePublicDirDrop(
                  url,
                  latestItem,
                  itemParentId,
                  parentId,
                  dirDiff
                );
              }
            }
          } else {
            if (rootType === 'private') {
              const parentId = currentUser.private_dir.id;

              if (itemParentId !== parentId) {
                const dirDiff =
                  latestItem.path[0].id !== currentUser.private_dir.id;

                handlePrivateDirDrop(
                  url,
                  latestItem,
                  itemParentId,
                  parentId,
                  dirDiff
                );
              }
            } else {
              const parentId = currentUser.public_dir.id;

              if (itemParentId !== parentId) {
                const dirDiff =
                  latestItem.path[0].id !== currentUser.public_dir.id;

                handlePublicDirDrop(
                  url,
                  latestItem,
                  itemParentId,
                  parentId,
                  dirDiff
                );
              }
            }
          }
        }
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver({ shallow: true }),
      }),
    }),
    [
      parentId,
      privateItems,
      publicItems,
      rootType,
      note,
      notes,
      curSchedule,
      schedules,
    ]
  );

  const onExpand = (id) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [id]: !prevExpanded[id],
    }));

    if (rootType === 'public') {
      if (!publicItems[id]) {
        const newPublicItems = {
          ...publicItems,
          [id]: {
            loading: true,
            child_items: [],
          },
        };
        setPublicItems(newPublicItems);
        axiosClient.get(`/directories/${id}/children`).then(({ data }) => {
          // console.log(data.data);
          const newPublicItems = {
            ...publicItems,
            [data.data.id]: {
              ...data.data,
              child_items: data.data.child_items,
              loading: false,
            },
          };
          setPublicItems(newPublicItems);
        });
      }
    } else {
      if (!privateItems[id]) {
        const newPrivateItems = {
          ...privateItems,
          [id]: {
            child_items: [],
            loading: true,
          },
        };
        setPrivateItems(newPrivateItems);
        axiosClient.get(`/directories/${id}/children`).then(({ data }) => {
          // console.log(data.data);
          const newPrivateItems = {
            ...privateItems,
            [data.data.id]: {
              ...data.data,
              child_items: data.data.child_items,
              loading: false,
            },
          };
          setPrivateItems(newPrivateItems);
        });
      }
    }
  };

  // Fetch the data here?

  // Skeleton loading here?

  return (
    <div ref={drop} className={cn(isOver && 'dir-list--hovered')}>
      {/* Map data here */}
      {data.length > 0 ? (
        data.map((item) => (
          <div key={`${item.data_type}-${item.id}`}>
            <Tooltip
              placement="right"
              title={stringUtils.uppercaseStr(item.data_type)}
              arrow={false}
            >
              {item.data_type === 'note' && (
                <NoteItem
                  rootType={rootType}
                  isModal={isModal}
                  data={item}
                  level={level}
                  active={pathname === `/notes/${item.id}`}
                />
              )}
              {item.data_type === 'schedule' && (
                <ScheduleItem
                  rootType={rootType}
                  isModal={isModal}
                  data={item}
                  level={level}
                  active={pathname === `/schedules/${item.id}`}
                />
              )}
              {item.data_type === 'deck' && (
                <DeckItem
                  rootType={rootType}
                  isModal={isModal}
                  data={item}
                  level={level}
                  active={pathname === `/deck/${item.id}`}
                />
              )}
              {item.data_type === 'directory' && (
                <DirectoryItem
                  rootType={rootType}
                  isModal={isModal}
                  data={item}
                  level={level}
                  onExpand={() => onExpand(item.id)}
                  active={isModal && currentDir?.id === item.id}
                  expanded={expanded[item.id]}
                  callback={callback}
                />
              )}
            </Tooltip>
            {rootType === 'public' &&
              expanded[item.id] &&
              !publicItems[item.id]?.loading &&
              item.data_type === 'directory' &&
              publicItems[item.id] && (
                <ItemList
                  rootType={rootType}
                  parentId={item.id}
                  level={level + 1}
                  data={publicItems[item.id].child_items}
                  isModal={isModal}
                  callback={callback}
                />
              )}
            {rootType === 'private' &&
              expanded[item.id] &&
              !privateItems[item.id]?.loading &&
              item.data_type === 'directory' &&
              privateItems[item.id] && (
                <ItemList
                  rootType={rootType}
                  parentId={item.id}
                  level={level + 1}
                  data={privateItems[item.id].child_items}
                  isModal={isModal}
                  callback={callback}
                />
              )}
          </div>
        ))
      ) : (
        <DirectoryNoItem level={level} />
      )}
    </div>
  );
};

export default ItemList;
