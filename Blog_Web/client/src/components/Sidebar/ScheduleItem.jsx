import React, { useEffect, useRef, useState } from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { cn } from '~/utils';
import IconSelector from '../IconSelector/IconSelector';
import { Popover } from 'antd';
import { HiDotsHorizontal } from 'react-icons/hi';
import MoreOptions from './MoreOptions';
import { useLocation, useNavigate } from 'react-router-dom';
import useCalendarStore from '~/store/useCalendarStore';
import useModalStore from '~/store/useModalStore';
import useSidebarStore from '~/store/useSidebarStore';
import axiosClient from '~/axios';
import { useDrag } from 'react-dnd';

// isModal is use to check if this sidebar is in the directory modal or not
// active is use to check if this item is being selected
// data - data of the item - could be note, directory, calendar, flashcards
// disableAction - use to disable the more options when use in DirectoryModal
const ScheduleItem = ({
  rootType,
  data,
  isModal,
  level,
  active,
  disableAction,
}) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const dataRef = useRef();

  const [handleUpdateItems] = useSidebarStore((state) => [
    state.handleUpdateItems,
  ]);

  const [curSchedule, setCurSchedule] = useCalendarStore((state) => [
    state.curSchedule,
    state.setCurSchedule,
  ]);

  const [schedules, setSchedules] = useCalendarStore((state) => [
    state.schedules,
    state.setSchedules,
  ]);

  const [setActionToast] = useModalStore((state) => [state.setActionToast]);

  const [moreOptionsOpen, setMoreOptionsOpen] = useState(false);
  const [iconChangeOpen, setIconChangeOpen] = useState(false);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const [{ isDragging }, drag] = useDrag(() => ({
    item: { id: data.id, getData: () => dataRef.current },
    type: data.data_type,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleChangeIcon = (icon) => {
    // We can change the position of this setPopoverOpen when we're done with the UI/UX
    setIconChangeOpen(false);

    const url = `/schedules/${data.id}`;
    axiosClient
      .patch(url, {
        ...data,
        icon: icon,
      })
      .then(({ data }) => {
        const newData = data.data;

        if (rootType === 'private') {
          handleUpdateItems(newData);
        } else {
          handleUpdateItems(newData, false);
        }

        // If the edit item is the schedule that user is editing => updated the schedule
        if (
          location.pathname === `/schedules/${newData.id}` &&
          newData.data_type === 'schedule'
        ) {
          setCurSchedule({
            ...curSchedule,
            icon: icon,
          });
        }

        if (
          location.pathname === '/calendar' &&
          newData.data_type === 'schedule'
        ) {
          setSchedules(
            schedules.map((item) => {
              if (item.id === newData.id)
                return {
                  ...item,
                  icon: icon,
                };
              return item;
            })
          );
        }

        setActionToast({
          status: true,
          message: 'Updated',
        });
      })
      .catch((err) => console.error(err));
  };

  const handleStarredSchedule = async (e) => {
    e.stopPropagation();
    axiosClient
      .patch(`/schedules/${data.id}`, {
        ...data,
        starred: !data.starred,
      })
      .then(({ data }) => {
        const newData = data.data;

        if (rootType === 'private') {
          handleUpdateItems(newData);
        } else {
          handleUpdateItems(newData, false);
        }

        // If the user is editing the schedule
        if (pathname === `/schedules/${data.data.id}`) {
          setCurSchedule({
            ...curSchedule,
            starred: newData.starred,
          });
        }

        setActionToast({
          status: true,
          message: 'Updated',
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div
      ref={drag}
      className={cn(
        `elements-header`,
        isDragging && 'elements-header--active cursor-move',
        active && 'elements-header--active'
      )}
      onClick={() => {
        if (isModal) {
        } else {
          navigate(`/schedules/${data.id}`);
        }
      }}
      style={{ paddingLeft: `${level * 24 + 4}px` }}
    >
      <div className={`flex items-center overflow-hidden`}>
        <div
          onClick={(e) => handleStarredSchedule(e)}
          className="elements-arrow-icon--wrp"
        >
          {data.starred ? (
            <AiFillStar className="elements-arrow-icon" />
          ) : (
            <AiOutlineStar className="elements-arrow-icon" />
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
                handleStarred={handleStarredSchedule}
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
      </div>
    </div>
  );
};

export default ScheduleItem;
