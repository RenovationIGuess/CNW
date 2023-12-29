import { Tooltip } from 'antd';
import React, { Fragment, useRef, useState } from 'react';
import { images } from '~/constants';
import { userStateContext } from '~/contexts/ContextProvider';
import axiosClient from '~/axios';
import { useNavigate } from 'react-router-dom';
import {
  MdKeyboardDoubleArrowDown,
  MdOutlineArrowForwardIos,
} from 'react-icons/md';
import clsx from 'clsx';
import useSidebarStore from '~/store/useSidebarStore';
import useModalStore from '~/store/useModalStore';
import { toast } from 'sonner';
import { cn } from '~/utils';

// type = straight | spacing
// toolList will contains list of tools that will be provided
/* Example:
  {
    tooltip: '',
    icon: '',
    title: '',
    callback: () => {},
  }
*/
const Toolbox = ({ type = 'spacing', toolList }) => {
  const navigate = useNavigate();
  const { currentUser } = userStateContext();

  const ref = useRef();

  const [currentInd, setCurrentInd] = useState(0);

  const [privateItems, setPrivateItems] = useSidebarStore((state) => [
    state.privateItems,
    state.setPrivateItems,
  ]);

  const [setActionToast] = useModalStore((state) => [state.setActionToast]);

  // This will also set default directory as private directory
  const createNewNote = () => {
    const toastId = toast.loading('Creating new note...');
    axiosClient
      .post(`/notes`, {
        user_id: currentUser.id,
        directory_id: currentUser.private_dir.id,
        title: 'New note',
        description: 'Chưa có',
        background_image: import.meta.env.VITE_DEFAULT_NOTE_BACKGROUND_URL,
        icon: import.meta.env.VITE_DEFAULT_NOTE_ICON_URL,
        content_html: '',
        content_json: '',
        starred: false,
      })
      .then(({ data }) => {
        const newNote = data.data;

        if (privateItems[newNote.directory_id] !== undefined) {
          // console.log(privateItems[newDir.directory_id]);
          const newPrivateItems = {
            ...privateItems,
            [newNote.directory_id]: {
              ...privateItems[newNote.directory_id],
              child_items: [
                newNote,
                ...privateItems[newNote.directory_id].child_items,
              ],
            },
          };
          setPrivateItems(newPrivateItems);
        }

        toast.dismiss(toastId);

        setActionToast({
          status: true,
          message: 'Created',
        });

        // To the detail page of that note
        navigate(`/notes/${data.data.id}`);
      })
      .catch((err) => {
        console.error(err);
        toast.error('Failed to create new note');
      });
  };

  const createNewDeck = () => {
    const toastId = toast.loading('Creating new deck...');
    axiosClient
      .post(`/decks`, {
        title: 'New Deck',
        icon: import.meta.env.VITE_DEFAULT_DECK_ICON_URL,
        description: '',
        user_id: currentUser.id,
        directory_id: currentUser.private_dir.id,
        flashcards: [],
        tag_ids: [],
      })
      .then(({ data }) => {
        const newDeck = data.data;

        if (privateItems[newDeck.directory_id] !== undefined) {
          // console.log(privateItems[newDir.directory_id]);
          const newPrivateItems = {
            ...privateItems,
            [newDeck.directory_id]: {
              ...privateItems[newDeck.directory_id],
              child_items: [
                newDeck,
                ...privateItems[newDeck.directory_id].child_items,
              ],
            },
          };
          setPrivateItems(newPrivateItems);
        }

        toast.dismiss(toastId);

        setActionToast({
          status: true,
          message: 'Created',
        });

        // To the detail page of that note
        navigate(`/decks/${data.data.id}`);
      })
      .catch((err) => {
        console.error(err);
        toast.error('Failed to create new deck');
      });
  };

  const createNewSchedule = () => {
    const toastId = toast.loading('Creating new schedule...');
    axiosClient
      .post(`/schedules`, {
        title: 'New Schedule',
        icon: import.meta.env.VITE_DEFAULT_CALENDAR_ICON_URL,
        background_image: '',
        description: '',
        user_id: currentUser.id,
        directory_id: currentUser.private_dir.id,
        tag_ids: [],
      })
      .then(({ data }) => {
        const newSchedule = data.data;

        if (privateItems[newSchedule.directory_id] !== undefined) {
          // console.log(privateItems[newDir.directory_id]);
          const newPrivateItems = {
            ...privateItems,
            [newSchedule.directory_id]: {
              ...privateItems[newSchedule.directory_id],
              child_items: [
                newSchedule,
                ...privateItems[newSchedule.directory_id].child_items,
              ],
            },
          };
          setPrivateItems(newPrivateItems);
        }

        toast.dismiss(toastId);

        setActionToast({
          status: true,
          message: 'Created',
        });

        // To the detail page of that note
        navigate(`/schedules/${data.data.id}`);
      })
      .catch((err) => {
        console.error(err);
        toast.error('Failed to create new schedule');
      });
  };

  return (
    <div
      ref={ref}
      className={clsx(
        { 'side-section': type === 'spacing' },
        { 'side-section-db': type === 'straight' },
        'toolbox-section',
        'pt-0'
      )}
    >
      <div className="side-section__header-border">
        <h2 className="side-section__title">
          <div className="flex items-center justify-between">
            <span>Tools</span>
            <ul className="tools-pagination">
              {Array.from({ length: 3 }).map((_, i) => (
                <li
                  className={cn(
                    'pager-number',
                    currentInd === i && 'pager-number--active'
                  )}
                  onClick={() => setCurrentInd(i)}
                  key={i}
                >
                  {i + 1}
                </li>
              ))}
            </ul>
            {type === 'straight' && (
              <MdKeyboardDoubleArrowDown
                role="button"
                title="Edit attributes"
                className="side-section__icon"
                onClick={() => {
                  ref &&
                    ref.current.classList.toggle('side-section-db--closed');
                }}
              />
            )}
          </div>
        </h2>
      </div>
      <div className="side-section__body-db toolbox-section__body">
        <div className="note-tools-container" style={{ height: 312 }}>
          <div className="swiper-container">
            <div
              className="swiper-wrapper"
              style={{
                transform: `translate3d(${-currentInd * 100}%, 0px, 0px)`,
                transitionDuration: '300ms',
              }}
            >
              <div className="tools-list">
                {toolList?.map((tool, i) => (
                  <Fragment key={i}>
                    <Tooltip placement="top" title={tool.tooltip}>
                      <div
                        onClick={() => {
                          if (typeof tool.callback === 'string') {
                            switch (tool.callback) {
                              case 'createNewNote':
                                createNewNote();
                                break;
                              case 'createNewDeck':
                                createNewDeck();
                                break;
                              case 'createNewSchedule':
                                createNewSchedule();
                                break;
                              default:
                                break;
                            }
                          } else if (typeof tool.callback === 'function')
                            tool.callback();
                        }}
                        className="tools-item"
                      >
                        <div className="w-full h-full">
                          <div className="tool-main">
                            <div className="tool-logo">
                              <img
                                src={tool.icon}
                                alt="setting"
                                className="tool-img"
                              />
                            </div>
                            <div className="tool-name">{tool.title}</div>
                          </div>
                        </div>
                      </div>
                    </Tooltip>
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {currentInd > 0 && (
        <div
          role="button"
          className="navigation-prev"
          onClick={() => setCurrentInd(currentInd - 1)}
        >
          <MdOutlineArrowForwardIos className="icon" />
        </div>
      )}
      <div
        role="button"
        className="navigation-next"
        onClick={() => setCurrentInd(currentInd + 1)}
      >
        <MdOutlineArrowForwardIos className="icon" />
      </div>
    </div>
  );
};

export default Toolbox;
