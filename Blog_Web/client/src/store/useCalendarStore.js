// Use to control calendar's state for Calendar.jsx page
import { create } from 'zustand';
import { Views } from 'react-big-calendar';
import axiosClient from '~/axios';

const useCalendarStore = create((set) => ({
  calendarKey: 0,
  setCalendarKey: (calendarKey) => set({ calendarKey }),

  view: Views.MONTH,
  setView: (view) => set({ view }),

  date: new Date(),
  setDate: (date) => set({ date }),

  scheduleDetailOpen: false,
  setScheduleDetailOpen: (scheduleDetailOpen) => set({ scheduleDetailOpen }),

  subCalendarClosed: false,
  setSubCalendarClosed: (subCalendarClosed) => set({ subCalendarClosed }),

  curSchedule: {},
  setCurSchedule: (curSchedule) => set({ curSchedule }),

  eventModalOpen: false,
  setEventModalOpen: (eventModalOpen) => set({ eventModalOpen }),

  selectedEvent: {},
  setSelectedEvent: (selectedEvent) => set({ selectedEvent }),

  events: [],
  setEvents: (events) => set({ events }),

  updateScheduleLoading: false,
  setUpdateScheduleLoading: (updateScheduleLoading) =>
    set({ updateScheduleLoading }),

  updateSchedule: (schedule) => {
    set({ updateScheduleLoading: true });
    axiosClient
      .patch(`/schedules/${schedule.id}`, schedule)
      // .then(({ data }) => {
      //   set({ curSchedule: data.data.schedule });
      // })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        set({ updateScheduleLoading: false });
      });
  },

  deleteScheduleLoading: false,
  setDeleteScheduleLoading: (deleteScheduleLoading) =>
    set({ deleteScheduleLoading }),

  isLoadingSchedule: true,
  setIsLoadingSchedule: (isLoadingSchedule) => set({ isLoadingSchedule }),

  schedules: [],
  setSchedules: (schedules) => set({ schedules }),

  fetchSchedules: () => {
    set({ isLoadingSchedule: true });
    axiosClient
      .get(`/schedules`)
      .then(({ data }) => {
        set({ schedules: data.data.schedules });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        set({ isLoadingSchedule: false });
      });
  },

  shownSchedules: [],
  setShownSchedules: (shownSchedules) => set({ shownSchedules }),

  hiddenEvents: [],
  setHiddenEvents: (hiddenEvents) => set({ hiddenEvents }),
}));

export default useCalendarStore;
