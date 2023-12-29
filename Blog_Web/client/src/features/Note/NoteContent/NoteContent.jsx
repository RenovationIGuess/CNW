import React, { useEffect, useMemo, useRef, useState } from 'react';
import TiptapSkeletonLoading from '~/components/Tiptap/TiptapSkeletonLoading';
import Tiptap from '~/components/Tiptap/Tiptap';
import TiptapComment from '~/components/Tiptap/TiptapComment';
import NoteComments from '../../components/NoteComments/NoteComments';
import NoteHistoriesSkeletonLoading from '../../components/NoteHistories/NoteHistoriesSkeletonLoading';
import NoteHistories from '../../components/NoteHistories/NoteHistories';
import Toolbox from '~/components/Toolbox/Toolbox';
import NoteBasicInfo from '../NoteBasicInfo/NoteBasicInfo';
import NoteAttributes from '../NoteAttributes/NoteAttributes';
import NoteContentHeader from './NoteContentHeader';
import axiosClient from '~/axios';
import { userStateContext } from '~/contexts/ContextProvider';
import NoteInfoEditModal from '../NoteInfoEditModal/NoteInfoEditModal';
import NoteBgModal from '../NoteBgModal/NoteBgModal';
import { toast } from 'react-toastify';
import useNoteStore from '~/store/useNoteStore';
import { MdKeyboardDoubleArrowRight } from 'react-icons/md';
import { Tooltip } from 'antd';
import clsx from 'clsx';
import useSidebarStore from '~/store/useSidebarStore';
import BlockNoteEditor from '~/components/BlockNoteEditor/BlockNoteEditor';
import useModalStore from '~/store/useModalStore';
import { images } from '~/constants';

const NoteContent = ({
  editModalOpen,
  setEditModalOpen,
  bgModalOpen,
  setBgModalOpen,
  viewState,
  setViewState,
}) => {
  const { currentUser } = userStateContext();

  const pageRightRef = useRef();

  const [note, setNote, fetchNoteLoading] = useNoteStore((state) => [
    state.note,
    state.setNote,
    state.fetchNoteLoading,
  ]);

  const [handleUpdateItems] = useSidebarStore((state) => [
    state.handleUpdateItems,
  ]);

  const [setDirectoryModalOpen, setDirModalUseType, setDataToSetPath] =
    useModalStore((state) => [
      state.setDirectoryModalOpen,
      state.setDirModalUseType,
      state.setDataToSetPath,
    ]);

  // Comment manage state
  const [comments, setComments] = useState([]);
  const [openRightSide, setOpenRightSide] = useState(true);
  const [fetchCommentsLoading, setFetchCommentsLoading] = useState(true);

  // History manage state
  const [histories, setHistories] = useState([]);
  const [fetchHistoriesLoading, setFetchHistoriesLoading] = useState(true);

  // Save the comment content to save to db
  // On first load, note will not be defined because it hasn't been fetched
  // => note_id will be null
  const [commentInfo, setCommentInfo] = useState({
    note_id: note.id,
    user_id: currentUser.id,
    note_comment_id: null,
    reply_to: null,
    content_json: '',
    content_html: '',
    selected_text: '',
    pinned: false,
  });
  const [sendCommentLoading, setSendCommentLoading] = useState(false);
  // Control reply input open state
  const [commentReplyBoxOpen, setCommentReplyBoxOpen] = useState([]);

  // Action toast state manage
  const [setActionToast] = useModalStore((state) => [state.setActionToast]);

  // 2 type: tiptap & notion
  const [editorType, setEditorType] = useState('tiptap');

  const toolList = useMemo(() => {
    return [
      // First row
      {
        title: 'Attach Note',
        icon: images.page,
        tooltip: 'Attach Note',
        callback: () => {
          setDirModalUseType('attach');
          setDirectoryModalOpen(true);
        },
      },
      {
        title: 'Attach Deck',
        icon: images.flashcards,
        tooltip: 'Attach Deck',
        callback: () => {
          setDirModalUseType('attach');
          setDirectoryModalOpen(true);
        },
      },
      {
        title: 'Attach Schedule',
        icon: images.check,
        tooltip: 'Attach Schedule',
        callback: () => {
          setDirModalUseType('attach');
          setDirectoryModalOpen(true);
        },
      },
      {
        title: 'Share',
        icon: images.team,
        tooltip: 'Make this available on your public profile',
        callback: () => {},
      },
      {
        title: 'Set Background',
        icon: images.cards,
        tooltip: "Change note's background",
        callback: () => {
          setBgModalOpen(true);
        },
      },
      {
        title: 'Set Info',
        icon: images.info,
        tooltip: "Change note's info",
        callback: () => {
          setEditModalOpen(true);
        },
      },
      {
        title: 'Set Location',
        icon: images.map,
        tooltip: "Change note's location",
        callback: () => {
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
  }, []);

  // Update the data for the change location
  useEffect(() => {
    setDataToSetPath(note);
  }, [note]);

  // Them event listener cho Ctrl + S => de luu note luon
  useEffect(() => {
    window.removeEventListener('keydown', handleKeyDown);
    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [note]);

  const handleKeyDown = (event) => {
    const code = event.which || event.keyCode;

    let charCode = String.fromCharCode(code).toLowerCase();
    if ((event.ctrlKey || event.metaKey) && charCode === 's') {
      event.preventDefault();
      handleSaveContent();
      setActionToast({
        status: true,
        message: 'Saved',
      });
    }
  };

  const handleSaveContent = async () => {
    await axiosClient
      .patch(`/notes/${note.id}/content`, {
        content_html: note.content_html,
        content_json: note.content_json,
      })
      .catch((err) => console.log(err));
  };

  const handleSendComment = () => {
    setSendCommentLoading(true);
    axiosClient
      .post(`/notes/${note.id}/comments`, {
        ...commentInfo,
        note_id: note.id,
      })
      .then(({ data }) => {
        // console.log(data);
        setComments([data.data, ...comments]);

        setCommentInfo({
          ...commentInfo,
          content_json: '',
          content_html: '',
          selected_text: '',
          pinned: false,
        });

        setCommentReplyBoxOpen([
          {
            comment_id: data.data.id,
            state: false,
            // replies: [],
          },
          ...commentReplyBoxOpen,
        ]);

        setActionToast({
          status: true,
          message: data.message,
        });
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setSendCommentLoading(false);
      });
  };

  const handleStarredNote = async () => {
    const id = toast.success('Sending request...', {
      isLoading: true,
    });
    try {
      await axiosClient
        .patch(`/notes/${note.id}`, {
          ...note,
          starred: !note.starred,
        })
        .then(({ data }) => {
          const newNote = data.data;
          const belongsToPublic = newNote.path[0].title === 'Public';

          if (belongsToPublic) {
            handleUpdateItems(newNote, false);
          } else {
            handleUpdateItems(newNote);
          }

          // When we update the current note => also have to update the directory in the sidebar
          setNote({ ...data.data });
        })
        .catch((err) => {
          console.log(err);
        });

      toast.update(id, {
        render: 'Update note successfully!',
        // type: "success",
        isLoading: false,
        autoClose: 1500,
        // closeButton: null
      });
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  const fetchNoteComments = () => {
    // Fetch note's comments
    axiosClient
      .get(`/notes/${note.id}/comments`)
      .then(({ data }) => {
        // console.log(data);
        setComments(data.data);

        // Now the returned value is the list of top-level comments
        // For each comment, loop through its replies, by that way we'll have
        // Ex: comment id = 1 at the index of 1, after that is its replies
        // => [comment-1, ...comment-1.replies.length, comment-2 and so on]
        for (const comment of data.data) {
          // Push the comment in first
          commentReplyBoxOpen.push({
            comment_id: comment.id,
            state: false,
          });

          // Then the replies
          for (const reply of comment.replies) {
            commentReplyBoxOpen.push({
              comment_id: reply.id,
              state: false,
            });
          }
        }
        setCommentReplyBoxOpen([...commentReplyBoxOpen]);
      })
      .catch((err) => console.log(err))
      .finally(() => setFetchCommentsLoading(false));
  };

  const fetchNoteHistories = () => {
    axiosClient
      .get(`/notes/${note.id}/histories`)
      .then(({ data }) => {
        setHistories(data.data);
      })
      .catch((err) => console.log(err))
      .finally(() => setFetchHistoriesLoading(false));
  };

  return (
    <>
      <div className={`page-root-container__content`}>
        <div className="page-scroller">
          <div
            className={clsx(
              'page-root-container__left',
              'page-root-container--bg',
              'page-root-container__left--note',
              'page-root-container--border-right'
            )}
          >
            <NoteContentHeader
              editorType={editorType}
              setEditorType={setEditorType}
              viewState={viewState}
              setViewState={setViewState}
              fetchNoteComments={fetchNoteComments}
              fetchNoteHistories={fetchNoteHistories}
              handleStarredNote={handleStarredNote}
              pageRightRef={pageRightRef}
              openRightSide={openRightSide}
              setOpenRightSide={setOpenRightSide}
            />
            <div
              className={`page-center-content${
                viewState === 'content' ? '' : ' overflow-auto'
              }`}
            >
              {viewState === 'content' ? (
                fetchNoteLoading ? (
                  <TiptapSkeletonLoading />
                ) : editorType === 'tiptap' ? (
                  <Tiptap
                    noteId={note.id}
                    contentHTML={note.content_html}
                    contentJSON={note.content_json}
                    setNote={setNote}
                  />
                ) : (
                  <BlockNoteEditor
                    data={note}
                    editable={true}
                    setData={setNote}
                  />
                )
              ) : viewState === 'comments' ? (
                <>
                  <div className="note-comment__create--section">
                    <TiptapComment
                      sendCommentLoading={sendCommentLoading}
                      comment={commentInfo}
                      setComment={setCommentInfo}
                      handleSendComment={handleSendComment}
                    />
                  </div>
                  <NoteComments
                    comments={comments}
                    setComments={setComments}
                    note={note}
                    setCommentReplyBoxOpen={setCommentReplyBoxOpen}
                    commentReplyBoxOpen={commentReplyBoxOpen}
                    fetchCommentsLoading={fetchCommentsLoading}
                  />
                </>
              ) : fetchHistoriesLoading ? (
                <NoteHistoriesSkeletonLoading />
              ) : (
                <>
                  <NoteHistories
                    note={note}
                    setNote={setNote}
                    histories={histories}
                    setHistories={setHistories}
                  />
                </>
              )}
            </div>
          </div>
          <div
            ref={pageRightRef}
            className="page-root-container__right scrollable-y page-root-container--bg"
          >
            <div className="layout__sub w-full">
              <div>
                <div className="w-[336px]">
                  <div className="right-sidebar__header note-content__right">
                    <Tooltip placement="bottom" title="Minimized">
                      <div
                        // onClick={handleCloseRightSidebar}
                        className="expand-icon__wrapper"
                      >
                        <MdKeyboardDoubleArrowRight
                          onClick={() => {
                            pageRightRef &&
                              pageRightRef.current.classList.toggle(
                                'page-root-container__right--closed'
                              );
                            // setTimeout(
                            //   () => setOpenRightSide(false),
                            //   200
                            // );
                            setOpenRightSide(false);
                          }}
                          className="expand-icon expand-icon--bg"
                        />
                      </div>
                    </Tooltip>
                  </div>
                  <Toolbox toolList={toolList} type="straight" />
                  <NoteBasicInfo />
                  <NoteAttributes />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!fetchNoteLoading && (
        <>
          <NoteInfoEditModal
            noteInfo={note}
            setNoteInfo={setNote}
            editModalOpen={editModalOpen}
            setEditModalOpen={setEditModalOpen}
            setHistories={setHistories}
          />

          <NoteBgModal
            noteInfo={note}
            setNoteInfo={setNote}
            bgModalOpen={bgModalOpen}
            setBgModalOpen={setBgModalOpen}
            setHistories={setHistories}
          />
        </>
      )}
    </>
  );
};

export default NoteContent;
