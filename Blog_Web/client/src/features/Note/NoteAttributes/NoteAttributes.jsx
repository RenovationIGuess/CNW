import React, { useRef } from 'react';
import { BiCategory } from 'react-icons/bi';
import { BsLink45Deg, BsPersonCircle } from 'react-icons/bs';
import { MdKeyboardDoubleArrowDown } from 'react-icons/md';
import {
  RiCalendarTodoFill,
  RiQuillPenFill,
  RiRecordCircleLine,
} from 'react-icons/ri';

const NoteAttributes = () => {
  const ref = useRef();

  return (
    <>
      <div ref={ref} className="side-section-db no-padding">
        <div className="side-section__header-border">
          <h2 className="side-section__title">
            <div className="flex items-center justify-between">
              <span>Attributes</span>
              <MdKeyboardDoubleArrowDown
                role="button"
                title="Edit attributes"
                className="side-section__icon"
                onClick={() => {
                  ref &&
                    ref.current.classList.toggle('side-section-db--closed');
                }}
              />
            </div>
          </h2>
        </div>
        <div className="side-section__body-db">
          <div className="flex flex-col">
            {/* Attribute items */}
            <div className="attr-container flex items-center justify-between">
              <div className="flex flex-1 items-center overflow-hidden">
                <div className="attr-title" title="Status">
                  <RiRecordCircleLine className="attr-icon" />
                  <span>Status</span>
                </div>
                <div className="flex items-center flex-1">
                  <div className="status-tag finished-tag">
                    <span>Finished</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="attr-container flex items-center justify-between">
              <div className="flex flex-1 items-center overflow-hidden">
                <div className="attr-title" title="Author">
                  <RiQuillPenFill className="attr-icon" />
                  <span>Author</span>
                </div>
                <div className="flex items-center flex-1">
                  <div className="status-tag user-tag">
                    <span>Ramu Mura</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="attr-container flex items-center justify-between">
              <div className="flex flex-1 items-center overflow-hidden">
                <div className="attr-title" title="Publish/Release Date">
                  <RiCalendarTodoFill
                    className="attr-icon"
                    style={{ fontSize: '24px' }}
                  />
                  <span>Publish/Release Date</span>
                </div>
                <div className="flex items-center flex-1 overflow-hidden">
                  <div className="attr-content">
                    <span>24/05/2023</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="attr-container flex items-center justify-between">
              <div className="flex flex-1 items-center overflow-hidden">
                <div className="attr-title" title="Link">
                  <BsLink45Deg className="attr-icon" />
                  <span>Link</span>
                </div>
                <div
                  className="flex items-center flex-1 overflow-hidden"
                  title="https://www.facebook.com/groups/671937754287969"
                >
                  <div className="attr-content">
                    <span>https://www.facebook.com/groups/671937754287969</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="attr-container flex items-center justify-between">
              <div className="flex flex-1 items-center overflow-hidden">
                <div className="attr-title" title="Type">
                  <BiCategory className="attr-icon" />
                  <span>Type</span>
                </div>
                <div className="flex items-center flex-1">
                  <div className="status-tag type-tag">
                    <span>Todo-list</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="attr-container flex items-center justify-between">
              <div className="flex flex-1 items-center overflow-hidden">
                <div className="attr-title" title="Created By">
                  <BsPersonCircle className="attr-icon" />
                  <span>Created By</span>
                </div>
                <div className="flex items-center flex-1">
                  <div className="status-tag user-tag">
                    <span>Ramu Mura</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="side-section__footer">
          <span className="side-section__more">See more</span>
        </div>
      </div>
    </>
  );
};

export default NoteAttributes;
