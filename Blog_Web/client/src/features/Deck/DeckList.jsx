import React from 'react';
import useFlashcardStore from '~/store/useFlashcardStore';
import DeckItem from './DeckItem';
import { images } from '~/constants';
import DeckItemSkeleton from './DeckItemSkeleton';

const DeckList = () => {
  const [decks] = useFlashcardStore((state) => [state.decks]);

  const [fetchingDecks] = useFlashcardStore((state) => [state.fetchingDecks]);

  if (fetchingDecks)
    return (
      <div className="deck-list">
        <DeckItemSkeleton />
        <DeckItemSkeleton />
        <div className="note-comment__bottom">
          <span className="my-loader mr-2"></span>
          <span>Loading...</span>
        </div>
      </div>
    );

  return (
    <div className="deck-list">
      {decks.length > 0 ? (
        <>
          {decks.map((deck, index) => (
            <DeckItem key={deck.id} data={deck} index={index} />
          ))}
          <div className="note-comment__bottom">
            <span>This is the end ~</span>
          </div>
        </>
      ) : (
        <div className="data-empty__container">
          <img
            src={images.nothing}
            alt="data-empty-img"
            className="data-empty__img"
          />
          <p className="data-empty__title">No deck were found ~_~</p>
        </div>
      )}
    </div>
  );
};

export default DeckList;
