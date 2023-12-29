import { Modal } from 'antd';
import React, { useState } from 'react';
import InputSection from '../../../components/Modal/InputSection';
import BackgroundImageSection from './BackgroundImageSection';
import AttachTagsSection from '../../../components/Modal/AttachTagsSection';
import IconSection from '../../../components/Modal/IconSection';
import axiosClient from '~/axios';
import { userStateContext } from '~/contexts/ContextProvider';
import useModalStore from '~/store/useModalStore';
import useCalendarStore from '~/store/useCalendarStore';
import useSidebarStore from '~/store/useSidebarStore';
import removeFile from '~/firebase/removeFile';
import { toast } from 'sonner';
import ChooseLocation from '~/components/Modal/ChooseLocation';

const defaultScheduleValue = {
  title: 'New Schedule',
  icon: import.meta.env.VITE_DEFAULT_CALENDAR_ICON_URL,
  background_image: '',
  description: '',
};

// This modal use for create & edit
const ScheduleModal = ({ open, setOpen, type }) => {
  const { currentUser } = userStateContext();

  const [setActionToast] = useModalStore((state) => [state.setActionToast]);
  const [setSelectedPath] = useModalStore((state) => [state.setSelectedPath]);

  const [schedules, setSchedules, shownSchedules, setShownSchedules] =
    useCalendarStore((state) => [
      state.schedules,
      state.setSchedules,
      state.shownSchedules,
      state.setShownSchedules,
    ]);

  const [schedule, setSchedule] = useState({ ...defaultScheduleValue });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [createScheduleLoading, setCreateScheduleLoading] = useState(false);
  const [errors, setErrors] = useState({ state: false });

  const [handleAddItemWithParentId] = useSidebarStore((state) => [
    state.handleAddItemWithParentId,
  ]);

  const handleConfirm = () => {
    setCreateScheduleLoading(true);

    axiosClient
      .post(`/schedules`, {
        ...schedule,
        user_id: currentUser.id,
        directory_id: schedule.directory_id ?? currentUser.private_dir.id,
        tag_ids: selectedTags.map((tag) => tag.id),
      })
      .then(({ data }) => {
        const newData = data.data;
        const parentId = newData.directory_id;

        handleAddItemWithParentId(newData, parentId);

        setSchedules([data.data, ...schedules]);

        setShownSchedules([
          { id: data.data.id, show: true },
          ...shownSchedules,
        ]);

        setActionToast({
          status: true,
          message: data.message,
        });

        setOpen(false);
      })
      .catch((err) => {
        console.error(err);

        if (err.response && err.response.status === 422) {
          const responseErrors = err.response.data.message;
          const errorsObj = {
            // title: [],
            state: false, // This will tell us do we have errors or not
          };

          for (const key of Object.keys(responseErrors)) {
            if (key === 'title') {
              errorsObj.title = responseErrors[key];
              errorsObj.state = true;
            } else continue;
          }

          setErrors(errorsObj);
        }

        toast.error('Add schedule failed!', {
          duration: 1500,
        });
      })
      .finally(() => {
        setCreateScheduleLoading(false);
      });
  };

  return (
    <Modal
      className="custom-modal"
      width={525}
      open={open}
      centered
      onCancel={() => {
        setOpen(false);

        // If user cancel => remove the uploaded file
        if (schedule.background_image) {
          removeFile(schedule.background_image);
        }
      }}
      title={type === 'edit' ? 'Edit schedule' : 'Create new schedule'}
      afterClose={() => {
        setUploadedFile(null);
        setSchedule({ ...defaultScheduleValue });
        setSelectedTags([]);
        setSelectedPath([]); // Reset selected path
        setErrors({
          state: false,
        });
      }}
      footer={[
        <footer
          key={'modal-footer'}
          className="flex items-center justify-center pt-1 pb-2"
        >
          <button
            onClick={() => setOpen(false)}
            className="account-edit-btn account-edit-cancel-btn"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="account-edit-btn account-edit-confirm-btn"
          >
            {!createScheduleLoading ? (
              <>Confirm</>
            ) : (
              <>
                <span className="my-loader account-bg-loader"></span>
                Loading...
              </>
            )}
          </button>
        </footer>,
      ]}
      mask={true}
      maskClosable={true}
    >
      <div className="edit-tag-container modal-container">
        <BackgroundImageSection
          schedule={schedule}
          setSchedule={setSchedule}
          uploadedFile={uploadedFile}
          setUploadedFile={setUploadedFile}
        />
        <IconSection
          title={'Schedule Icon'}
          item={schedule}
          setItem={setSchedule}
        />
        <InputSection
          item={schedule}
          setItem={setSchedule}
          title={'Schedule Title'}
          maxLength={48}
          field={'title'}
          placeholder={'Please enter title (required)'}
          errors={errors}
        />
        <InputSection
          item={schedule}
          setItem={setSchedule}
          title={'Schedule Description'}
          maxLength={100}
          field={'description'}
          placeholder={'Description...'}
          errors={errors}
        />
        <ChooseLocation
          title={'Choose location'}
          desc={'Choose Location'}
          item={schedule}
          setItem={setSchedule}
        />
        <AttachTagsSection
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
        />
      </div>
    </Modal>
  );
};

export default ScheduleModal;
