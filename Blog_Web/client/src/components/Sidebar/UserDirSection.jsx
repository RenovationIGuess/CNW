import { Popover, Tooltip } from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import { AiFillFolderOpen } from 'react-icons/ai';
import AddOptions from './AddOptions';
import { HiPlus } from 'react-icons/hi';
import { userStateContext } from '~/contexts/ContextProvider';
import ItemList from './ItemList';
import useSidebarStore from '~/store/useSidebarStore';
import useModalStore from '~/store/useModalStore';
import { stringUtils } from '~/utils';

// type: private | public
const UserDirSection = ({ type }) => {
  const { currentUser } = userStateContext();
  const [privateItems] = useSidebarStore((state) => [state.privateItems]);
  const [publicItems] = useSidebarStore((state) => [state.publicItems]);

  const [setDirectoryModalOpen, setDirModalUseType] = useModalStore((state) => [
    state.setDirectoryModalOpen,
    state.setDirModalUseType,
  ]);

  const [addOptionOpen, setAddOptionOpen] = useState(false);

  const ref = useRef(null);

  // const rootDirKey = useMemo(() => {
  //   return Object.keys(privateItems)[0];
  // }, [privateItems]);

  return (
    <>
      <div className="option-list__header">
        <div
          className="list-header__title"
          onClick={() => {
            if (ref.current) {
              ref.current.classList.toggle('closed');
            }
          }}
        >
          {stringUtils.uppercaseStr(type)}
        </div>
        <div className="flex items-center gap-[4px]">
          <Tooltip placement="top" title="View detail">
            <AiFillFolderOpen
              onClick={() => {
                setDirModalUseType('locate');
                setDirectoryModalOpen(true);
              }}
              className="list-header__icon"
            />
          </Tooltip>
          <Popover
            rootClassName="custom-popover"
            trigger={'click'}
            placement="bottomLeft"
            content={
              <AddOptions
                rootType={type}
                directoryId={
                  type === 'private'
                    ? currentUser.private_dir.id
                    : currentUser.public_dir.id
                }
                rootDir={true}
                setPopoverOpen={setAddOptionOpen}
              />
            }
            open={addOptionOpen}
            onOpenChange={() => setAddOptionOpen(!addOptionOpen)}
          >
            <HiPlus className="list-header__icon" />
          </Popover>
        </div>
      </div>
      <div className="option-list__menu" ref={ref}>
        <ItemList
          rootType={type}
          data={
            type === 'public'
              ? publicItems[currentUser.public_dir.id].child_items
              : privateItems[currentUser.private_dir.id].child_items
          }
        />
      </div>
    </>
  );
};

export default UserDirSection;
