import { useEffect, useMemo, useRef, useState } from 'react';
import './styles/Dashboard.scss';
import { images } from '../constants';
import TransparentHeader from '../components/TransparentHeader/TransparentHeader';
import Toolbox from '../components/Toolbox/Toolbox';
import { userStateContext } from '../contexts/ContextProvider';
import NotesContainer from '../features/_profile/NotesContainer/NotesContainer';
import axiosClient from '../axios';
import { toast as toastify } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
// import BasicInfoBox from "../components/Layout/Dashboard/BasicInfoBox/BasicInfoBox";
// import OtherInfoBox from "../components/Layout/Dashboard/OtherInfoBox/OtherInfoBox";

const PrivateProfile = () => {
  const { currentUser, firstIn, setFirstIn } = userStateContext();
  const navigate = useNavigate();

  // Prevent showing 2 welcome toast
  const toastId = useRef(null);
  const toastShownRef = useRef(false);

  // Value for searchbar
  // const [searchValue, setSearchValue] = useState('');

  // All recent notes
  const [notes, setNotes] = useState([]);
  const [fetchNotesLoading, setFetchNotesLoading] = useState(true);
  const [paginateNotes, setPaginateNotes] = useState({});
  // All starred notes
  const [starredNotes, setStarredNotes] = useState([]);
  const [fetchStarredNotesLoading, setFetchStarredNotesLoading] =
    useState(true);
  const [paginateStarredNotes, setPaginateStarredNotes] = useState({});

  const toolList = useMemo(() => {
    return [
      // First row
      {
        title: 'Add Note',
        icon: images.page,
        tooltip: 'Saved to Private folder',
        callback: 'createNewNote',
      },
      {
        title: 'Add Deck',
        icon: images.flashcards,
        tooltip: 'Saved to Private folder',
        callback: 'createNewDeck',
      },
      {
        title: 'Add Schedule',
        icon: images.check,
        tooltip: 'Saved to Private folder',
        callback: 'createNewSchedule',
      },
      {
        title: 'Social',
        icon: images.team,
        tooltip: 'See what people are blogging',
        callback: () => {
          navigate('/blogs');
        },
      },
    ];
  }, []);

  useEffect(() => {
    document.title = 'Private Profile';
  }, []);

  useEffect(() => {
    if (
      firstIn &&
      !toastShownRef.current &&
      !toastify.isActive(toastId.current)
    ) {
      toastId.current = toastify(
        <div className="pl-2 pb-1 flex flex-col">
          <h1 className="font-medium">
            <span className="mr-2">👋</span>Welcome{' '}
            <span className="active-text">{currentUser.profile.name}</span>!
          </h1>
          <p>Wish you have a productive day 📝 ~</p>
        </div>,
        {
          autoClose: 3000,
        }
      );
      toastShownRef.current = true;
      setFirstIn(false); // reset firstIn to false after showing the toast
    }
  }, [firstIn]);

  // Get all the notes (recently)
  useEffect(() => {
    // setFetchNotesLoading(true);
    axiosClient
      .get('/notes')
      .then(({ data }) => {
        setNotes(data.data.data);
        setPaginateNotes({
          total: data.data.total,
          last_page: data.data.last_page,
          per_page: data.data.per_page,
          current_page: data.data.last_page > 1 ? 2 : 1,
          loading: false,
        });
      })
      .catch((err) => console.log(err))
      .finally(() => setFetchNotesLoading(false));
  }, []);

  // Get all the starred notes
  useEffect(() => {
    // setFetchStarredNotesLoading(true);
    axiosClient
      .get('/notes/starred')
      .then(({ data }) => {
        setStarredNotes(data.data.data);
        setPaginateStarredNotes({
          total: data.data.total,
          last_page: data.data.last_page,
          per_page: data.data.per_page,
          current_page: data.data.last_page > 1 ? 2 : 1,
          loading: false,
        });
      })
      .catch((err) => console.log(err))
      .finally(() => setFetchStarredNotesLoading(false));
  }, []);

  const getNotes = (current_page) => {
    setPaginateNotes({
      ...paginateNotes,
      loading: true,
    });
    axiosClient
      .get(`/notes?page=${current_page}`)
      .then(({ data }) => {
        setNotes([...notes, ...data.data.data]);
      })
      .catch((err) => console.log(err))
      .finally(() =>
        setPaginateNotes({
          ...paginateNotes,
          loading: false,
          current_page: paginateNotes.current_page + 1,
        })
      );
  };

  const getStarredNotes = (current_page) => {
    setPaginateStarredNotes({
      ...paginateNotes,
      loading: true,
    });
    axiosClient
      .get(`/notes/starred?page=${current_page}`)
      .then(({ data }) => {
        setStarredNotes([...starredNotes, ...data.data.data]);
      })
      .catch((err) => console.log(err))
      .finally(() =>
        setPaginateStarredNotes({
          ...paginateStarredNotes,
          current_page: paginateStarredNotes.current_page + 1,
          loading: false,
        })
      );
  };

  return (
    <div className="flex-1 flex flex-col max-w-full relative min-w-0">
      <div className="home-background">
        {/* <div className="home-background__wrapper"> */}
        <img
          className="home-background-img"
          src={images.test6}
          alt="home-background"
        />
        <div className="home-background__mask"></div>
        {/* </div> */}
      </div>
      <TransparentHeader
        currentUser={currentUser}
        // searchValue={searchValue}
        // setSearchValue={setSearchValue}
      />
      <section className="w-full flex flex-col flex-1 max-h-full">
        <div className="page-root-container__content dashboard-root-container__content">
          <div className="page-scroller profile-page-scroller">
            {/* Left side of the main content */}

            <div className="page-root-container__left profile-root-container__left">
              <NotesContainer
                paginate={paginateStarredNotes}
                loading={fetchStarredNotesLoading}
                headerTitle={'Starred Notes'}
                data={starredNotes}
                setStarredNotes={setStarredNotes}
                setNotes={setNotes}
                getNotes={getStarredNotes}
              />
              <NotesContainer
                paginate={paginateNotes}
                loading={fetchNotesLoading}
                headerTitle={'Recent Notes'}
                data={notes}
                setStarredNotes={setStarredNotes}
                setNotes={setNotes}
                getNotes={getNotes}
              />
            </div>

            {/* Right side of the main content */}
            <div className="page-root-container__right">
              <div className="layout__sub w-full">
                <div>
                  <div className="w-[336px]">
                    <Toolbox toolList={toolList} />
                    {/* <BasicInfoBox />
                    <OtherInfoBox /> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivateProfile;
