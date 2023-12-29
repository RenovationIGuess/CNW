import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { cn } from '~/utils';
import IconSelector from '../IconSelector/IconSelector';
import { Popover } from 'antd';
import { HiDotsHorizontal } from 'react-icons/hi';
import MoreOptions from './MoreOptions';
import { useLocation, useNavigate } from 'react-router-dom';
import useModalStore from '~/store/useModalStore';
import useSidebarStore from '~/store/useSidebarStore';
import axiosClient from '~/axios';
import { useDrag } from 'react-dnd';
import useFlashcardStore from '~/store/useFlashcardStore';

const DeckItem = ({
  rootType,
  data,
  isModal,
  level,
  active,
  disableAction,
}) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const dataRef = useRef();

  const [decks, setDecks] = useFlashcardStore((state) => [
    state.decks,
    state.setDecks,
  ]);

  const [setDeck] = useFlashcardStore((state) => [state.setDeck]);

  const [handleUpdateItems] = useSidebarStore((state) => [
    state.handleUpdateItems,
  ]);

  const [setActionToast] = useModalStore((state) => [state.setActionToast]);

  const [moreOptionsOpen, setMoreOptionsOpen] = useState(false);
  const [iconChangeOpen, setIconChangeOpen] = useState(false);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const belongsToPublic = useMemo(() => {
    return data.path[0].title === 'Public';
  }, [data.id, data.path]);

  const [{ isDragging }, drag] = useDrag(() => ({
    item: { id: data.id, getData: () => dataRef.current },
    type: data.data_type,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleChangeIcon = (icon) => {
    axiosClient
      .patch(`/decks/${data.id}/icon`, {
        icon: icon,
      })
      .then(({ data }) => {
        const newDeck = data.data;

        setIconChangeOpen(false);

        if (pathname === '/decks') {
          setDecks(
            decks.map((deck) => (deck.id === newDeck.id ? newDeck : deck))
          );
        }

        if (pathname === `/decks/${newDeck.id}`) {
          setDeck(newDeck);
        }

        handleUpdateItems(newDeck, !belongsToPublic);

        setActionToast({
          status: true,
          message: 'Updated',
        });
      })
      .catch((err) => console.error(err));
  };

  const handleStarredDeck = (e) => {
    e.stopPropagation();
    axiosClient
      .patch(`/decks/${data.id}/star`)
      .then(({ data }) => {
        const newDeck = data.data;

        if (pathname === '/decks') {
          setDecks(
            decks.map((deck) => (deck.id === newDeck.id ? newDeck : deck))
          );
        }

        if (pathname === `/decks/${data.id}`) {
          setDeck(newDeck);
        }

        handleUpdateItems(newDeck, !belongsToPublic);

        setActionToast({
          status: true,
          message: data.starred ? 'Removed' : 'Added',
        });
      })
      .catch((err) => console.error(err));
  };

  return (
    <div
      ref={drag}
      className={cn(
        `elements-header`,
        isDragging && 'elements-header--active cursor-move',
        active && 'elements-header--active'
      )}
      onClick={() => {
        if (isModal) {
        } else {
          navigate(`/decks/${data.id}`);
        }
      }}
      style={{ paddingLeft: `${level * 24 + 4}px` }}
    >
      <div className={`flex items-center overflow-hidden`}>
        <div
          onClick={(e) => handleStarredDeck(e)}
          className="elements-arrow-icon--wrp"
        >
          {data.starred ? (
            <AiFillStar className="elements-arrow-icon" />
          ) : (
            <AiOutlineStar className="elements-arrow-icon" />
          )}
        </div>

        <Popover
          rootClassName="custom-popover"
          trigger="click"
          placement="bottomLeft"
          arrow={false}
          content={<IconSelector callback={handleChangeIcon} />}
          open={iconChangeOpen}
          onOpenChange={() => setIconChangeOpen(!iconChangeOpen)}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              setIconChangeOpen(!iconChangeOpen);
            }}
            className="sidebar-element-icon__wrp"
          >
            {data.icon.includes('/') ? (
              <img src={data.icon} alt="item-icon" />
            ) : (
              <p>{data.icon}</p>
            )}
          </div>
        </Popover>
        <div className="teamspace-header__title">{data.title}</div>
      </div>
      <div className="flex items-center">
        {!disableAction && (
          <Popover
            rootClassName="custom-popover"
            trigger={'click'}
            placement="bottomLeft"
            content={
              <MoreOptions
                rootType={rootType}
                data={data}
                setPopoverOpen={setMoreOptionsOpen}
                handleStarred={handleStarredDeck}
              />
            }
            open={moreOptionsOpen}
            onOpenChange={() => setMoreOptionsOpen(!moreOptionsOpen)}
          >
            <HiDotsHorizontal
              onClick={(e) => e.stopPropagation()}
              className="list-header__icon"
            />
          </Popover>
        )}
      </div>
    </div>
  );
};

export default DeckItem;
