import React, { useEffect, useRef, useState } from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { cn } from '~/utils';
import IconSelector from '../IconSelector/IconSelector';
import { Popover } from 'antd';
import { HiDotsHorizontal } from 'react-icons/hi';
import MoreOptions from './MoreOptions';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosClient from '~/axios';
import useNoteStore from '~/store/useNoteStore';
import useNotesStore from '~/store/useNotesStore';
import useSidebarStore from '~/store/useSidebarStore';
import useModalStore from '~/store/useModalStore';
import { useDrag } from 'react-dnd';

// isModal is use to check if this sidebar is in the directory modal or not
// active is use to check if this item is being selected
// data - data of the item - could be note, directory, calendar, flashcards
// disableAction - use to disable the more options when use in DirectoryModal
const NoteItem = ({
  data,
  isModal = false,
  rootType,
  level,
  active = false,
  disableAction,
}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const dataRef = useRef();

  const [notes, setNotes, currentNote, setCurrentNote] = useNotesStore(
    (state) => [
      state.notes,
      state.setNotes,
      state.currentNote,
      state.setCurrentNote,
    ]
  );

  const [note, setNote] = useNoteStore((state) => [state.note, state.setNote]);

  const [handleUpdateItems] = useSidebarStore((state) => [
    state.handleUpdateItems,
  ]);

  const [setActionToast] = useModalStore((state) => [state.setActionToast]);

  const [moreOptionsOpen, setMoreOptionsOpen] = useState(false);
  const [iconChangeOpen, setIconChangeOpen] = useState(false);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const [{ isDragging }, drag] = useDrag(() => ({
    item: { ...data, getData: () => dataRef.current },
    type: data.data_type,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleStarredNote = async (e) => {
    e.stopPropagation();
    axiosClient
      .patch(`/notes/${data.id}`, {
        ...data,
        starred: !data.starred,
      })
      .then(({ data }) => {
        const newData = data.data;

        if (rootType === 'private') {
          handleUpdateItems(newData);
        } else {
          handleUpdateItems(newData, false);
        }

        // If the user is editing the note
        if (pathname === `/notes/${data.data.id}`) {
          setNote({
            ...note,
            starred: newData.starred,
          });
        }

        if (pathname === '/notes') {
          if (Object.keys(currentNote).length > 0) {
            if (currentNote.id === data.data.id) {
              setCurrentNote({
                ...currentNote,
                starred: newData.starred,
              });
            }
          }

          setNotes(
            notes.map((item) => {
              if (item.id === data.data.id) {
                return {
                  ...item,
                  starred: newData.starred,
                };
              } else return item;
            })
          );
        }

        setActionToast({
          status: true,
          message: 'Updated',
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChangeIcon = (icon) => {
    // We can change the position of this setPopoverOpen when we're done with the UI/UX
    setIconChangeOpen(false);

    const url = `/notes/${data.id}`;
    axiosClient
      .patch(url, {
        ...data,
        icon: icon,
      })
      .then(({ data }) => {
        const newData = data.data;

        if (rootType === 'private') {
          handleUpdateItems(newData);
        } else {
          handleUpdateItems(newData, false);
        }

        if (
          location.pathname === `/notes/${newData.id}` &&
          newData.data_type === 'note'
        ) {
          setNote({
            ...note,
            icon: icon,
          });
        }

        if (location.pathname === '/notes' && newData.data_type === 'note') {
          if (Object.keys(currentNote).length > 0) {
            if (currentNote.id === newData.id) {
              setCurrentNote({
                ...currentNote,
                icon: icon,
              });
            }
          }

          setNotes(
            notes.map((item) => {
              if (item.id === newData.id) {
                return {
                  ...item,
                  icon: icon,
                };
              } else return item;
            })
          );
        }

        setActionToast({
          status: true,
          message: 'Updated',
        });
      })
      .catch((err) => console.error(err));
  };

  return (
    <div
      className={cn(
        `elements-header`,
        isDragging && 'elements-header--active cursor-move',
        !isModal && active && 'elements-header--active'
      )}
      ref={drag}
      onClick={() => {
        if (isModal) {
        } else {
          navigate(`/notes/${data.id}`);
        }
      }}
      style={{ paddingLeft: `${level * 24 + 4}px` }}
    >
      <div className={`flex items-center overflow-hidden`}>
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleStarredNote(e);
          }}
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
                handleStarred={handleStarredNote}
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

export default NoteItem;
