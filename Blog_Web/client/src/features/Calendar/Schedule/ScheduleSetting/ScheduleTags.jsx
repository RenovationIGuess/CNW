import { Tooltip } from 'antd';
import React, { useState } from 'react';
import { AiOutlineInfoCircle, AiOutlineTags } from 'react-icons/ai';
import axiosClient from '~/axios';
import ModifyTagModal from '~/features/Tag/ModifyTagModal';
import Tag from '~/features/Tag/Tag';
import useCalendarStore from '~/store/useCalendarStore';
import useModalStore from '~/store/useModalStore';

const ScheduleTags = () => {
  // Tags modal control state
  const [tagModalOpen, setTagModalOpen] = useState(false);

  const [curSchedule, setCurSchedule] = useCalendarStore((state) => [
    state.curSchedule,
    state.setCurSchedule,
  ]);

  const [updateScheduleLoading, setUpdateScheduleLoading] = useCalendarStore(
    (state) => [state.updateScheduleLoading, state.setUpdateScheduleLoading]
  );

  const [setActionToast] = useModalStore((state) => [state.setActionToast]);

  return (
    <>
      <div className="schedule-info__wrapper">
        <div className="info-wrapper__header">
          <AiOutlineTags className="info-icon" />
          <div className="flex items-center">
            <p className="info-label">Tags</p>
            <div className="copyright-settings-title">
              <Tooltip
                title={'To edit the tag, click see more'}
                placement="top"
              >
                <AiOutlineInfoCircle className="icon" />
              </Tooltip>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-[6px] mb-2">
          {curSchedule.tags.length > 0 ? (
            curSchedule.tags.map((tag) => <Tag key={tag.id} tag={tag} />)
          ) : (
            <>
              <p className="no-item">This schedule has no tag attached ~</p>
            </>
          )}
        </div>
        <div
          onClick={() => setTagModalOpen(true)}
          className="side-section__more text-sm"
        >
          See more
        </div>
      </div>

      <ModifyTagModal
        dataType={curSchedule.data_type}
        itemId={curSchedule.id}
        itemTags={curSchedule.tags}
        tagModalOpen={tagModalOpen}
        setTagModalOpen={setTagModalOpen}
        callback={(selectedTags) => {
          setUpdateScheduleLoading(true);
          axiosClient
            .patch(`/schedules/${curSchedule.id}/tags`, {
              tag_ids: selectedTags.map((tag) => tag.id),
            })
            .then(({ data }) => {
              setCurSchedule(data.data);

              setActionToast({
                status: true,
                message: 'Updated',
              });

              setUpdateScheduleLoading(false);
            })
            .catch((err) => console.error(err));
        }}
        callbackLoading={updateScheduleLoading}
      />
    </>
  );
};

export default ScheduleTags;
