import React, { useEffect, useRef } from 'react';
import { images } from '~/constants';
import { useNavigate } from 'react-router-dom';
import { cn, stringUtils } from '~/utils';
import useModalStore from '~/store/useModalStore';
import { useDrag } from 'react-dnd';
import { Tooltip } from 'antd';

// Could be public | private items
const DirItemList = ({ items, handleChooseDirectory, setDirModalOpen }) => {
  const [currentDir] = useModalStore((state) => [state.currentDir]);

  return (
    <div className="dir-child-container">
      {items[currentDir.id]?.loading ? (
        <div className="dir-empty">
          <div className="my-loader loader-xl"></div>
          <p className="mt-4 text-base font-medium">Loading...</p>
        </div>
      ) : items[currentDir.id]?.child_items.length > 0 ? (
        <ul className="dir-child-list">
          {items[currentDir.id].child_items.map((child) => (
            <DirItem
              key={`${child.data_type}-${child.id}`}
              child={child}
              setDirModalOpen={setDirModalOpen}
              handleChooseDirectory={handleChooseDirectory}
            />
          ))}
        </ul>
      ) : (
        <div className="dir-empty">
          <img src={images.nothing} alt="empty-dir-img" />
          <p>This directory is empty</p>
        </div>
      )}
    </div>
  );
};

const DirItem = ({ child, handleChooseDirectory, setDirModalOpen }) => {
  const navigate = useNavigate();

  const dataRef = useRef();

  const [currentClickedItem, setCurrentClickedItem] = useModalStore((state) => [
    state.currentClickedItem,
    state.setCurrentClickedItem,
  ]);

  const [dirModalUseType] = useModalStore((state) => [state.dirModalUseType]);

  useEffect(() => {
    dataRef.current = child;
  }, [child]);

  const [{ isDragging }, drag] = useDrag(() => ({
    item: { ...child, getData: () => dataRef.current },
    type: child.data_type,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <li
      ref={drag}
      onDoubleClick={() => {
        switch (child.data_type) {
          case 'directory':
            handleChooseDirectory(child);
            break;
          case 'note':
            if (dirModalUseType === 'locate') {
              navigate(`/notes/${child.id}`);
              setDirModalOpen(false);
            }
            break;
          case 'schedule':
            if (dirModalUseType === 'locate') {
              navigate(`/schedules/${child.id}`);
              setDirModalOpen(false);
            }
            break;
          case 'deck':
            if (dirModalUseType === 'locate') {
              navigate(`/decks/${child.id}`);
              setDirModalOpen(false);
            }
            break;
          default:
            break;
        }
      }}
      onClick={() => setCurrentClickedItem(child)}
      className={cn(
        `dir-child-item dir-child-item--sm`,
        currentClickedItem?.id === child.id &&
          currentClickedItem?.data_type === child.data_type &&
          'dir-child-item--active',
        isDragging && 'dir-child-item--active cursor-move'
      )}
    >
      <Tooltip
        placement="top"
        title={stringUtils.uppercaseStr(child.data_type)}
        arrow={false}
      >
        <div className="child-item__wrp">
          <div>
            <div className="child-item-logo">
              {!child.icon.includes('/') ? (
                <p className="child-item-logo">{child.icon}</p>
              ) : (
                <img src={child.icon} alt="child-item-logo" />
              )}
            </div>
            <div className="child-item-name">{child.title}</div>
          </div>
        </div>
      </Tooltip>
    </li>
  );
};

export default DirItemList;
