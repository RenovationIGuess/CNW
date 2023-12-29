import { Tooltip } from 'antd';
import React, { useMemo } from 'react';
import { MdKeyboardDoubleArrowRight } from 'react-icons/md';
import useCalendarStore from '~/store/useCalendarStore';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { userStateContext } from '~/contexts/ContextProvider';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import axiosClient from '~/axios';
import useSidebarStore from '~/store/useSidebarStore';
import useModalStore from '~/store/useModalStore';

dayjs.extend(relativeTime);

const Header = () => {
  const { currentUser } = userStateContext();

  const [curSchedule, setCurSchedule] = useCalendarStore((state) => [
    state.curSchedule,
    state.setCurSchedule,
  ]);

  const [handleUpdateItems] = useSidebarStore((state) => [
    state.handleUpdateItems,
  ]);

  const [updateScheduleLoading] = useCalendarStore((state) => [
    state.updateScheduleLoading,
  ]);

  const [setScheduleDetailOpen] = useCalendarStore((state) => [
    state.setScheduleDetailOpen,
  ]);

  const [setActionToast] = useModalStore((state) => [state.setActionToast]);

  // True => private and vice versa
  const rootType = useMemo(() => {
    if (!curSchedule) return;
    return curSchedule.path[0].title === 'Private';
  }, [curSchedule]);

  const handleStarredSchedule = () => {
    axiosClient
      .patch(`/schedules/${curSchedule.id}`, {
        ...curSchedule,
        starred: !curSchedule.starred,
      })
      .then(({ data }) => {
        const newSchedule = data.data;

        setCurSchedule(newSchedule);

        if (rootType) {
          handleUpdateItems(newSchedule);
        } else {
          handleUpdateItems(newSchedule, false);
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
    <div className="schedule-setting__header">
      <div className="flex items-center gap-1">
        <Tooltip placement="bottom" title={'Minimize'}>
          <div
            className="minimize-btn"
            onClick={() => setScheduleDetailOpen(false)}
          >
            <MdKeyboardDoubleArrowRight className="minimize-btn__icon" />
          </div>
        </Tooltip>
        <Tooltip placement="bottom" title={'Starred this schedule'}>
          <div className="minimize-btn" onClick={() => handleStarredSchedule()}>
            {curSchedule.starred ? (
              <AiFillStar className="minimize-btn__icon" />
            ) : (
              <AiOutlineStar className="minimize-btn__icon" />
            )}
          </div>
        </Tooltip>
      </div>

      <div className="flex items-center gap-[10px]">
        {updateScheduleLoading ? (
          <>
            <div className="my-loader update-loader"></div>
            <p className="last-edited__title">Updating...</p>
          </>
        ) : (
          <Tooltip
            placement="bottomLeft"
            title={
              <>
                <p className="edited-tooltip__content mb-[2px]">
                  Created by{' '}
                  <span className="text-white">{currentUser.profile.name}</span>{' '}
                  {dayjs(curSchedule.created_at).fromNow()}
                </p>
                <p className="edited-tooltip__content">
                  Updated by{' '}
                  <span className="text-white">{currentUser.profile.name}</span>{' '}
                  {dayjs(curSchedule.updated_at).fromNow()}
                </p>
              </>
            }
          >
            <p className="last-edited__title">
              Edited {dayjs(curSchedule.updated_at).fromNow()}
            </p>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default Header;
