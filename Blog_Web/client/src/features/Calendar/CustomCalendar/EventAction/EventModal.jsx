import { Modal } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import './EventModal.scss';
import AttachModels from '~/features/NewPost/AttachModels';
import TitleSection from './TitleSection';
import DescriptionSection from './DescriptionSection';
import PrioritySelectSection from './Priority/PrioritySelectSection';
import TimeSelectSection from './TimeSelectSection';
import BackgroundColorSection from './BackgroundColorSection';
import OtherActionsSection from './OtherActionsSection';
import axiosClient from '~/axios';
import ScheduleSection from './ScheduleSection';
import { useLocation, useParams } from 'react-router-dom';
import useCalendarStore from '~/store/useCalendarStore';
import useModalStore from '~/store/useModalStore';
import { objUtils } from '~/utils';
import { userStateContext } from '~/contexts/ContextProvider';
import { toast } from 'sonner';

const defaultEventValue = {
  title: 'New Event',
  background_color: '#657ef8',
  priority: null,
  description: '',
  start_date: '',
  end_date: '',
  repeated: false,
  pinned: false,
  schedule_ids: [],
};

const EventModal = ({ start, end }) => {
  const { id } = useParams();
  const { pathname } = useLocation();

  const { currentUser } = userStateContext();

  const [eventModalOpen, setEventModalOpen] = useCalendarStore((state) => [
    state.eventModalOpen,
    state.setEventModalOpen,
  ]);

  const [selectedEvent, setSelectedEvent] = useCalendarStore((state) => [
    state.selectedEvent,
    state.setSelectedEvent,
  ]);

  const [events, setEvents] = useCalendarStore((state) => [
    state.events,
    state.setEvents,
  ]);

  const [shownSchedules, hiddenEvents, setHiddenEvents] = useCalendarStore(
    (state) => [state.shownSchedules, state.hiddenEvents, state.setHiddenEvents]
  );

  const [setActionToast, setConfirmModalInfo, setConfirmModalOpen] =
    useModalStore((state) => [
      state.setActionToast,
      state.setConfirmModalInfo,
      state.setConfirmModalOpen,
    ]);

  const [createEventLoading, setCreateEventLoading] = useState(false);

  const [event, setEvent] = useState({
    ...defaultEventValue,
    start_date: start,
    end_date: end,
  });

  const [errors, setErrors] = useState({
    state: false,
  });

  // A flag to check if we are updating an event
  const isUpdate = useMemo(() => {
    return !objUtils.isEmptyObject(selectedEvent);
  }, [selectedEvent]);

  const selectedEventOriginal = useMemo(() => {
    return {
      title: selectedEvent.title,
      background_color: selectedEvent.background_color,
      priority: selectedEvent.priority,
      description: selectedEvent.description,
      start_date: selectedEvent.start,
      end_date: selectedEvent.end,
      repeated: false,
      pinned: selectedEvent.pinned,
      schedule_ids: selectedEvent.schedules,
    };
  }, [selectedEvent]);

  // For updating event's content
  useEffect(() => {
    if (isUpdate && eventModalOpen) {
      setEvent(selectedEventOriginal);
    } // else setEvent({ ...defaultEventValue });
  }, [selectedEventOriginal, eventModalOpen]);

  // When start or end change means that we want to create a new event
  useEffect(() => {
    setEvent({ ...defaultEventValue, start_date: start, end_date: end });
    // setSelectedEvent({});
  }, [start, end]);

  const handleCreateEvent = () => {
    setCreateEventLoading(true);
    axiosClient
      .post(`/events`, {
        ...event,
        user_id: currentUser.id,
        schedule_ids: id ? [parseInt(id)] : event.schedule_ids,
      })
      .then(({ data }) => {
        if (pathname === '/calendar') {
          // If all the schedules that contains this event is not shown, then we will add it to the
          // hidden events list
          // If it does exist a schedule that contains this event is shown, then we will add it to the
          // events list
          if (
            !shownSchedules
              .filter((s) => s.show)
              .some((schedule) => data.data.schedules.includes(schedule.id))
          ) {
            setHiddenEvents([
              ...hiddenEvents,
              {
                ...data.data,
                start: new Date(data.data.start),
                end: new Date(data.data.end),
              },
            ]);

            setActionToast({
              status: true,
              message:
                "Event created, but the schedules that it's in is not shown",
            });
          } else {
            setEvents([
              ...events,
              {
                ...data.data,
                start: new Date(data.data.start),
                end: new Date(data.data.end),
              },
            ]);

            setActionToast({
              status: true,
              message: data.message,
            });
          }
        } else {
          setEvents([
            {
              ...data.data,
              start: new Date(data.data.start),
              end: new Date(data.data.end),
            },
            ...events,
          ]);

          setActionToast({
            status: true,
            message: data.message,
          });
        }

        setEventModalOpen(false);
      })
      .catch((err) => {
        console.log(err);

        if (err.response && err.response.status === 422) {
          const responseErrors = err.response.data.message;
          const errorsObj = {
            // title: [],
            // date: [],
            // schedule: [],
            state: false, // This will tell us do we have errors or not
          };

          for (const key of Object.keys(responseErrors)) {
            if (key === 'title') {
              errorsObj.title = responseErrors[key];
              errorsObj.state = true;
            } else if (key.includes('date')) {
              errorsObj.date = [...responseErrors[key], ...errorsObj.date];
              errorsObj.state = true;
            } else if (key.includes('schedule')) {
              errorsObj.schedule = ['Please select a schedule (required).'];
              errorsObj.state = true;
            }
          }

          setErrors(errorsObj);
        }

        toast.error('Add event failed!', {
          duration: 1500,
        });
      })
      .finally(() => {
        setCreateEventLoading(false);
      });
  };

  const handleUpdateEvent = () => {
    setCreateEventLoading(true);
    axiosClient
      .patch(`/events/${selectedEvent.id}`, event)
      .then(({ data }) => {
        const newlyUpdatedEvent = {
          ...data.data,
          start: new Date(data.data.start),
          end: new Date(data.data.end),
        };

        // There is a problem that, when we change the schedules of an event,
        // If the shown schedules is not include the event's schedules, it will not be shown
        let stillShow = false;

        if (pathname === '/calendar') {
          stillShow = shownSchedules.some((schedule) => {
            // Only check for the one that is being displayed
            if (schedule.show) {
              return newlyUpdatedEvent.schedules.includes(schedule.id);
            }
            return false;
          });
        } else if (pathname === `/schedules/${id}`) {
          stillShow = newlyUpdatedEvent.schedules.includes(parseInt(id));
        }

        // If filter is true, means that the event does in the list of shown schedules
        // If then we'll update the event in the shown schedules
        // If not, we'll update the event in the hidden events list and remove it from events list
        setEvents(
          stillShow
            ? [
                ...events.filter((ev) => ev.id !== newlyUpdatedEvent.id),
                newlyUpdatedEvent,
              ]
            : events.filter((ev) => ev.id !== newlyUpdatedEvent.id)
        );

        // If the event is not in the shown schedules, we'll add it to the hidden events
        if (!stillShow && pathname === '/calendar')
          setHiddenEvents([...hiddenEvents, newlyUpdatedEvent]);

        setActionToast({
          status: true,
          message: data.message,
        });

        setEventModalOpen(false);
      })
      .catch((err) => {
        console.log(err);

        if (err.response && err.response.status === 422) {
          const responseErrors = err.response.data.message;
          const errorsObj = {
            // title: [],
            // date: [],
            // schedule: [],
            state: false, // This will tell us do we have errors or not
          };

          for (const key of Object.keys(responseErrors)) {
            if (key === 'title') {
              errorsObj.title = responseErrors[key];
              errorsObj.state = true;
            } else if (key.includes('date')) {
              errorsObj.date = [
                ...responseErrors[key],
                ...(errorsObj.date || []),
              ];
              errorsObj.state = true;
            } else if (key.includes('schedule')) {
              errorsObj.schedule = ['Please select a schedule (required).'];
              errorsObj.state = true;
            }
          }

          setErrors(errorsObj);
        }

        toast.error('Update event failed!', {
          duration: 1500,
        });
      })
      .finally(() => {
        setCreateEventLoading(false);
      });
  };

  const handleConfirm = () => {
    // If selectedEvent is not null, we are updating an event
    if (isUpdate) {
      // We only update if the user change something
      if (!objUtils.compareObj(event, selectedEventOriginal)) {
        handleUpdateEvent();
      } else setEventModalOpen(false);
    } else {
      if (!objUtils.compareObj(event, defaultEventValue)) {
        handleCreateEvent();
      } else setEventModalOpen(false);
    }
  };

  const handleCancel = () => {
    let openConfirmModal = false;

    if (isUpdate) {
      if (!objUtils.compareObj(event, selectedEventOriginal)) {
        openConfirmModal = true;
      }
    } else {
      if (!objUtils.compareObj(event, defaultEventValue)) {
        openConfirmModal = true;
      }
    }

    if (openConfirmModal) {
      setConfirmModalInfo({
        title: isUpdate ? 'Xác nhận hủy chỉnh sửa' : 'Xác nhận hủy thêm Event?',
        message: 'Những thông tin đã điền sẽ không được lưu.',
        callback: () => {
          setEventModalOpen(false);
          setConfirmModalOpen(false);
          setSelectedEvent({});
        },
      });
      setConfirmModalOpen(true);
    } else {
      setEventModalOpen(false);
    }
  };

  return (
    <Modal
      className="custom-modal"
      width={525}
      open={eventModalOpen}
      onCancel={handleCancel}
      afterClose={() => {
        setEvent({ ...defaultEventValue });
        setSelectedEvent({});
        setErrors({
          state: false,
        });
      }}
      title={isUpdate ? 'Update event' : 'Create new event'}
      centered
      footer={[
        <footer
          key={'modal-footer'}
          className="flex items-center justify-center pt-1 pb-2"
        >
          <button
            onClick={handleCancel}
            className="account-edit-btn account-edit-cancel-btn"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="account-edit-btn account-edit-confirm-btn"
          >
            {!createEventLoading ? (
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
        <TitleSection event={event} setEvent={setEvent} errors={errors} />
        <DescriptionSection event={event} setEvent={setEvent} />
        <PrioritySelectSection event={event} setEvent={setEvent} />
        {(!id || isUpdate) && (
          <ScheduleSection event={event} setEvent={setEvent} errors={errors} />
        )}
        <BackgroundColorSection event={event} setEvent={setEvent} />
        <OtherActionsSection event={event} setEvent={setEvent} />
        <TimeSelectSection event={event} setEvent={setEvent} errors={errors} />
        <AttachModels />
      </div>
    </Modal>
  );
};

export default EventModal;
