import React, { useMemo } from 'react';
import { AiFillStar, AiOutlineEdit, AiOutlineStar } from 'react-icons/ai';
import { BsTrash } from 'react-icons/bs';
import axiosClient from '~/axios';
import { FaShareAlt } from 'react-icons/fa';
import useModalStore from '~/store/useModalStore';
import useFlashcardStore from '~/store/useFlashcardStore';
import useSidebarStore from '~/store/useSidebarStore';

const MoreActions = ({ index, data, setPopoverOpen }) => {
  const [
    setConfirmModalInfo,
    setConfirmModalOpen,
    setConfirmModalLoading,
    setActionToast,
  ] = useModalStore((state) => [
    state.setConfirmModalInfo,
    state.setConfirmModalOpen,
    state.setConfirmModalLoading,
    state.setActionToast,
  ]);

  const [decks, setDecks] = useFlashcardStore((state) => [
    state.decks,
    state.setDecks,
  ]);

  const [setShouldOpenModal] = useFlashcardStore((state) => [
    state.setShouldOpenModal,
  ]);

  const [setSelectedDeck] = useFlashcardStore((state) => [
    state.setSelectedDeck,
  ]);

  const [handleDeleteItems, handleUpdateItems] = useSidebarStore((state) => [
    state.handleDeleteItems,
    state.handleUpdateItems,
  ]);

  const belongsToPublic = useMemo(() => {
    return data.path[0].title === 'Public';
  }, [data.id, data.path]);

  const handleDeleteDeck = () => {
    setConfirmModalLoading(true);
    axiosClient
      .delete(`/decks/${data.id}`)
      .then(({}) => {
        setDecks(decks.filter((deck) => deck.id !== data.id));

        handleDeleteItems(data, !belongsToPublic);

        setActionToast({
          status: true,
          message: 'Deleted',
        });
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setConfirmModalLoading(false);
        setTimeout(() => {
          setConfirmModalOpen(false);
        }, 0);
      });
  };

  const handleStarredDeck = () => {
    axiosClient
      .patch(`/decks/${data.id}/star`)
      .then(({ data }) => {
        const newDeck = data.data;

        decks[index] = newDeck;
        setDecks([...decks]);

        handleUpdateItems(newDeck, !belongsToPublic);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setActionToast({
          status: true,
          message: data.starred ? 'Removed' : 'Added',
        });
      });
  };

  return (
    <div className="action-menu">
      <div className="action-menu__title">More</div>
      <ul className="action-menu__list">
        <li
          className="action-menu__item"
          onClick={() => {
            setSelectedDeck(data);
            setShouldOpenModal(true);
            setPopoverOpen(false);
          }}
        >
          <AiOutlineEdit className="action-menu__icon" />
          <span className="action-menu__label">Edit Deck</span>
        </li>
        <li
          onClick={(e) => {
            e.stopPropagation();
            setPopoverOpen(false);
            handleStarredDeck();
          }}
          className="action-menu__item"
        >
          {data.starred ? (
            <>
              <AiFillStar className="action-menu__icon" />
              <span className="action-menu__label">Remove from starred</span>
            </>
          ) : (
            <>
              <AiOutlineStar className="action-menu__icon" />
              <span className="action-menu__label">Add to starred</span>
            </>
          )}
        </li>
        <li
          className="action-menu__item"
          onClick={() => {
            setPopoverOpen(false);
          }}
        >
          <FaShareAlt className="action-menu__icon" />
          <span className="action-menu__label">Share Deck</span>
        </li>
        <li
          onClick={(e) => {
            e.stopPropagation();
            setConfirmModalOpen(true);
            setConfirmModalInfo({
              title: 'Are you sure you want to delete this deck?',
              message:
                'After deleted, this deck will still be in archived datas.',
              callback: handleDeleteDeck,
            });
            setPopoverOpen(false);
          }}
          className="action-menu__item"
        >
          <BsTrash className="action-menu__icon" />
          <span className="action-menu__label">Delete Deck</span>
        </li>
      </ul>
    </div>
  );
};

export default MoreActions;
