import React from 'react';
import { AiFillStar, AiOutlineGlobal, AiOutlineStar } from 'react-icons/ai';
import { BsArrow90DegRight, BsLink45Deg, BsTrash } from 'react-icons/bs';
import axiosClient from '~/axios';
import { eventUtils, stringUtils } from '~/utils';
import { useLocation, useNavigate } from 'react-router-dom';
import useNoteStore from '~/store/useNoteStore';
import useNotesStore from '~/store/useNotesStore';
import useModalStore from '~/store/useModalStore';
import useSidebarStore from '~/store/useSidebarStore';
import useCalendarStore from '~/store/useCalendarStore';
import removeFile from '~/firebase/removeFile';
import useFlashcardStore from '~/store/useFlashcardStore';

const MoreOptions = ({
  rootType = 'private',
  data,
  setPopoverOpen,
  handleStarred,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [handleDeleteItems] = useSidebarStore((state) => [
    state.handleDeleteItems,
  ]);

  const [note, setNote] = useNoteStore((state) => [state.note, state.setNote]);

  const [notes, setNotes, currentNote, setCurrentNote] = useNotesStore(
    (state) => [
      state.notes,
      state.setNotes,
      state.currentNote,
      state.setCurrentNote,
    ]
  );

  const [curSchedule] = useCalendarStore((state) => [state.curSchedule]);

  const [events, setEvents] = useCalendarStore((state) => [
    state.events,
    state.setEvents,
  ]);

  const [hiddenEvents, setHiddenEvents] = useCalendarStore((state) => [
    state.hiddenEvents,
    state.setHiddenEvents,
  ]);

  const [schedules, setSchedules] = useCalendarStore((state) => [
    state.schedules,
    state.setSchedules,
  ]);

  const [decks, setDecks] = useFlashcardStore((state) => [
    state.decks,
    state.setDecks,
  ]);

  const [setConfirmModalLoading, setConfirmModalInfo, setConfirmModalOpen] =
    useModalStore((state) => [
      state.setConfirmModalLoading,
      state.setConfirmModalInfo,
      state.setConfirmModalOpen,
    ]);

  const [setActionToast] = useModalStore((state) => [state.setActionToast]);

  const handleSidebarChanges = (data) => {
    if (rootType === 'private') {
      handleDeleteItems(data);
    } else {
      handleDeleteItems(data, false);
    }
  };

  const handleDeleteDirectory = () => {
    setConfirmModalLoading(true);
    axiosClient
      .delete(`/directories/${data.id}`)
      .then(() => {
        // Handle the case where if the user is editing a note belongs to the deleted directory
        const noteRouteRegex = /^\/note\/\d+$/;
        if (noteRouteRegex.test(location.pathname)) {
          if (note.path.some((path) => path.id === data.id)) {
            setNote({});
          }
        }

        // Handle the case where if the user is viewing the list of notes, and the notes that are being displayed belongs to the deleted directory
        const notesRouteRegex = /^\/notes\/?$/;
        if (notesRouteRegex.test(location.pathname)) {
          setNotes(
            notes.filter((n) => {
              if (n.path.some((path) => path.id === data.id)) {
                if (Object.keys(currentNote).length > 0) {
                  if (n.id === currentNote.id) {
                    setCurrentNote({});
                  }
                }
                return false;
              }
              return true;
            })
          );
        }

        // Handle the case where if the user is viewing the schedule belongs to the deleted directory
        const scheduleRouteRegex = /^\/schedule\/\d+$/;
        if (scheduleRouteRegex.test(location.pathname)) {
          if (curSchedule.path.some((path) => path.id === data.id)) {
            navigate('/calendar');
          }
        }

        // Handle the case where if the user is viewing the calendar and there are schedules that belongs to the deleted directory
        const calendarRouteRegex = /^\/calendar\/?$/;
        if (calendarRouteRegex.test(location.pathname)) {
          // This has opacity of O(n * (m + l)) => needs fix
          let newEvents = [...events];
          let newHiddenEvents = [...hiddenEvents];

          setSchedules(
            schedules.filter((s) => {
              if (!s.path.some((path) => path.id === data.id)) return true;

              newEvents = eventUtils.filterEvents(newEvents, s.id);
              newHiddenEvents = eventUtils.filterEvents(newHiddenEvents, s.id);

              return false;
            })
          );

          setEvents(newEvents);
          setHiddenEvents(newHiddenEvents);
        }

        // Handle the case if user is in the decks route
        const decksRouteRegex = /^\/decks\/?$/;
        if (decksRouteRegex.test(location.pathname)) {
          setDecks(
            decks.filter((deck) => {
              if (deck.path.some((path) => path.id === data.id)) {
                return false;
              }
              return true;
            })
          );
        }

        // Handle sidebar
        handleSidebarChanges(data);

        setActionToast({
          status: true,
          message: 'Deleted',
        });

        setConfirmModalLoading(false);
        setTimeout(() => {
          setConfirmModalOpen(false);
        }, 0);
      })
      .catch((err) => console.error(err));
  };

  const handleDeleteNote = () => {
    setConfirmModalLoading(true);
    axiosClient
      .delete(`/notes/${data.id}`)
      .then(() => {
        // Handle sidebar
        handleSidebarChanges(data);

        removeFile(data.background_image);

        // If the user is editing the note and deleted it => set the Note.jsx to blank
        if (location.pathname === `/notes/${data.id}`) {
          setNote({});

          // Handle the case where the histories of the note containing uploaded files
        }

        if (location.pathname === '/notes') {
          setNotes(notes.filter((n) => n.id !== data.id));

          if (Object.keys(currentNote).length > 0) {
            if (data.id === currentNote.id) {
              setCurrentNote({});
            }
          }
        }

        setActionToast({
          status: true,
          message: 'Deleted',
        });

        setConfirmModalLoading(false);
        setTimeout(() => {
          setConfirmModalOpen(false);
        }, 0);
      })
      .catch((err) => {
        console.log(err);
      });

    // We have to change the content of the Note.jsx page
    // if we're edit the deleted note
  };

  const handleDeleteSchedule = () => {
    setConfirmModalLoading(true);
    removeFile(data.background_image);

    axiosClient
      .delete(`/schedules/${data.id}`)
      .then(() => {
        // Handle sidebar
        handleSidebarChanges(data);

        if (location.pathname === '/calendar') {
          setSchedules(schedules.filter((s) => s.id !== data.id));

          setEvents(
            events.filter((e) => {
              if (e.schedules.length === 1 && e.schedules[0] === data.id) {
                return false;
              } else if (e.schedules.includes(data.id)) {
                e.schedules = e.schedules.filter((s) => s !== data.id);
              }
              return true;
            })
          );

          setHiddenEvents(
            hiddenEvents.filter((e) => {
              if (e.schedules.length === 1 && e.schedules[0] === data.id) {
                return false;
              } else if (e.schedules.includes(data.id)) {
                e.schedules = e.schedules.filter((s) => s !== data.id);
              }
              return true;
            })
          );
        }

        setActionToast({
          status: true,
          message: 'Deleted',
        });

        setConfirmModalLoading(false);
        setTimeout(() => {
          setConfirmModalOpen(false);
        }, 0);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (location.pathname === `/schedules/${data.id}`) {
          navigate('/calendar');
        }
      });
  };

  const handleDeleteDeck = () => {
    setConfirmModalLoading(true);
    axiosClient
      .delete(`/decks/${data.id}`)
      .then(({}) => {
        setDecks(decks.filter((deck) => deck.id !== data.id));

        handleSidebarChanges(data);

        setActionToast({
          status: true,
          message: 'Deleted',
        });
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setConfirmModalLoading(false);
        setTimeout(() => {
          setConfirmModalOpen(false);
        }, 0);
      });
  };

  return (
    <div className="action-menu">
      <div className="action-menu__title">Other options</div>
      <ul className="action-menu__list">
        <li
          onClick={(e) => {
            e.stopPropagation();
            setPopoverOpen(false);
            setConfirmModalOpen(true);
            setConfirmModalInfo({
              title: `Xác nhận xóa ${data.data_type}?`,
              message: `Sau khi xóa, ${stringUtils.uppercaseStr(
                data.data_type
              )} sẽ ở trong thùng rác, bạn có thể vào mục "Thùng rác" để hoàn tác hoặc xóa vĩnh viễn`,
              callback: () => {
                data.data_type === 'note' && handleDeleteNote();
                data.data_type === 'directory' && handleDeleteDirectory();
                data.data_type === 'schedule' && handleDeleteSchedule();
                data.data_type === 'deck' && handleDeleteDeck();
              },
            });
          }}
          className="action-menu__item"
        >
          <BsTrash className="action-menu__icon" />
          <span className="action-menu__label">Delete {data.data_type}</span>
        </li>
        {data.data_type !== 'directory' && (
          <li
            onClick={(e) => {
              handleStarred(e);
            }}
            className="action-menu__item"
          >
            {data.starred ? (
              <>
                <AiFillStar className="action-menu__icon" />
                <span className="action-menu__label">Remove from starred</span>
              </>
            ) : (
              <>
                <AiOutlineStar className="action-menu__icon" />
                <span className="action-menu__label">Add to starred</span>
              </>
            )}
          </li>
        )}
        {data.data_type !== 'directory' && (
          <li onClick={() => {}} className="action-menu__item">
            <BsLink45Deg className="action-menu__icon" />
            <span className="action-menu__label">Copy link</span>
          </li>
        )}
        {data.data_type !== 'directory' && (
          <li onClick={() => {}} className="action-menu__item">
            <AiOutlineGlobal className="action-menu__icon" />
            <span className="action-menu__label">Copy link to original</span>
          </li>
        )}
        <li onClick={() => {}} className="action-menu__item">
          <BsArrow90DegRight className="action-menu__icon" />
          <span className="action-menu__label">Refactor</span>
        </li>
        {/* )} */}
      </ul>
    </div>
  );
};

export default MoreOptions;
