import { Tooltip } from 'antd';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FaPause, FaPlay } from 'react-icons/fa';
import { FaShuffle } from 'react-icons/fa6';
import { IoSettings } from 'react-icons/io5';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import FlipCard from './FlipCard';
import CardItem from './CardItem';
import useFlashcardStore from '~/store/useFlashcardStore';
import { cn } from '~/utils';
import FlipCardEmpty from './FlipCardEmpty';
import AddFlashcards from './AddFlashcards';

const delay = 3000;

// Display a list of flashcards by
const FlipMode = ({ containerRef }) => {
  const slideTimeoutRef = useRef(null);
  const flipTimeoutRef = useRef(null);

  const [autoPlay, setAutoPlay] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);

  const [deckFlashcards] = useFlashcardStore((state) => [state.deckFlashcards]);

  const cardsNum = useMemo(
    () => deckFlashcards.length,
    [deckFlashcards.length]
  );

  // Handle update currentCard when card is | are deleted
  useEffect(() => {
    if (currentCard + 1 > cardsNum) {
      setCurrentCard(Math.max(cardsNum - 1, 0));
    }
  }, [cardsNum]);

  useEffect(() => {
    if (autoPlay) {
      resetSlideTimeout();
      resetFlipTimeout();
      slideTimeoutRef.current = setTimeout(() => {
        // First we need to get the current card
        const card = document.querySelector(
          `[data-flipped="flip-card-${currentCard}"]`
        );
        // If the card we're getting is flipped, flip it back and
        if (card?.classList.contains('fc-wrapper--flipped')) {
          card?.classList.remove('fc-wrapper--flipped');
        }
        // After delay, flip the card
        card?.classList.add('fc-wrapper--flipped');

        flipTimeoutRef.current = setTimeout(() => {
          card?.classList.remove('fc-wrapper--flipped');
          setCurrentCard(currentCard === cardsNum - 1 ? 0 : currentCard + 1);
        }, delay);
      }, delay);
    }
    return () => {
      resetSlideTimeout();
      resetFlipTimeout();
    };
  }, [autoPlay, currentCard, cardsNum, delay]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          setCurrentCard(currentCard === 0 ? cardsNum - 1 : currentCard - 1);
          break;
        case 'ArrowRight':
          setCurrentCard(currentCard === cardsNum - 1 ? 0 : currentCard + 1);
          break;
        // // case ' ':
        // //   // Check if the event target is an input or textarea
        // //   if (
        // //     event.target.tagName === 'INPUT' ||
        // //     event.target.tagName === 'TEXTAREA'
        // //   ) {
        // //     break;
        // //   }

        //   event.preventDefault(); // Prevent the default action
        //   const card = document.querySelector(
        //     `[data-flipped="flip-card-${currentCard}"]`
        //   );
        //   card?.classList.toggle('fc-wrapper--flipped');
        //   break;
        default:
          break;
      }
    };

    window.removeEventListener('keydown', handleKeyDown);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentCard]);

  const resetSlideTimeout = useCallback(() => {
    if (slideTimeoutRef.current) {
      clearTimeout(slideTimeoutRef.current);
    }
  }, []);

  const resetFlipTimeout = useCallback(() => {
    if (flipTimeoutRef.current) {
      clearTimeout(flipTimeoutRef.current);
    }
  }, []);

  return (
    <div className="flex flex-col">
      <div className="fc-list">
        <div
          className="fc-list__wrapper"
          style={{ transform: `translate3d(${-currentCard * 100}%, 0, 0)` }}
        >
          {deckFlashcards.map((card, i) => (
            <FlipCard
              autoPlay={autoPlay}
              key={i}
              index={i}
              currentCard={currentCard}
              card={card}
            />
          ))}
          {cardsNum === 0 && <FlipCardEmpty />}
        </div>
      </div>

      {/* Control the flip card state */}
      <div className={cn('fc-control', cardsNum === 0 && 'mb-0')}>
        <div className="fc-control__left">
          <Tooltip
            title={autoPlay ? 'Auto playing is on' : 'Auto play'}
            placement="top"
          >
            <div
              onClick={() => {
                setAutoPlay(!autoPlay);
              }}
              className={cn(
                'control-btn__wrap',
                cardsNum === 0 && 'control-btn--disabled'
              )}
            >
              {autoPlay ? <FaPause /> : <FaPlay />}
            </div>
          </Tooltip>
          <Tooltip title="Shuffle" placement="top">
            <div
              className={cn(
                'control-btn__wrap',
                cardsNum === 0 && 'control-btn--disabled'
              )}
            >
              <FaShuffle />
            </div>
          </Tooltip>
        </div>

        <div className="fc-control__center">
          <Tooltip title="Prev Card" placement="top">
            <div
              onClick={() => {
                setAutoPlay(false);
                setCurrentCard(
                  currentCard === 0 ? cardsNum - 1 : currentCard - 1
                );
              }}
              className={cn(
                'control-btn__wrap control-btn--border',
                cardsNum === 0 &&
                  'control-btn--disabled control-btn--border--disabled'
              )}
            >
              <MdKeyboardArrowLeft className="icon" />
            </div>
          </Tooltip>
          <p className="text-lg font-medium">
            {cardsNum > 0 ? currentCard + 1 : 0}&nbsp;/&nbsp;{cardsNum}
          </p>
          <Tooltip title="Next Card" placement="top">
            <div
              onClick={() => {
                setAutoPlay(false);
                setCurrentCard(
                  currentCard === cardsNum - 1 ? 0 : currentCard + 1
                );
              }}
              className={cn(
                'control-btn__wrap control-btn--border',
                cardsNum === 0 &&
                  'control-btn--disabled control-btn--border--disabled'
              )}
            >
              <MdKeyboardArrowRight className="icon" />
            </div>
          </Tooltip>
        </div>

        <div className="fc-control__right">
          <Tooltip title="Settings" placement="top">
            <div className="control-btn__wrap">
              <IoSettings style={{ fontSize: 24 }} />
            </div>
          </Tooltip>
        </div>
      </div>

      {deckFlashcards.map((card, i) => (
        <CardItem key={i} index={i} card={card} />
      ))}
      <AddFlashcards initId={cardsNum} containerRef={containerRef} />
    </div>
  );
};

export default FlipMode;
