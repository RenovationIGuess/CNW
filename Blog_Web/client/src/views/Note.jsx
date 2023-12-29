import { useEffect, useState } from 'react';
import Header from '../components/Header/Header';
import BackgroundSection from '../components/BackgroundSection/BackgroundSection';
import './styles/Dashboard.scss';
import { useLocation, useParams } from 'react-router-dom';
import axiosClient from '../axios';
import NoteTopbar from '../features/Note/NoteTopbar';
import NoteContent from '../features/Note/NoteContent/NoteContent';
import useNoteStore from '../store/useNoteStore';
import { objUtils } from '~/utils';
import NotFound from '~/features/components/NotFound';

// Note's detail page
const Note = () => {
  const { id } = useParams();

  const [note, setNote, fetchNoteLoading, setFetchNoteLoading] = useNoteStore(
    (state) => [
      state.note,
      state.setNote,
      state.fetchNoteLoading,
      state.setFetchNoteLoading,
    ]
  );

  const [editModalOpen, setEditModalOpen] = useState(false);
  // For note background modal
  const [bgModalOpen, setBgModalOpen] = useState(false);
  // Value for searchbar
  // const [searchValue, setSearchValue] = useState('');
  // To change view between note's content | histories | comments
  const [viewState, setViewState] = useState('content');

  useEffect(() => {
    if (fetchNoteLoading) {
      document.title = 'Loading...';
    } else {
      if (Object.keys(note).length === 0) {
        document.title = 'Note Not Found!';
      } else document.title = `${note.title}`;
    }
  }, [fetchNoteLoading]);

  useEffect(() => {
    setFetchNoteLoading(true);
    setViewState('content');
    axiosClient
      .get(`/notes/${id}`)
      .then(({ data }) => {
        // console.log(data.data);
        setNote(data.data);
      })
      .catch((err) => {
        setNote({});
        console.log(err);
      })
      .finally(() => {
        setFetchNoteLoading(false);
      });
  }, [id]);

  if (!fetchNoteLoading && objUtils.isEmptyObject(note)) {
    return (
      <NotFound
        message={
          "Unable to locate a note with this ID. It may have been deleted or never existed. Please check the 'Trash' folder for further information. >_<"
        }
      />
    );
  }

  return (
    <>
      <div className="flex-1 flex flex-col">
        <Header
          type={'note_page'}
          data={note}
          // searchValue={searchValue}
          // setSearchValue={setSearchValue}
          loading={fetchNoteLoading}
        />
        <section className="w-full flex flex-col flex-1 max-h-full">
          <BackgroundSection
            hidden={true}
            loading={fetchNoteLoading}
            image={note.background_image}
          />

          <NoteTopbar
            setEditModalOpen={setEditModalOpen}
            setBgModalOpen={setBgModalOpen}
          />

          <NoteContent
            editModalOpen={editModalOpen}
            setEditModalOpen={setEditModalOpen}
            bgModalOpen={bgModalOpen}
            setBgModalOpen={setBgModalOpen}
            viewState={viewState}
            setViewState={setViewState}
          />
        </section>
      </div>
    </>
  );
};

export default Note;
