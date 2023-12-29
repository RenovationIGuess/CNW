import { Tooltip } from 'antd';
import React, { useState } from 'react';
import {
  AiFillEdit,
  AiFillStar,
  AiOutlineClockCircle,
  AiOutlineStar,
} from 'react-icons/ai';
import { BiCommentDetail } from 'react-icons/bi';
import { BsFileEarmarkRichtext, BsThreeDots } from 'react-icons/bs';
import { cn, stringUtils } from '~/utils';
import useNoteStore from '~/store/useNoteStore';
import { MdKeyboardDoubleArrowLeft } from 'react-icons/md';
import { RiNotionFill } from 'react-icons/ri';

const NoteContentHeader = ({
  editorType,
  setEditorType,
  viewState,
  setViewState,
  fetchNoteComments,
  fetchNoteHistories,
  handleStarredNote,
  pageRightRef,
  openRightSide,
  setOpenRightSide,
}) => {
  const note = useNoteStore((state) => state.note);

  const [saveContentLoading] = useNoteStore((state) => [
    state.saveContentLoading,
  ]);

  const [commentFirstLoad, setCommentFirstLoad] = useState(false);
  const [historiesFirstLoad, setHistoriesFirstLoad] = useState(false);

  return (
    <div className="page-header">
      <div className="page-header-mask">
        <div className="page-header-wrp">
          <div className="page-header-content">
            <div className="switch-tab">
              <div className="page-title-container">
                <span className="page__title">
                  Note {stringUtils.uppercaseStr(viewState)}
                </span>
                {viewState === 'content' && saveContentLoading && (
                  <span className="save-loader">
                    <span className="my-loader gray-loader mr-2"></span>
                    Saving...
                  </span>
                )}
              </div>
              <ul className="switch-tab__list">
                <Tooltip placement="top" title="Edit the note's content">
                  <li
                    className={`switch-tab__icon${
                      viewState === 'content' ? ' switch-tab__icon--active' : ''
                    }`}
                    onClick={() => {
                      setViewState('content');
                    }}
                  >
                    <AiFillEdit className="tab__icon" />
                    <span className="switch-tab__line"></span>
                  </li>
                </Tooltip>
                {editorType === 'tiptap' ? (
                  <Tooltip
                    placement="top"
                    title="Switch to a Notion-like editor"
                  >
                    <li
                      className={cn(
                        `switch-tab__icon`,
                        viewState !== 'content' && 'switch-tab__icon--disabled'
                      )}
                      onClick={() => {
                        setEditorType('notion');
                      }}
                    >
                      <RiNotionFill className="tab__icon" />
                      <span className="switch-tab__line"></span>
                    </li>
                  </Tooltip>
                ) : (
                  <Tooltip
                    placement="top"
                    title="Switch to normal rich-text editor"
                  >
                    <li
                      className={cn(
                        `switch-tab__icon`,
                        viewState !== 'content' && 'switch-tab__icon--disabled'
                      )}
                      onClick={() => {
                        setEditorType('tiptap');
                      }}
                    >
                      <BsFileEarmarkRichtext className="tab__icon" />
                      <span className="switch-tab__line"></span>
                    </li>
                  </Tooltip>
                )}
                <Tooltip placement="top" title="View comments">
                  <li
                    className={`switch-tab__icon${
                      viewState === 'comments'
                        ? ' switch-tab__icon--active'
                        : ''
                    }`}
                    onClick={() => {
                      setViewState('comments');
                      if (!commentFirstLoad) {
                        setCommentFirstLoad(true);
                        fetchNoteComments();
                      }
                    }}
                  >
                    <BiCommentDetail className="tab__icon" />
                    <span className="switch-tab__line"></span>
                  </li>
                </Tooltip>
                <Tooltip placement="top" title="See changes history">
                  <li
                    className={`switch-tab__icon${
                      viewState === 'histories'
                        ? ' switch-tab__icon--active'
                        : ''
                    }`}
                    onClick={() => {
                      setViewState('histories');
                      if (!historiesFirstLoad) {
                        setHistoriesFirstLoad(true);
                        fetchNoteHistories();
                      }
                    }}
                  >
                    <AiOutlineClockCircle className="tab__icon" />
                    <span className="switch-tab__line"></span>
                  </li>
                </Tooltip>
                <Tooltip placement="top" title="Starred this note">
                  <li
                    className="switch-tab__icon"
                    onClick={() => handleStarredNote()}
                  >
                    {note.starred ? (
                      <AiFillStar />
                    ) : (
                      <AiOutlineStar className="tab__icon" />
                    )}
                    {/* <span className="switch-tab__line"></span> */}
                  </li>
                </Tooltip>
                {!openRightSide && (
                  <Tooltip placement="top" title="Open right sidebar">
                    <li
                      onClick={() => {
                        pageRightRef &&
                          pageRightRef.current.classList.toggle(
                            'page-root-container__right--closed'
                          );
                        setOpenRightSide(true);
                      }}
                      title="See changes history"
                      className="switch-tab__icon"
                    >
                      <MdKeyboardDoubleArrowLeft className="tab__icon" />
                      {/* <span className="switch-tab__line"></span> */}
                    </li>
                  </Tooltip>
                )}
                <Tooltip placement="top" title="Other options">
                  <li title="See changes history" className="switch-tab__icon">
                    <BsThreeDots className="tab__icon" />
                    {/* <span className="switch-tab__line"></span> */}
                  </li>
                </Tooltip>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteContentHeader;
