import React, { useState } from 'react';
import { BsPlusCircle, BsThreeDots, BsTrash, BsViewList } from 'react-icons/bs';
import { IoIosArrowDown } from 'react-icons/io';
import {
  MdDriveFileRenameOutline,
  MdOutlineContentCut,
  MdOutlineContentPaste,
} from 'react-icons/md';
import {
  AiOutlineCopy,
  AiOutlineShareAlt,
  AiOutlineSortAscending,
} from 'react-icons/ai';
import { Tooltip } from 'antd';
import useModalStore from '~/store/useModalStore';
import axiosClient from '~/axios';
import useSidebarStore from '~/store/useSidebarStore';
import { userStateContext } from '~/contexts/ContextProvider';
import { objUtils } from '~/utils';
import useCalendarStore from '~/store/useCalendarStore';
import useNoteStore from '~/store/useNoteStore';
import { useLocation } from 'react-router-dom';
import useFlashcardStore from '~/store/useFlashcardStore';

const ItemAction = ({ currentDir }) => {
  const { pathname } = useLocation();
  const { currentUser } = userStateContext();

  const [dirModalUseType, dataToSetPath, setDirectoryModalOpen] = useModalStore(
    (state) => [
      state.dirModalUseType,
      state.dataToSetPath,
      state.setDirectoryModalOpen,
    ]
  );
  const [setActionToast] = useModalStore((state) => [state.setActionToast]);

  const [loading, setLoading] = useState(false);

  const [privateItems, setPrivateItems] = useSidebarStore((state) => [
    state.privateItems,
    state.setPrivateItems,
  ]);

  const [publicItems, setPublicItems] = useSidebarStore((state) => [
    state.publicItems,
    state.setPublicItems,
  ]);

  const [setSelectedPath] = useModalStore((state) => [state.setSelectedPath]);

  const [setNote] = useNoteStore((state) => [state.setNote]);

  const [setDeck] = useFlashcardStore((state) => [state.setDeck]);

  const [setCurSchedule] = useCalendarStore((state) => [state.setCurSchedule]);

  const routeSideEffects = (item) => {
    if (pathname === `/notes/${item.id}`) {
      setNote(item);
    } else if (pathname === `/decks/${item.id}`) {
      setDeck(item);
    } else if (pathname === `/schedules/${item.id}`) {
      setCurSchedule(item);
    }
  };

  const handlePrivateDirDrop = (url, item, itemParentId, parentId, dirDiff) => {
    setLoading(true);
    axiosClient
      .patch(url, {
        ...item,
        directory_id: parentId,
      })
      .then(({ data }) => {
        const newData = data.data;

        routeSideEffects(newData);

        let newPrivateItems = null;

        if (dirDiff) {
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
            newPrivateItems = {
              ...privateItems,
              [parentId]: {
                ...privateItems[parentId],
                child_items: [newData, ...privateItems[parentId].child_items],
                loading: false,
              },
            };
          }
        } else {
          newPrivateItems = {
            ...privateItems,
          };

          if (privateItems[itemParentId] != null) {
            newPrivateItems[itemParentId] = {
              ...privateItems[itemParentId],
              child_items: privateItems[itemParentId].child_items.filter(
                (item) =>
                  !(
                    item.id === newData.id &&
                    item.data_type === newData.data_type
                  )
              ),
            };
          }

          if (privateItems[parentId] != null) {
            newPrivateItems[parentId] = {
              ...privateItems[parentId],
              child_items: [newData, ...privateItems[parentId].child_items],
              loading: false,
            };
          }
        }

        if (newPrivateItems != null) {
          setPrivateItems(newPrivateItems);
        }

        setDirectoryModalOpen(false);

        setActionToast({
          status: true,
          message: 'Updated',
        });
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handlePublicDirDrop = (url, item, itemParentId, parentId, dirDiff) => {
    setLoading(true);
    axiosClient
      .patch(url, {
        ...item,
        directory_id: parentId,
      })
      .then(({ data }) => {
        const newData = data.data;

        routeSideEffects(newData);

        let newPublicItems = null;

        if (dirDiff) {
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
            newPublicItems = {
              ...publicItems,
              [parentId]: {
                ...publicItems[parentId],
                child_items: [newData, ...publicItems[parentId].child_items],
                loading: false,
              },
            };
          }
        } else {
          newPublicItems = {
            ...publicItems,
          };

          if (publicItems[itemParentId] != null) {
            newPublicItems[itemParentId] = {
              ...publicItems[itemParentId],
              child_items: publicItems[itemParentId].child_items.filter(
                (item) =>
                  !(
                    item.id === newData.id &&
                    item.data_type === newData.data_type
                  )
              ),
            };
          }

          if (publicItems[parentId] != null) {
            newPublicItems[parentId] = {
              ...publicItems[parentId],
              child_items: [newData, ...publicItems[parentId].child_items],
              loading: false,
            };
          }
        }

        if (newPublicItems != null) {
          setPublicItems(newPublicItems);
        }

        setDirectoryModalOpen(false);

        setActionToast({
          status: true,
          message: 'Updated',
        });
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleConfirm = () => {
    if (!currentDir) return;

    // If we have no data to set the location then we're chosing the
    // location for new created item
    if (objUtils.isEmptyObject(dataToSetPath)) {
      setSelectedPath(currentDir.path);
      setDirectoryModalOpen(false);
    } else {
      let url = '';
      const parentId = currentDir.id;
      const itemParentId = dataToSetPath.directory_id;

      switch (dataToSetPath.data_type) {
        case 'directory':
          url = `/directories/${dataToSetPath.id}`;
          break;
        case 'note':
          url = `/notes/${dataToSetPath.id}`;
          break;
        case 'schedule':
          url = `/schedules/${dataToSetPath.id}`;
          break;
        case 'deck':
          url = `/decks/${dataToSetPath.id}/location`;
          break;
        default:
          break;
      }

      if (itemParentId !== parentId) {
        // Check if the new location is a different directory
        const rootType = currentDir.path[0].title.toLowerCase();
        const dirDiff =
          dataToSetPath.path[0].id !== currentUser[`${rootType}_dir`].id;

        const handleDrop =
          rootType === 'private' ? handlePrivateDirDrop : handlePublicDirDrop;

        handleDrop(url, dataToSetPath, itemParentId, parentId, dirDiff);
      }
    }
  };

  return (
    <>
      {/* Action with an item */}
      <div className="dir-action-bar">
        {/* Add new item button */}
        <div className="flex items-center">
          <Tooltip
            placement="top"
            title="Create a new item in the current location"
          >
            <div className={`action-item`}>
              <BsPlusCircle className="icon" />
              <span>New</span>
              <IoIosArrowDown className="arrow-icon" />
            </div>
          </Tooltip>
          <div className="vertical-divide-line"></div>
          <Tooltip placement="top" title="Cut">
            <div
              className={`action-item${
                !currentDir ? ' action-item--disabled' : ''
              }`}
            >
              <MdOutlineContentCut className="icon-lg" />
            </div>
          </Tooltip>
          <Tooltip placement="top" title="Copy">
            <div
              className={`action-item${
                !currentDir ? ' action-item--disabled' : ''
              }`}
            >
              <AiOutlineCopy className="icon-lg" />
            </div>
          </Tooltip>
          <Tooltip placement="top" title="Paste">
            <div
              className={`action-item${
                !currentDir ? ' action-item--disabled' : ''
              }`}
            >
              <MdOutlineContentPaste className="icon-lg" />
            </div>
          </Tooltip>
          <Tooltip placement="top" title="Rename">
            <div
              className={`action-item${
                !currentDir ? ' action-item--disabled' : ''
              }`}
            >
              <MdDriveFileRenameOutline className="icon-xl" />
            </div>
          </Tooltip>
          <Tooltip placement="top" title="Share">
            <div
              className={`action-item${
                !currentDir ? ' action-item--disabled' : ''
              }`}
            >
              <AiOutlineShareAlt className="icon-xl" />
            </div>
          </Tooltip>
          <Tooltip placement="top" title="Delete">
            <div
              className={`action-item no-margin${
                !currentDir ? ' action-item--disabled' : ''
              }`}
            >
              <BsTrash className="icon-lg" />
            </div>
          </Tooltip>
          <div className="vertical-divide-line"></div>
          <Tooltip placement="top" title="Sort and group options">
            <div className="action-item">
              <AiOutlineSortAscending className="icon-xl" />
              <span>Sort</span>
              <IoIosArrowDown className="arrow-icon" />
            </div>
          </Tooltip>
          <Tooltip placement="top" title="Change views">
            <div className="action-item no-margin">
              <BsViewList className="icon-xl" />
              <span>View</span>
              <IoIosArrowDown className="arrow-icon" />
            </div>
          </Tooltip>
          <div className="vertical-divide-line"></div>
          <Tooltip placement="top" title="More">
            <div className="action-item no-margin">
              <BsThreeDots className="icon-lg" />
            </div>
          </Tooltip>
        </div>
        {dirModalUseType === 'path' && (
          <div className="flex items-center ml-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleConfirm();
              }}
              className="account-edit-btn account-edit-confirm-btn"
            >
              {!loading ? (
                <>Confirm</>
              ) : (
                <>
                  <span className="my-loader account-bg-loader"></span>
                  Loading...
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ItemAction;
