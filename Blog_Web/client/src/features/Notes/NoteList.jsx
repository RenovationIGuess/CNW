import React, { useState } from 'react';
import { GiNotebook } from 'react-icons/gi';
import SearchBar from '~/components/SearchBar/SearchBar';
import { Tooltip } from 'antd';
import { AiOutlineFilter, AiOutlineSortAscending } from 'react-icons/ai';
import { MdOutlineViewCarousel } from 'react-icons/md';
import useNotesStore from '~/store/useNotesStore';
import { userStateContext } from '~/contexts/ContextProvider';
import NoteCardItem from './NoteCardItem';
import NewNoteCard from './NewNoteCard';
import { images } from '~/constants';
import axiosClient from '~/axios';
import useSidebarStore from '~/store/useSidebarStore';
import useModalStore from '~/store/useModalStore';

const NoteList = ({ handleCloseRightSidebar }) => {
  const { currentUser } = userStateContext();

  const [
    notes,
    setNotes,
    fetchNotesLoading,
    setFetchNotesLoading,
    currentNote,
    setCurrentNote,
    paginateNotes,
    setPaginateNotes,
    fetchMoreNotesLoading,
    setFetchMoreNotesLoading,
  ] = useNotesStore((state) => [
    state.notes,
    state.setNotes,
    state.fetchNotesLoading,
    state.setFetchNotesLoading,
    state.currentNote,
    state.setCurrentNote,
    state.paginateNotes,
    state.setPaginateNotes,
    state.fetchMoreNotesLoading,
    state.setFetchMoreNotesLoading,
  ]);

  const [privateItems, setPrivateItems] = useSidebarStore((state) => [
    state.privateItems,
    state.setPrivateItems,
  ]);

  const [setActionToast] = useModalStore((state) => [state.setActionToast]);

  // snippets | cards - this use for the notes section
  const [viewMode, setViewMode] = useState('snippets');
  // const [searchValue, setSearchValue] = useState('');
  // const [searchNotes, setSearchNotes] = useState([]);
  // Loading when create a new note
  const [newNoteLoading, setNewNoteLoading] = useState(false);

  // useEffect(() => {
  //   setSearchNotes(notes.filter((n) => n.title.includes(searchValue)));
  // }, [searchValue]);

  // If a note is create through new, it will be stored in the private folder as default
  const createNewNote = () => {
    if (notes.length === 0) setFetchNotesLoading(true);
    else setNewNoteLoading(true);
    axiosClient
      .post(`/notes`, {
        user_id: currentUser.id,
        directory_id: currentUser.private_dir.id,
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

        if (privateItems[newNote.directory_id] !== undefined) {
          // console.log(privateItems[newDir.directory_id]);
          const newPrivateItems = {
            ...privateItems,
            [newNote.directory_id]: {
              ...privateItems[newNote.directory_id],
              child_items: [
                newNote,
                ...privateItems[newNote.directory_id].child_items,
              ],
            },
          };
          setPrivateItems(newPrivateItems);
        }

        // Newest note will be added to the top of the list
        // Remove the last element because it will be shift to the next paginate
        // if number of items exceed 10
        let newNotes;
        if (notes.length % 10 === 0) {
          newNotes = [data.data, ...notes.slice(0, notes.length - 1)];
        } else {
          newNotes = [data.data, ...notes];
        }
        setNotes(newNotes);
        setCurrentNote(data.data);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        if (notes.length === 0) setFetchNotesLoading(false);
        else setNewNoteLoading(false);

        setActionToast({
          status: true,
          message: 'Created',
        });
      });
  };

  const fetchMoreNotes = () => {
    setFetchMoreNotesLoading(true);
    // First item will contains next 10 items (or less)
    const url = `/notes?page=${paginateNotes[0].label}`;
    axiosClient
      .get(url)
      .then(({ data }) => {
        setNotes([...notes, ...data.data.data]);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setPaginateNotes(paginateNotes.slice(1));
        setFetchMoreNotesLoading(false);
      });
  };

  return (
    <>
      <div className="note-list__container">
        <section className="note-list__wrapper">
          <div className="note-list">
            <header className="note-list__header">
              <div className="note-list__header--wrapper">
                <div className="flex items-center">
                  <GiNotebook className="note-list__header--icon" />
                  <h1 className="note-list__header--title">Notes</h1>
                </div>
                <p className="note-list__header--count">7 Notes</p>
              </div>
              <div className="note-list__tools">
                <SearchBar
                  styles={{ minWidth: '248px' }}
                  // searchValue={searchValue}
                  // setSearchValue={setSearchValue}
                />
                <div className="flex items-center gap-2">
                  <Tooltip placement="top" title="Sort options">
                    <div>
                      <AiOutlineSortAscending className="tools-icon" />
                    </div>
                  </Tooltip>
                  <Tooltip placement="top" title="Filter options">
                    <div>
                      <AiOutlineFilter className="tools-icon" />
                    </div>
                  </Tooltip>
                  <Tooltip placement="top" title="View options">
                    <div>
                      <MdOutlineViewCarousel className="tools-icon" />
                    </div>
                  </Tooltip>
                </div>
              </div>
            </header>
            <div className="note-view">
              <div className="note-view__scroller">
                {!fetchNotesLoading ? (
                  <div
                    className={`note-view__wrapper${
                      notes.length === 0 ? ' flex-1' : ''
                    }`}
                  >
                    {notes.length === 0 ? (
                      <div className="flex flex-col justify-center items-center w-full">
                        <img src={images.nothing} className="w-[312px]" />
                        <p className="no-notes__title">
                          You don't have any note T_T
                        </p>
                        <p className="no-notes__title mt-1">
                          To create one, you can click at any{' '}
                          <Tooltip
                            placement="top"
                            title="Or you can just click here :D"
                          >
                            <span
                              onClick={() => createNewNote()}
                              className="add-note__title"
                            >
                              + New Note
                            </span>
                          </Tooltip>{' '}
                          sign you see in the sidebar{' '}
                          {'(Must in notes section ^_^)'}
                        </p>
                      </div>
                    ) : (
                      <>
                        {notes.map((note, ind) => (
                          <NoteCardItem
                            key={ind}
                            index={ind}
                            note={note}
                            selected={currentNote.id === note.id}
                            handleCloseRightSidebar={handleCloseRightSidebar}
                          />
                        ))}
                        <NewNoteCard
                          horizontal={notes.length % 10 === 0}
                          createNewNote={createNewNote}
                          newNoteLoading={newNoteLoading}
                        />
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-full">
                    <span className="my-loader note-view__loader"></span>
                    <p className="load-more__title">Loading...</p>
                  </div>
                )}
              </div>
            </div>
            {!fetchNotesLoading && (
              <div
                className="note-view__bottom"
                onClick={() => {
                  paginateNotes.length > 0 && fetchMoreNotes();
                }}
              >
                <div className="flex items-center gap-3">
                  {fetchMoreNotesLoading && (
                    <span className="my-loader note-view__bottom--loader"></span>
                  )}
                  <span className="note-view__bottom--title">
                    {fetchMoreNotesLoading
                      ? 'Loading...'
                      : paginateNotes.length === 0
                        ? 'This is the end ~'
                        : 'Load more notes'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default NoteList;
