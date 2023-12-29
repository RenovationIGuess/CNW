import { Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  AiFillFolder,
  AiFillFolderOpen,
  AiOutlineInfoCircle,
} from 'react-icons/ai';
import { IoIosArrowForward } from 'react-icons/io';
import useModalStore from '~/store/useModalStore';
import { cn } from '~/utils';

// A shared component use to select a specific location
// in the directory system
const ChooseLocation = ({ item, setItem, title, desc }) => {
  const [setDirectoryModalOpen, setDirModalUseType] = useModalStore((state) => [
    state.setDirectoryModalOpen,
    state.setDirModalUseType,
  ]);

  const [selectedPath] = useModalStore((state) => [state.selectedPath]);

  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (selectedPath.length !== 0) {
      setItem((prev) => ({
        ...prev,
        directory_id: selectedPath[selectedPath.length - 1].id,
      }));
    }
  }, [selectedPath]);

  return (
    <div className="edit-tag__item schedule-bg-item">
      <div className="flex items-center">
        <p className="edit-tag__title">{title}</p>
        <div className="copyright-settings-title">
          <Tooltip title={'Default is Private Directory'} placement="top">
            <AiOutlineInfoCircle className="icon" />
          </Tooltip>
        </div>
      </div>

      <ul
        className={cn(
          'location-list',
          'location-list--lg',
          selectedPath.length > 0 && 'mt-0'
        )}
      >
        {selectedPath.map((item, index) => (
          <li key={item.id} className="location-item">
            {item.icon.includes('/') ? (
              <img className="item-icon" src={item.icon} alt="" />
            ) : (
              <span className="item-icon">{item.icon}</span>
            )}
            <span className="item-name">{item.title}</span>
            {index !== selectedPath.length - 1 && (
              <span>
                <IoIosArrowForward className="arrow-icon" />
              </span>
            )}
          </li>
        ))}
      </ul>
      <div
        className={cn(`banner-entry`, selectedPath.length > 0 && 'mt-2')}
        onMouseOver={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => {
          setDirModalUseType('path');
          setDirectoryModalOpen(true);
        }}
      >
        {hovered ? (
          <AiFillFolderOpen className="icon" />
        ) : (
          <AiFillFolder className="icon" />
        )}
        <p>{desc}</p>
      </div>
    </div>
  );
};

export default ChooseLocation;
