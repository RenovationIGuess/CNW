import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import FloatMenu from '~/components/FloatMenu/FloatMenu';
import Header from '~/components/Header/Header';
import Toolbox from '~/components/Toolbox/Toolbox';
import { images } from '~/constants';
import ChooseLearnMode from '~/features/Deck/Detail/ChooseLearnMode';
import Creator from '~/features/Deck/Detail/Creator';
import FlipMode from '~/features/Deck/Detail/FlipMode';
import EditDeckModal from '~/features/Deck/EditDeckModal';
import FlashcardModal from '~/features/Deck/FlashcardModal';
import NotFound from '~/features/components/NotFound';
import useFlashcardStore from '~/store/useFlashcardStore';
import useModalStore from '~/store/useModalStore';
import { objUtils } from '~/utils';

const DeckDetail = () => {
  const { id } = useParams();

  const [deck, fetchingDeck, fetchDeck] = useFlashcardStore((state) => [
    state.deck,
    state.fetchingDeck,
    state.fetchDeck,
  ]);

  const [setShouldOpenModal, setShouldOpenFlashcardModal, setSelectedCard] =
    useFlashcardStore((state) => [
      state.setShouldOpenModal,
      state.setShouldOpenFlashcardModal,
      state.setSelectedCard,
    ]);

  const [setDirectoryModalOpen, setDirModalUseType, setDataToSetPath] =
    useModalStore((state) => [
      state.setDirectoryModalOpen,
      state.setDirModalUseType,
      state.setDataToSetPath,
    ]);

  const containerRef = useRef();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [cardModalOpen, setCardModalOpen] = useState(false);

  const toolList = useMemo(() => {
    return [
      // First row
      {
        title: 'Attach to Note',
        icon: images.page,
        tooltip: 'Attach to Note',
        callback: () => {
          setDirModalUseType('attach');
          setDirectoryModalOpen(true);
        },
      },
      {
        title: 'Add Flashcard',
        icon: images.cards,
        tooltip: 'Add Flashcard o Deck',
        callback: () => {
          setShouldOpenFlashcardModal(true);
          setSelectedCard({});
        },
      },
      {
        title: 'Attach to Schedule',
        icon: images.check,
        tooltip: 'Attach to Schedule',
        callback: () => {
          setDirModalUseType('attach');
          setDirectoryModalOpen(true);
        },
      },
      {
        title: 'Learn Mode',
        icon: images.history,
        tooltip: "Let's see what you've learned",
        callback: () => {},
      },
      {
        title: 'Share',
        icon: images.team,
        tooltip: 'Make this available on your public profile',
        callback: () => {},
      },
      {
        title: 'Set Info',
        icon: images.info,
        tooltip: "Change deck's info",
        callback: () => {
          setDataToSetPath({});
          setShouldOpenModal(true);
        },
      },
      {
        title: 'Set Location',
        icon: images.map,
        tooltip: "Change deck's location",
        callback: () => {
          setDataToSetPath(deck);
          setDirModalUseType('path');
          setDirectoryModalOpen(true);
        },
      },
      {
        title: 'Remove',
        icon: images.treasure,
        tooltip: 'Or archive',
        callback: () => {},
      },
    ];
  }, [deck]);

  useEffect(() => {
    fetchDeck(id);
  }, [id]);

  useEffect(() => {
    if (fetchingDeck) {
      document.title = 'Loading...';
    } else {
      if (Object.keys(deck).length === 0) {
        document.title = 'Deck Not Found!';
      } else document.title = `${deck.title}`;
    }
  }, [fetchingDeck]);

  // Skeleton loading here
  if (fetchingDeck) {
    return <>Loading...</>;
  }

  if (!fetchingDeck && objUtils.isEmptyObject(deck)) {
    return (
      <NotFound
        message={
          "Unable to locate a deck with this ID. It may have been deleted or never existed. Please check the 'Trash' folder for further information. >_<"
        }
      />
    );
  }

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
          <div className="root-page-container__left rounded-none">
            <div className="social-layout__main">
              <div className="social-home">
                <ChooseLearnMode />
                <FlipMode containerRef={containerRef} />
              </div>
            </div>
          </div>
          <div className="root-page-container__right">
            <div className="layout-sub">
              <div className="sticky-scroll-section--wrap">
                <div className="sticky-scroll-section">
                  <Toolbox toolList={toolList} />
                  <Creator />
                  {/* <BannerSlide /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit deck modal */}
      <EditDeckModal
        open={editModalOpen}
        setOpen={setEditModalOpen}
        selectedDeck={deck}
      />

      {/* FlashcardModal */}
      <FlashcardModal open={cardModalOpen} setOpen={setCardModalOpen} />
    </div>
  );
};

export default DeckDetail;
