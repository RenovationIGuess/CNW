import React, { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '~/utils';
import IconSelector from '../IconSelector/IconSelector';
import { Popover } from 'antd';
import { HiDotsHorizontal, HiPlus } from 'react-icons/hi';
import MoreOptions from './MoreOptions';
import AddOptions from './AddOptions';
import { IoIosArrowForward } from 'react-icons/io';
import useModalStore from '~/store/useModalStore';
import useSidebarStore from '~/store/useSidebarStore';
import axiosClient from '~/axios';
import { useDrag } from 'react-dnd';

// rootDir and additional are used to create the data-v attribute for query elements
// isModal is use to check if this sidebar is in the directory modal or not
// active is use to check if this item is being selected
// data - data of the item - could be note, directory, calendar, flashcards
// disableAction - use to disable the more options when use in DirectoryModal
const DirectoryItem = ({
  rootType,
  data,
  isModal = false,
  level,
  active = false,
  disableAction,
  onExpand,
  expanded,
  callback = () => {},
}) => {
  const [privateItems] = useSidebarStore((state) => [state.privateItems]);

  const [publicItems] = useSidebarStore((state) => [state.publicItems]);

  const [handleUpdateItems] = useSidebarStore((state) => [
    state.handleUpdateItems,
  ]);

  const [setActionToast] = useModalStore((state) => [state.setActionToast]);

  const [addOptionOpen, setAddOptionOpen] = useState(false);
  const [moreOptionsOpen, setMoreOptionsOpen] = useState(false);
  const [iconChangeOpen, setIconChangeOpen] = useState(false);

  // const elementHeaderRef = useRef(null);
  const arrowParentRef = useRef(null);
  const dataRef = useRef();

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const [{ isDragging }, drag] = useDrag(() => ({
    item: { ...data, getData: () => dataRef.current },
    type: data.data_type,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleClickExpand = (event, addItem = false) => {
    event.stopPropagation();

    // If we are not performing addItem action, toggle like normal
    // If we do addItem, we will not toggle the expanded state if its opening
    if (!addItem || !expanded) onExpand();
  };

  const handleChangeIcon = (icon) => {
    // We can change the position of this setPopoverOpen when we're done with the UI/UX
    setIconChangeOpen(false);
    const url = `/directories/${data.id}`;

    axiosClient
      .patch(url, {
        ...data,
        icon: icon,
      })
      .then(({ data }) => {
        const newData = data.data;

        if (rootType === 'public') {
          handleUpdateItems(newData, false);
        } else {
          handleUpdateItems(newData);
        }

        setActionToast({
          status: true,
          message: 'Updated',
        });
      })
      .catch((err) => console.error(err));
  };

  return (
    <div
      ref={drag}
      className={cn(
        `elements-header`,
        isDragging && 'elements-header--active cursor-move',
        isModal && active && 'elements-header--active'
      )}
      // ref={elementHeaderRef}
      onClick={(e) => {
        if (isModal) {
          // If its in dir modal & we click => get its children but not opening in sidebar
          callback(data);
        } else {
          handleClickExpand(e);
        }
      }}
      onDoubleClick={(e) => {
        isModal && handleClickExpand(e);
      }}
      style={{ paddingLeft: `${level * 24 + 4}px` }}
    >
      <div className={`flex items-center overflow-hidden`}>
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleClickExpand(e);
          }}
          className={cn(
            'elements-arrow-icon--wrp',
            expanded && 'rotate-icon__animate',
            rootType === 'private' &&
              privateItems[data.id]?.loading &&
              'pointer-events-none',
            rootType === 'public' &&
              publicItems[data.id]?.loading &&
              'pointer-events-none'
          )}
          ref={arrowParentRef}
        >
          {rootType === 'private' ? (
            privateItems[data.id]?.loading ? (
              <div className="my-loader"></div>
            ) : (
              <IoIosArrowForward
                className="elements-arrow-icon"
                // data-v={`${data.data_type}-${data.id}--arrow`}
              />
            )
          ) : publicItems[data.id]?.loading ? (
            <div className="my-loader"></div>
          ) : (
            <IoIosArrowForward
              className="elements-arrow-icon"
              // data-v={`${data.data_type}-${data.id}--arrow`}
            />
          )}
        </div>

        <Popover
          rootClassName="custom-popover"
          trigger="click"
          placement="bottomLeft"
          arrow={false}
          content={<IconSelector callback={handleChangeIcon} />}
          open={iconChangeOpen}
          onOpenChange={() => setIconChangeOpen(!iconChangeOpen)}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              setIconChangeOpen(!iconChangeOpen);
            }}
            className="sidebar-element-icon__wrp"
          >
            {data.icon.includes('/') ? (
              <img src={data.icon} alt="item-icon" />
            ) : (
              <p>{data.icon}</p>
            )}
          </div>
        </Popover>
        <div className="teamspace-header__title">{data.title}</div>
      </div>
      <div className="flex items-center">
        {!disableAction && (
          <Popover
            rootClassName="custom-popover"
            trigger={'click'}
            placement="bottomLeft"
            content={
              <MoreOptions
                rootType={rootType}
                data={data}
                setPopoverOpen={setMoreOptionsOpen}
              />
            }
            open={moreOptionsOpen}
            onOpenChange={() => setMoreOptionsOpen(!moreOptionsOpen)}
          >
            <HiDotsHorizontal
              onClick={(e) => e.stopPropagation()}
              className="list-header__icon"
            />
          </Popover>
        )}
        <Popover
          rootClassName="custom-popover"
          trigger={'click'}
          placement="bottomLeft"
          content={
            <AddOptions
              rootType={rootType}
              directoryId={data.id}
              setPopoverOpen={setAddOptionOpen}
              handleClickExpand={handleClickExpand}
            />
          }
          open={addOptionOpen}
          onOpenChange={() => setAddOptionOpen(!addOptionOpen)}
        >
          <HiPlus
            onClick={(e) => e.stopPropagation()}
            className="list-header__icon"
          />
        </Popover>
      </div>
    </div>
  );
};

export default DirectoryItem;
