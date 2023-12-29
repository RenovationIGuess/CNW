import React from 'react';
import { AiFillCalendar, AiFillFileAdd, AiFillFolderAdd } from 'react-icons/ai';
import axiosClient from '~/axios';
import { useLocation } from 'react-router-dom';
import { userStateContext } from '~/contexts/ContextProvider';
import useNotesStore from '~/store/useNotesStore';
import useSidebarStore from '~/store/useSidebarStore';
import useCalendarStore from '~/store/useCalendarStore';
import useModalStore from '~/store/useModalStore';
import { GiCardExchange } from 'react-icons/gi';
import useFlashcardStore from '~/store/useFlashcardStore';

const AddOptions = ({
  directoryId,
  rootDir = false,
  rootType = 'private',
  setPopoverOpen,
  handleClickExpand,
}) => {
  // const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = userStateContext();

  const [notes, setNotes, setCurrentNote] = useNotesStore((state) => [
    state.notes,
    state.setNotes,
    state.setCurrentNote,
  ]);

  const [schedules, setSchedules] = useCalendarStore((state) => [
    state.schedules,
    state.setSchedules,
  ]);

  const [shownSchedules, setShownSchedules] = useCalendarStore((state) => [
    state.shownSchedules,
    state.setShownSchedules,
  ]);

  const [decks, setDecks] = useFlashcardStore((state) => [
    state.decks,
    state.setDecks,
  ]);

  const [setItemsLoading, handleAddItems] = useSidebarStore((state) => [
    state.setItemsLoading,
    state.handleAddItems,
  ]);

  const [setActionToast] = useModalStore((state) => [state.setActionToast]);

  const createNewDirectory = (e) => {
    // Turn on loading state
    if (rootType === 'public') {
      setItemsLoading(directoryId, false);
    } else {
      setItemsLoading(directoryId);
    }

    axiosClient
      .post(`/directories`, {
        user_id: currentUser.id,
        directory_id: directoryId,
        title: 'New Directory',
        icon: import.meta.env.VITE_DEFAULT_DIR_ICON_URL,
      })
      .then(({ data }) => {
        const newDir = data.data;

        if (!rootDir) {
          handleClickExpand?.(e, true);
        }

        if (rootType === 'public') {
          handleAddItems(newDir, false);
        } else {
          handleAddItems(newDir);
        }

        setActionToast({
          status: true,
          message: 'Created',
        });
      })
      .catch((err) => console.error(err));
  };

  const createNewNote = (e) => {
    // Turn on loading state
    if (rootType === 'public') {
      setItemsLoading(directoryId, false);
    } else {
      setItemsLoading(directoryId);
    }

    axiosClient
      .post(`/notes`, {
        user_id: currentUser.id,
        directory_id: directoryId,
        title: 'New note',
        description: 'Chưa có',
        background_image: import.meta.env.VITE_DEFAULT_NOTE_BACKGROUND_URL,
        icon: import.meta.env.VITE_DEFAULT_NOTE_ICON_URL,
        content_html: '',
        content_json: '',
        starred: false,
      })
      .then(({ data }) => {
        const newNote = data.data;

        if (!rootDir) {
          handleClickExpand?.(e, true);
        }

        if (rootType === 'public') {
          handleAddItems(newNote, false);
        } else {
          handleAddItems(newNote);
        }

        // To the detail page of that note
        // navigate(`/notes/${data.data.id}`);

        if (location.pathname === '/notes') {
          let newNotes;
          if (notes.length % 10 === 0) {
            newNotes = [data.data, ...notes.slice(0, notes.length - 1)];
          } else {
            newNotes = [data.data, ...notes];
          }
          setNotes(newNotes);
          setCurrentNote(data.data);
        }

        setActionToast({
          status: true,
          message: 'Created',
        });
      })
      .catch((err) => console.error(err));
  };

  const createNewSchedule = (e) => {
    // Turn on loading state
    if (rootType === 'public') {
      setItemsLoading(directoryId, false);
    } else {
      setItemsLoading(directoryId);
    }

    const newSchedule = {
      title: 'New Schedule',
      icon: import.meta.env.VITE_DEFAULT_CALENDAR_ICON_URL,
      background_image: '',
      description: '',
      user_id: currentUser.id,
      directory_id: directoryId,
      tag_ids: [],
    };

    axiosClient
      .post(`/schedules`, newSchedule)
      .then(({ data }) => {
        // console.log(data.data);
        const newSchedule = data.data;

        if (!rootDir) {
          handleClickExpand?.(e, true);
        }

        if (rootType === 'public') {
          handleAddItems(newSchedule, false);
        } else {
          handleAddItems(newSchedule);
        }

        if (location.pathname === '/calendar') {
          setSchedules([newSchedule, ...schedules]);
          setShownSchedules([
            { id: newSchedule.id, show: true },
            ...shownSchedules,
          ]);
        }

        setActionToast({
          status: true,
          message: 'Created',
        });
      })
      .catch((err) => console.error(err));
  };

  const createNewDeck = (e) => {
    // Turn on loading state
    if (rootType === 'public') {
      setItemsLoading(directoryId, false);
    } else {
      setItemsLoading(directoryId);
    }

    const newDeck = {
      title: 'New Deck',
      icon: import.meta.env.VITE_DEFAULT_DECK_ICON_URL,
      description: '',
      user_id: currentUser.id,
      directory_id: directoryId,
      flashcards: [],
      tag_ids: [],
    };

    axiosClient
      .post(`/decks`, newDeck)
      .then(({ data }) => {
        // console.log(data.data);
        const newDeck = data.data;

        if (!rootDir) {
          handleClickExpand?.(e, true);
        }

        if (rootType === 'public') {
          handleAddItems(newDeck, false);
        } else {
          handleAddItems(newDeck);
        }

        if (location.pathname === '/decks') {
          setDecks([newDeck, ...decks]);
        }

        setActionToast({
          status: true,
          message: 'Created',
        });
      })
      .catch((err) => console.error(err))
      .finally(() => {});
  };

  return (
    <div className="action-menu">
      <div className="action-menu__title">Create options</div>
      <ul className="action-menu__list">
        <li
          onClick={(e) => {
            e.stopPropagation();
            createNewNote(e);
            setPopoverOpen(false);
          }}
          className="action-menu__item"
        >
          <AiFillFileAdd className="action-menu__icon" />
          <span className="action-menu__label">Create new note</span>
        </li>
        <li
          onClick={(e) => {
            e.stopPropagation();
            createNewDirectory(e);
            setPopoverOpen(false);
          }}
          className="action-menu__item"
        >
          <AiFillFolderAdd className="action-menu__icon" />
          <span className="action-menu__label">Create new directory</span>
        </li>
        <li
          onClick={(e) => {
            e.stopPropagation();
            createNewSchedule(e);
            setPopoverOpen(false);
          }}
          className="action-menu__item"
        >
          <AiFillCalendar className="action-menu__icon" />
          <span className="action-menu__label">Create new schedule</span>
        </li>
        <li
          onClick={(e) => {
            e.stopPropagation();
            createNewDeck(e);
            setPopoverOpen(false);
          }}
          className="action-menu__item"
        >
          <GiCardExchange className="action-menu__icon" />
          <span className="action-menu__label">Create new deck</span>
        </li>
      </ul>
    </div>
  );
};

export default AddOptions;
