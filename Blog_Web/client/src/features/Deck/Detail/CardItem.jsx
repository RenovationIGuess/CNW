import React, { useEffect, useRef, useState } from 'react';
import { Tooltip } from 'antd';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsTrash } from 'react-icons/bs';
import TiptapContent from '~/components/Tiptap/TiptapContent';
import { cn, stringUtils } from '~/utils';
import useFlashcardStore from '~/store/useFlashcardStore';
import useModalStore from '~/store/useModalStore';
import axiosClient from '~/axios';

const CardItem = ({ card, index }) => {
  const [setShouldOpenFlashcardModal] = useFlashcardStore((state) => [
    state.setShouldOpenFlashcardModal,
  ]);

  const [setSelectedCard] = useFlashcardStore((state) => [
    state.setSelectedCard,
  ]);

  const [deckFlashcards, setDeckFlashcards] = useFlashcardStore((state) => [
    state.deckFlashcards,
    state.setDeckFlashcards,
  ]);

  const [setConfirmModalLoading, setConfirmModalOpen, setConfirmModalInfo] =
    useModalStore((state) => [
      state.setConfirmModalLoading,
      state.setConfirmModalOpen,
      state.setConfirmModalInfo,
    ]);

  const [setActionToast] = useModalStore((state) => [state.setActionToast]);

  const [showFull, setShowFull] = useState(false);
  const [showViewMore, setShowViewMore] = useState(false);
  const [frontContentHeight, setFrontContentHeight] = useState(0);
  const [backContentHeight, setBackContentHeight] = useState(0);

  const frontContentRef = useRef(null);
  const backContentRef = useRef(null);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      let showMore = false;
      let count = 0; // if count == 2 stop the loop
      for (let entry of entries) {
        if (entry.target === frontContentRef.current) {
          const frontHeight = entry.contentRect.height;
          setFrontContentHeight(frontHeight);
          if (frontHeight >= 256) showMore = true;

          count++;
          if (count === 2) break;
        } else if (entry.target === backContentRef.current) {
          const backHeight = entry.contentRect.height;
          setBackContentHeight(backHeight);
          if (backHeight >= 256) showMore = true;

          count++;
          if (count === 2) break;
        }
      }

      if (showMore) setShowViewMore(true);
      else setShowViewMore(false);
    });

    if (frontContentRef.current) {
      resizeObserver.observe(frontContentRef.current);
    }

    if (backContentRef.current) {
      resizeObserver.observe(backContentRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const handleDeleteCard = () => {
    setConfirmModalLoading(true);
    axiosClient
      .delete(`/flashcards/${card.id}`)
      .then(({}) => {
        setDeckFlashcards(deckFlashcards.filter((c) => c.id !== card.id));

        setActionToast({
          status: true,
          message: 'Deleted',
        });

        setConfirmModalOpen(false);
        setConfirmModalLoading(false);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setConfirmModalLoading(false);
      });
  };

  return (
    <div className={cn('card-item__container', index === 0 && 'mt-0')}>
      <div className="social-page-header-content">
        <div className="social-switch-tab" id="social-switch-tab">
          <p className="font-bold">Flashcard&nbsp;{index + 1}</p>

          <div className="flex items-center gap-4 h-full">
            <ul className="switch-tab__list">
              <Tooltip placement="top" title="Edit this card">
                <li
                  onClick={() => {
                    setShouldOpenFlashcardModal(true);
                    setSelectedCard(card);
                  }}
                  className={`switch-tab__icon`}
                >
                  <AiOutlineEdit className="tab__icon" />
                </li>
              </Tooltip>
              <Tooltip placement="top" title="Remove this card">
                <li
                  onClick={() => {
                    setConfirmModalOpen(true);
                    setConfirmModalInfo({
                      title: 'Remove this card?',
                      message:
                        "Are you sure you want to remove this card? This action can't be undone.",
                      callback: () => handleDeleteCard(),
                    });
                  }}
                  className={`switch-tab__icon`}
                >
                  <BsTrash className="tab__icon" />
                </li>
              </Tooltip>
            </ul>
          </div>
        </div>
      </div>

      <div
        className={cn(
          'px-6 pt-4 flex add-flashcard__container',
          !showViewMore && 'pb-6'
        )}
      >
        <div className="add-section relative">
          {/* Front Title */}
          <h1 className="text-xl font-bold break-words">{card.front_title}</h1>

          {/* Front Content */}
          {!stringUtils.isContentEmpty(card.front_content) && (
            <>
              <div
                className={cn(
                  'w-full mt-4',
                  !showFull && 'overflow-hidden max-h-[256px]'
                )}
                ref={frontContentRef}
              >
                <TiptapContent content={card.front_content} />
              </div>

              {frontContentHeight >= 256 && !showFull && (
                <div className="card-item-content__mask"></div>
              )}
            </>
          )}
        </div>
        <div className="section-divider"></div>
        <div className="add-section relative">
          {/* Back Title */}
          <h1 className="text-xl font-bold break-words">{card.back_title}</h1>

          {/* Back */}
          {!stringUtils.isContentEmpty(card.back_content) && (
            <>
              <div
                className={cn(
                  'w-full mt-4',
                  !showFull && 'overflow-hidden max-h-[256px]'
                )}
                ref={backContentRef}
              >
                <TiptapContent content={card.back_content} />
              </div>

              {backContentHeight >= 256 && !showFull && (
                <div className="card-item-content__mask"></div>
              )}
            </>
          )}
        </div>
      </div>

      {showViewMore && (
        <div className="more-container">
          <p className="more-text" onClick={() => setShowFull(!showFull)}>
            {!showFull ? 'View more' : 'Minimize'}
          </p>
        </div>
      )}
    </div>
  );
};

export default CardItem;
