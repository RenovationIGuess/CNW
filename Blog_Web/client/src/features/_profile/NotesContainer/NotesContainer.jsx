import { Tooltip } from 'antd';
import React from 'react';
import {
  AiFillFileAdd,
  AiFillStar,
  AiOutlineClockCircle,
} from 'react-icons/ai';
import { BsThreeDots } from 'react-icons/bs';
import { HiOutlineChevronDoubleDown } from 'react-icons/hi';
import TiltableItem from '../TiltableItem/TiltableItem';
import { images } from '~/constants';
import LoadMoreNoteCard from '~/features/components/LoadMoreNoteCard/LoadMoreNoteCard';
import { IoIosArrowForward } from 'react-icons/io';
import { Link, useOutletContext } from 'react-router-dom';
import { cn } from '~/utils';

const NotesContainer = ({
  paginate,
  headerTitle,
  data,
  loading,
  setStarredNotes,
  setNotes,
  getNotes,
}) => {
  // const [isSidebarMinimized] = useOutletContext();

  return (
    <>
      <div className={`page-layout page-center`}>
        <div className="page-main page-layout__main">
          <div className="page-header">
            <div className="page-header-mask">
              <div className="page-header-wrp">
                <div className="page-header-content">
                  <div className="switch-tab">
                    <div className="page-title-container">
                      <span className="page__title uppercase">
                        {headerTitle}
                      </span>
                      {headerTitle === 'Starred Notes' ? (
                        <AiFillStar className="starred-icon" />
                      ) : (
                        <AiOutlineClockCircle className="recent-icon" />
                      )}
                      <Tooltip placement="top" title="View all notes">
                        <Link to="/notes">
                          <IoIosArrowForward className="view-all__icon" />
                        </Link>
                      </Tooltip>
                    </div>
                    <ul className="switch-tab__list">
                      <Tooltip placement="top" title="Add a new Note">
                        <li className="switch-tab__icon">
                          <AiFillFileAdd className="tab__icon" />
                          <span className="switch-tab__line"></span>
                        </li>
                      </Tooltip>
                      <li className="switch-tab__icon">
                        <BsThreeDots className="tab__icon" />
                      </li>
                      <Tooltip placement="top" title="Minimize">
                        <li className="switch-tab__icon">
                          <HiOutlineChevronDoubleDown className="tab__icon" />
                        </li>
                      </Tooltip>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="page-center-content">
            <div className="pt-4 px-8 pb-8">
              <div className="flex flex-col">
                <div
                  className={cn(
                    // 'notes-container--dragged',
                    `notes-container`
                  )}
                >
                  {loading ? (
                    <div className="data-empty__container">
                      <span className="my-loader save-content__loading--icon"></span>
                      <span className="save-content__loading--title">
                        Saving...
                      </span>
                    </div>
                  ) : data.length !== 0 ? (
                    <>
                      {data.map((note, ind) => (
                        <TiltableItem
                          setStarredNotes={setStarredNotes}
                          setNotes={setNotes}
                          note={note}
                          key={ind}
                          index={note.id}
                        />
                      ))}
                      {!(
                        paginate?.last_page === 1 ||
                        paginate?.current_page > paginate?.last_page
                      ) && (
                        <LoadMoreNoteCard
                          paginate={paginate}
                          getNotes={getNotes}
                        />
                      )}
                    </>
                  ) : (
                    <div className="data-empty__container">
                      <img
                        src={images.nothing}
                        alt="data-empty-img"
                        className="data-empty__img"
                      />
                      <p className="data-empty__title">
                        No notes were found ~_~
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotesContainer;
