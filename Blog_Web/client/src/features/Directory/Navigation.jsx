import { Tooltip } from 'antd';
import React, { useMemo, useState } from 'react';
import {
  IoIosArrowBack,
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosArrowUp,
} from 'react-icons/io';
import { MdRefresh } from 'react-icons/md';
import NoAnimateSearchBar from '~/components/SearchBar/NoAnimateSearchBar';
import useModalStore from '~/store/useModalStore';
import useSidebarStore from '~/store/useSidebarStore';
import { cn } from '~/utils';

const Navigation = ({ path, currentRootDir }) => {
  const [setCurrentDir] = useModalStore((state) => [state.setCurrentDir]);

  const [privateItems] = useSidebarStore((state) => [state.privateItems]);

  const [publicItems] = useSidebarStore((state) => [state.publicItems]);

  const pathLength = useMemo(() => {
    return path.length;
  }, [path]);

  return (
    <>
      {/* Navigate & searching */}
      <div className="dir-action-bar dir-nav-bar">
        <Tooltip placement="top" title="Back">
          <div
            onClick={() => {
              if (pathLength < 2) return;
              if (currentRootDir) {
                const { child_items, loading, ...newCurrentDir } =
                  publicItems[path[pathLength - 2].id];
                setCurrentDir(newCurrentDir);
              } else {
                const { child_items, loading, ...newCurrentDir } =
                  privateItems[path[pathLength - 2].id];
                setCurrentDir(newCurrentDir);
              }
            }}
            className={cn(
              'action-item',
              pathLength < 2 && 'action-item--disabled'
            )}
          >
            <IoIosArrowBack className="icon-lg" />
          </div>
        </Tooltip>
        <Tooltip placement="top" title="Forward">
          <div className="action-item">
            <IoIosArrowForward className="icon-lg" />
          </div>
        </Tooltip>
        <Tooltip placement="top" title="Down to">
          <div className="action-item">
            <IoIosArrowDown className="icon-lg" />
          </div>
        </Tooltip>
        <Tooltip placement="top" title="Up to">
          <div className="action-item">
            <IoIosArrowUp className="icon-lg" />
          </div>
        </Tooltip>
        <div className="location-wrapper">
          <div className="location-input">
            <ul className="location-list">
              {path.map((item, index) => (
                <li
                  onClick={() => {
                    if (currentRootDir) {
                      const { child_items, loading, ...newCurrentDir } =
                        publicItems[item.id];
                      setCurrentDir(newCurrentDir);
                    } else {
                      const { child_items, loading, ...newCurrentDir } =
                        privateItems[item.id];
                      setCurrentDir(newCurrentDir);
                    }
                  }}
                  key={item.id}
                  className="location-item"
                >
                  {item.icon.includes('/') ? (
                    <img className="item-icon" src={item.icon} alt="" />
                  ) : (
                    <span className="item-icon">{item.icon}</span>
                  )}
                  <span className="item-name">{item.title}</span>
                  {index !== path.length - 1 && (
                    <span>
                      <IoIosArrowForward className="arrow-icon" />
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="refresh-icon">
            <MdRefresh className="icon" />
          </div>
        </div>
        <NoAnimateSearchBar
          id={`directory-search-bar`}
          // searchValue={searchValue}
          // setSearchValue={setSearchValue}
          placeholder={"Enter item's name..."}
        />
      </div>
    </>
  );
};

export default Navigation;
