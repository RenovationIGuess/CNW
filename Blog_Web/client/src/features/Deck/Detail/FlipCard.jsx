import React, { useMemo, useState } from 'react';
import TiptapContent from '~/components/Tiptap/TiptapContent';
import { cn, scroll, stringUtils } from '~/utils';
import {
  FaHighlighter,
  FaLightbulb,
  FaRegStar,
  FaStar,
  FaTrash,
} from 'react-icons/fa';
import { Tooltip } from 'antd';
import useFlashcardStore from '~/store/useFlashcardStore';
import useModalStore from '~/store/useModalStore';
import axiosClient from '~/axios';
import { toast } from 'sonner';

const FlipCard = ({ autoPlay, currentCard, card, index }) => {
  const [showSuggestion, setShowSuggestion] = useState(false);

  const [setShouldOpenFlashcardModal, setSelectedCard] = useFlashcardStore(
    (state) => [state.setShouldOpenFlashcardModal, state.setSelectedCard]
  );

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

  const suggestion = useMemo(
    () => stringUtils.hideRandomChars(card?.back_title),
    [card?.back_title]
  );

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
        toast.error('Server Error', {
          position: 'bottom-center',
          duration: 1500,
        });
      })
      .finally(() => {
        setConfirmModalLoading(false);
      });
  };

  const handleStarCard = () => {
    axiosClient
      .patch(`/flashcards/${card.id}/star`)
      .then(() => {
        const star = !card.starred;

        setDeckFlashcards(
          deckFlashcards.map((c) => {
            if (c.id === card.id) {
              return {
                ...card,
                starred: star,
              };
            }
            return c;
          })
        );

        setActionToast({
          status: true,
          message: star ? 'Starred' : 'Removed',
        });
      })
      .catch((err) => {
        console.log(err);
        toast.error('Server Error', {
          position: 'bottom-center',
          duration: 1500,
        });
      });
  };

  return (
    <div className={cn('fc-container')}>
      <div
        className={'fc-wrapper'}
        data-flipped={`flip-card-${index}`}
        onClick={(e) => e.currentTarget.classList.toggle('fc-wrapper--flipped')}
      >
        <div className={cn('fc-front', autoPlay ? 'pb-4' : 'pb-9')}>
          {/* Header */}
          <div className="flex items-center justify-between h-10">
            {/* Suggestion */}
            <div
              className="card-suggestion__wrapper"
              onClick={(e) => {
                e.stopPropagation();
                setShowSuggestion(!showSuggestion);
              }}
            >
              <FaLightbulb className="text-lg" />
              <p className="">
                {showSuggestion ? suggestion : 'Show Suggestion'}
              </p>
            </div>
            {/* Quick Actions */}
            <div className="flex items-center gap-6">
              <Tooltip placement="top" title="Edit this card">
                <FaHighlighter
                  onClick={(e) => {
                    e.stopPropagation();
                    setShouldOpenFlashcardModal(true);
                    setSelectedCard(card);
                  }}
                  className="card-action__icon"
                />
              </Tooltip>
              {card.starred ? (
                <Tooltip placement="top" title="Remove star">
                  <FaStar
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStarCard(card);
                    }}
                    className="card-action__icon"
                  />
                </Tooltip>
              ) : (
                <Tooltip placement="top" title="Star this card">
                  <FaRegStar
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStarCard(card);
                    }}
                    className="card-action__icon"
                  />
                </Tooltip>
              )}
              <Tooltip placement="top" title="Remove this card">
                <FaTrash
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmModalOpen(true);
                    setConfirmModalInfo({
                      title: 'Remove this card?',
                      message:
                        "Are you sure you want to remove this card? This action can't be undone.",
                      callback: () => handleDeleteCard(),
                    });
                  }}
                  className="card-action__icon mr-4"
                />
              </Tooltip>
            </div>
          </div>

          {/* Card Content */}
          <div
            className={cn(
              'flex flex-col relative mt-3 px-4 pb-6 mb-4 flex-1 min-h-0 overflow-y-auto gap-4'
            )}
            onScroll={(e) => {
              if (scroll.isScrolledToBottom(e.target)) {
              }
            }}
          >
            <h1 className="text-4xl font-bold text-center">
              {card.front_title}
            </h1>
            <div className="relative">
              <TiptapContent content={card.front_content} />
            </div>
            <div
              className="card-content__mask"
              data-toggle={`flip-card-${index}-mask`}
            ></div>
          </div>

          {/* Footer */}
          {autoPlay && (
            <div className="flex items-center justify-center h-5">
              <div className="time-runner"></div>
            </div>
          )}
        </div>
        <div className={cn('fc-back', autoPlay ? 'pb-4' : 'pb-9')}>
          {/* Header */}
          <div className="flex items-center justify-end h-10">
            {/* Quick Actions */}
            <div className="flex items-center gap-6">
              <Tooltip placement="top" title="Edit this card">
                <FaHighlighter
                  onClick={(e) => {
                    e.stopPropagation();
                    setShouldOpenFlashcardModal(true);
                    setSelectedCard(card);
                  }}
                  className="card-action__icon"
                />
              </Tooltip>
              {card.starred ? (
                <Tooltip placement="top" title="Remove star">
                  <FaStar
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStarCard(card);
                    }}
                    className="card-action__icon"
                  />
                </Tooltip>
              ) : (
                <Tooltip placement="top" title="Star this card">
                  <FaRegStar
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStarCard(card);
                    }}
                    className="card-action__icon"
                  />
                </Tooltip>
              )}
              <Tooltip placement="top" title="Remove this card">
                <FaTrash
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmModalOpen(true);
                    setConfirmModalInfo({
                      title: 'Remove this card?',
                      message:
                        "Are you sure you want to remove this card? This action can't be undone.",
                      callback: () => handleDeleteCard(),
                    });
                  }}
                  className="card-action__icon mr-4"
                />
              </Tooltip>
            </div>
          </div>

          {/* Card Content */}
          <div
            className="flex flex-col relative mt-3 px-4 pb-6 mb-4 flex-1 min-h-0 overflow-y-auto gap-4"
            onScroll={(e) => {
              if (scroll.isScrolledToBottom(e.target)) {
              }
            }}
          >
            <h1 className="text-4xl font-bold text-center">
              {card.back_title}
            </h1>
            <div className="relative">
              <TiptapContent content={card.back_content} />
            </div>
            <div
              className="card-content__mask"
              data-toggle={`flip-card-${index}-mask`}
            ></div>
          </div>

          {/* Footer */}
          {autoPlay && (
            <div className="flex items-center justify-center h-5">
              <div className="time-runner"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
