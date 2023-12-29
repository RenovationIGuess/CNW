import React, { useCallback, useEffect, useRef, useState } from 'react';
import Header from '~/components/Header/Header';
import './styles/Deck.scss';
import NewFlashcard from '../features/Deck/NewFlashcard';
import ContainerHeader from '~/features/Deck/ContainerHeader';
import NewFlashcardButton from '~/features/Deck/NewFlashcardButton';
import NewDeck from '~/features/Deck/NewDeck';
import DeckList from '~/features/Deck/DeckList';
import useFlashcardStore from '~/store/useFlashcardStore';
import { images } from '~/constants';
import { cn } from '~/utils';
import BannerSlide from '~/components/BannerSlide/BannerSlide';
import Toolbox from '~/components/Toolbox/Toolbox';
import { Tooltip } from 'antd';
import { toast } from 'sonner';
import axiosClient from '~/axios';
import { useNavigate } from 'react-router-dom';
import useSidebarStore from '~/store/useSidebarStore';
import { userStateContext } from '~/contexts/ContextProvider';
import useModalStore from '~/store/useModalStore';
import EditDeckModal from '~/features/Deck/EditDeckModal';

const defaultDeckValue = {
  title: 'New Deck',
  icon: import.meta.env.VITE_DEFAULT_DECK_ICON_URL,
  description: '',
  directory_id: null,
  tag_ids: [],
};

const FlashcardDecks = () => {
  const navigate = useNavigate();

  const { currentUser } = userStateContext();

  const containerRef = useRef();

  const [showFloatMenu, setShowFloatMenu] = useState(false);

  const [handleAddItemWithParentId] = useSidebarStore((state) => [
    state.handleAddItemWithParentId,
  ]);

  const [fetchingDecks, fetchDecks] = useFlashcardStore((state) => [
    state.fetchingDecks,
    state.fetchDecks,
  ]);

  const [selectedDeck] = useFlashcardStore((state) => [state.selectedDeck]);

  const [editModalOpen, setEditModalOpen] = useFlashcardStore((state) => [
    state.editModalOpen,
    state.setEditModalOpen,
  ]);

  const [setSelectedPath] = useModalStore((state) => [state.setSelectedPath]);

  const [viewState, setViewState] = useState('decks');

  const newDeck = useRef(defaultDeckValue);
  // Fc stands for flashcard
  const newFc = useRef([
    {
      key: 1,
      front_title: '',
      front_content: '',
      back_title: '',
      back_content: '',
    },
  ]);
  const [lastId, setLastId] = useState(1);
  const [newFcLength, setNewFcLength] = useState([1]);
  const [deckErrors, setDeckErrors] = useState({
    state: false,
  });
  const [fcErrors, setFcErrors] = useState([]);

  useEffect(() => {
    fetchDecks();
  }, []);

  useEffect(() => {
    if (fetchingDecks) {
      document.title = 'Loading...';
    } else document.title = 'Decks';
  }, [fetchingDecks]);

  useEffect(() => {
    const current = containerRef.current;

    if (!current) return;

    current.addEventListener('scroll', scrollEvent);

    return () => {
      current.removeEventListener('scroll', scrollEvent);
    };
  }, [containerRef.current]);

  const scrollEvent = useCallback(() => {
    if (!containerRef) return;

    if (containerRef.current.scrollTop > 80) {
      setShowFloatMenu(true);
    } else {
      setShowFloatMenu(false);
    }
  }, [containerRef.current]);

  const handleCreateDeck = () => {
    let hasError = false;
    // Validation
    if (newDeck.current.title.length === 0) {
      setDeckErrors({
        title: ['Please enter title (required)'],
        state: true,
      });
      hasError = true;
    }
    // console.log(newFc.current);
    const errorArr = [];
    for (let i = 0; i < newFc.current.length; i++) {
      let errorObj = {
        key: newFc.current[i].key,
        front_title: [],
        back_title: [],
        state: false,
      };
      if (newFc.current[i].front_title.length === 0) {
        errorObj.front_title.push('Please enter title (required)');
        errorObj.state = true;

        hasError = true;
      }
      if (newFc.current[i].back_title.length === 0) {
        errorObj.back_title.push('Please enter title (required)');
        errorObj.state = true;

        hasError = true;
      }
      errorArr.push(errorObj);
    }

    setFcErrors(errorArr);

    if (!hasError) {
      const toastId = toast.loading('Creating new deck...', {
        position: 'bottom-center',
      });
      axiosClient
        .post('/decks', {
          ...newDeck.current,
          directory_id:
            newDeck.current.directory_id ?? currentUser.private_dir.id,
          flashcards: newFc.current,
        })
        .then(({ data }) => {
          const newData = data.data;
          const parentId = newData.directory_id;

          handleAddItemWithParentId(newData, parentId);

          // After create the deck, reset the selectedPath
          setSelectedPath([]);

          navigate(`/decks/${newData.id}`);

          toast.success('Created new deck successfully!', {
            id: toastId,
            duration: 1500,
            position: 'bottom-center',
          });
        })
        .catch((err) => console.error(err));
    } else {
      toast.error('Please fill in all required fields!', {
        position: 'bottom-center',
        duration: 3000,
      });
    }
  };

  return (
    <div
      className="flex flex-1 flex-col relative"
      data-route-name="flashcard-deck"
    >
      <Header />

      <div
        ref={containerRef}
        className="root-page-container social-root-page-container pb-[30vh]"
      >
        <div className="root-page-container__content">
          <div className="root-page-container__left">
            <div className="social-main-page social-layout__main">
              <div className="social-home">
                <ContainerHeader
                  viewState={viewState}
                  setViewState={setViewState}
                  handleCreateDeck={handleCreateDeck}
                />

                {viewState === 'decks' && <DeckList />}

                {viewState === 'add' && (
                  <NewDeck deckRef={newDeck} error={deckErrors} />
                )}

                {viewState === 'add' &&
                  newFcLength.map((item, index) => (
                    <NewFlashcard
                      key={item}
                      index={index}
                      data={newFc}
                      setLength={setNewFcLength}
                      error={fcErrors[index]}
                      setErrors={setFcErrors}
                    />
                  ))}

                {viewState === 'add' && (
                  <NewFlashcardButton
                    label={newFc.current.length + 1}
                    callback={() => {
                      newFc.current.push({
                        key: lastId + 1,
                        front_title: '',
                        front_content: '',
                        back_title: '',
                        back_content: '',
                      });
                      setLastId(lastId + 1);
                      setNewFcLength([...newFcLength, lastId + 1]);
                      // if (containerRef.current) {
                      //   containerRef.current.scrollTop =
                      //     containerRef.current.scrollHeight -
                      //     containerRef.current.clientHeight;
                      // }
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          {viewState === 'decks' && (
            <div className="root-page-container__right">
              <div className="layout-sub">
                <div className="sticky-scroll-section--wrap">
                  <div className="sticky-scroll-section">
                    <Toolbox />
                    <BannerSlide />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Float menu */}
      <div className={cn('float-menu', !showFloatMenu && 'hidden')}>
        <div className="float-menu-list">
          <div className="menu-list-container">
            <ul className="menu-list-wrapper"></ul>
            <Tooltip placement="left" title="Create">
              <li
                onClick={() => {
                  handleCreateDeck();
                }}
                className="menu-btn"
              >
                <img
                  className="img-icon"
                  src={images.create}
                  alt="create-btn"
                />
              </li>
            </Tooltip>
          </div>
        </div>
        <Tooltip placement="left" title="Go to top">
          <div className="rocket">
            <div
              onClick={() => {
                if (containerRef.current) containerRef.current.scrollTop = 0;
              }}
              className={cn('rocket__rocket', 'rocket__rocket--visible')}
            >
              <img src={images.to_top} alt="to-top-btn" className="img-icon" />
            </div>
          </div>
        </Tooltip>
      </div>

      {/* Edit deck modal */}
      <EditDeckModal
        open={editModalOpen}
        setOpen={setEditModalOpen}
        selectedDeck={selectedDeck}
      />
    </div>
  );
};

export default FlashcardDecks;
