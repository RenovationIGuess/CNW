import { Modal } from 'antd';
import React, { useEffect, useMemo } from 'react';
import ItemAction from './ItemAction';
import Navigation from './Navigation';
import './DirectoryModal.scss';
import { userStateContext } from '~/contexts/ContextProvider';
import useSidebarStore from '~/store/useSidebarStore';
import DirectoryModalSidebar from './DirectoryModalSidebar';

import useModalStore from '~/store/useModalStore';
import axiosClient from '~/axios';
import DirItemList from './DirItemList';

const DirectoryModal = ({ dirModalOpen, setDirModalOpen }) => {
  const { currentUser } = userStateContext();

  const [privateItems, setPrivateItems] = useSidebarStore((state) => [
    state.privateItems,
    state.setPrivateItems,
  ]);

  const [publicItems, setPublicItems] = useSidebarStore((state) => [
    state.publicItems,
    state.setPublicItems,
  ]);

  const [currentDir, setCurrentDir] = useModalStore((state) => [
    state.currentDir,
    state.setCurrentDir,
  ]);

  // List of selected directories on the navigation bar

  // Default will open private directory
  useEffect(() => {
    setCurrentDir(currentUser.private_dir);
  }, []);

  // true - public | false - private
  const currentRootDir = useMemo(() => {
    if (currentDir.path === undefined) return false;
    return currentDir?.path[0].title === 'Public';
  }, [currentDir]);

  const handleChooseDirectory = (directory) => {
    setCurrentDir(directory);

    // Check if the dir is belongs to private | public folder
    const belongsToPublic = directory.path[0].title === 'Public';
    const id = directory.id;

    if (belongsToPublic) {
      if (!publicItems[id]) {
        const newPublicItems = {
          ...publicItems,
          [id]: {
            child_items: [],
            loading: true,
          },
        };
        setPublicItems(newPublicItems);
        axiosClient.get(`/directories/${id}/children`).then(({ data }) => {
          // console.log(data.data);
          const newPublicItems = {
            ...publicItems,
            [data.data.id]: {
              ...data.data,
              loading: false,
              child_items: data.data.child_items,
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
              loading: false,
              child_items: data.data.child_items,
            },
          };
          setPrivateItems(newPrivateItems);
        });
      }
    }
  };

  return (
    <Modal
      centered
      footer={null}
      open={dirModalOpen}
      onCancel={() => setDirModalOpen(false)}
      afterClose={() => {}}
      title="Directory"
      className="custom-modal directory-modal"
      width={'75%'}
      zIndex={1001}
    >
      <ItemAction currentDir={currentDir} />
      <Navigation path={currentDir.path} currentRootDir={currentRootDir} />
      {/* <DirectoryContainer /> */}
      <div className="directory-container">
        {/* Sidebar */}
        <DirectoryModalSidebar handleChooseDirectory={handleChooseDirectory} />

        {/* Main */}
        <DirItemList
          items={currentRootDir ? publicItems : privateItems}
          handleChooseDirectory={handleChooseDirectory}
          setDirModalOpen={setDirModalOpen}
        />
      </div>
    </Modal>
  );
};

export default DirectoryModal;
