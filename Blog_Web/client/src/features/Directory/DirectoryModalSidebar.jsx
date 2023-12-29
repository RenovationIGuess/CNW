import React, { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '~/utils';
import { Tooltip } from 'antd';
import ItemList from '~/components/Sidebar/ItemList';
import useSidebarStore from '~/store/useSidebarStore';
import { userStateContext } from '~/contexts/ContextProvider';
import DirectoryItem from '~/components/Sidebar/DirectoryItem';
import useModalStore from '~/store/useModalStore';

const DirectoryModalSidebar = ({ handleChooseDirectory }) => {
  const { currentUser } = userStateContext();
  const [privateItems] = useSidebarStore((state) => [state.privateItems]);
  const [publicItems] = useSidebarStore((state) => [state.publicItems]);

  const [currentDir] = useModalStore((state) => [state.currentDir]);

  const isResizingRef = useRef(false);
  const sidebarRef = useRef(null);
  const navbarRef = useRef(null);
  const [isResetting, setIsResetting] = useState(false);
  const [publicExpanded, setPublicExpanded] = useState({});
  const [privateExpanded, setPrivateExpanded] = useState({});

  useEffect(() => {
    setPrivateExpanded({
      ...privateExpanded,
      [currentUser.private_dir.id]: true,
    });
  }, []);

  // The directory modal is 75% of the screen and its centered
  const widthToBeSubtracted = useMemo(() => {
    return window.innerWidth * 0.125;
  }, [window.innerWidth]);

  const onPublicExpanded = (id) => {
    setPublicExpanded((prevExpanded) => ({
      ...prevExpanded,
      [id]: !prevExpanded[id],
    }));
  };

  const onPrivateExpand = (id) => {
    setPrivateExpanded((prevExpanded) => ({
      ...prevExpanded,
      [id]: !prevExpanded[id],
    }));
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();

    isResizingRef.current = true;
    // Mouse move use to resize
    document.addEventListener('mousemove', handleMouseMove);
    // Stop resizing
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isResizingRef.current) return;

    let newWidth = e.clientX - widthToBeSubtracted;

    if (newWidth < 240) {
      newWidth = 240;
    }

    if (newWidth > 480) {
      newWidth = 480;
    }

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty('left', `${newWidth}px`);
      navbarRef.current.style.setProperty(
        'width',
        `calc(100% - ${newWidth}px)`
      );
    }
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsResetting(true);

      sidebarRef.current.style.width = `240px`;
      navbarRef.current.style.setProperty('left', `240px`);
      navbarRef.current.style.setProperty('width', `calc(100% - 240px)`);

      setTimeout(() => setIsResetting(false), 300);
    }
  };

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          'group/sidebar w-60',
          'sidebar',
          isResetting && 'transition-all ease-in-out duration-300'
        )}
      >
        <div
          className={cn('w-full min-h-0 flex flex-col flex-1 overflow-y-auto')}
        >
          <div className="main-tools-container">
            <div className="note-container">
              <div className="option-list" data-toggle="user-note-list">
                {/* Public section */}
                <div className="option-list__wrp">
                  <div className="option-list__menu">
                    <Tooltip placement="top" title={'Directory'} arrow={false}>
                      <DirectoryItem
                        rootType={'public'}
                        isModal={true}
                        data={currentUser.public_dir}
                        active={currentDir.id === currentUser.public_dir.id}
                        onExpand={() =>
                          onPublicExpanded(currentUser.public_dir.id)
                        }
                        expanded={publicExpanded[currentUser.public_dir.id]}
                        callback={handleChooseDirectory}
                      />
                    </Tooltip>
                    {publicExpanded[currentUser.public_dir.id] && (
                      <ItemList
                        data={
                          publicItems[currentUser.public_dir.id].child_items
                        }
                        level={1}
                        rootType={'public'}
                        parentId={currentUser.public_dir.id}
                        isModal={true}
                        callback={handleChooseDirectory}
                      />
                    )}
                  </div>
                </div>

                {/* Private section */}
                <div className="option-list__wrp">
                  <div className="option-list__menu">
                    <Tooltip placement="top" title={'Directory'} arrow={false}>
                      <DirectoryItem
                        rootType={'private'}
                        isModal={true}
                        data={currentUser.private_dir}
                        active={currentDir.id === currentUser.private_dir.id}
                        onExpand={() =>
                          onPrivateExpand(currentUser.private_dir.id)
                        }
                        expanded={privateExpanded[currentUser.private_dir.id]}
                        callback={handleChooseDirectory}
                      />
                    </Tooltip>
                    {privateExpanded[currentUser.private_dir.id] && (
                      <ItemList
                        data={
                          privateItems[currentUser.private_dir.id].child_items
                        }
                        rootType={'private'}
                        level={1}
                        parentId={currentUser.private_dir.id}
                        isModal={true}
                        callback={handleChooseDirectory}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Tooltip
          placement="right"
          title={'Drag to resize | Click to reset'}
          arrow={false}
        >
          <div
            onMouseDown={handleMouseDown}
            onClick={resetWidth}
            className={cn(
              'resize-bar',
              'opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute w-1 right-0 top-0 bottom-0 z-[1]'
            )}
          ></div>
        </Tooltip>
      </aside>
      <div
        ref={navbarRef}
        className={cn(
          'absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]',
          isResetting && 'transition-all ease-in-out duration-300'
        )}
      ></div>
    </>
  );
};

export default DirectoryModalSidebar;
