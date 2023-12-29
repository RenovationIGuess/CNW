import React from 'react';
import { AiFillEdit } from 'react-icons/ai';
import { BsFillBuildingsFill } from 'react-icons/bs';
import { RiCalendarTodoFill, RiRecordCircleLine } from 'react-icons/ri';

const OtherInfoBox = () => {
  return (
    <div className="side-section no-padding">
      <div className="side-section__header-border">
        <h2 className="side-section__title">
          <div className="flex items-center justify-between">
            <span>Attributes</span>
            <AiFillEdit
              role="button"
              title="Edit attributes"
              className="side-section__icon"
            />
          </div>
        </h2>
      </div>
      <div className="side-section__body">
        <div className="flex flex-col">
          {/* Attribute items */}
          <div className="attr-container flex items-center justify-between">
            <div className="flex flex-1 items-center overflow-hidden">
              <div className="attr-title" title="Job">
                <RiRecordCircleLine className="attr-icon" />
                <span>Job</span>
              </div>
              <div className="flex items-center flex-1">
                <div className="status-tag finished-tag">
                  <span>Student</span>
                </div>
              </div>
            </div>
          </div>
          <div className="attr-container flex items-center justify-between">
            <div className="flex flex-1 items-center overflow-hidden">
              <div className="attr-title" title="Company">
                <BsFillBuildingsFill className="attr-icon" />
                <span>Company</span>
              </div>
              <div className="flex items-center flex-1">
                <div className="status-tag user-tag">
                  <span>DHBKHN</span>
                </div>
              </div>
            </div>
          </div>
          <div className="attr-container flex items-center justify-between">
            <div className="flex flex-1 items-center overflow-hidden">
              <div className="attr-title" title="Joined Date">
                <RiCalendarTodoFill
                  className="attr-icon"
                  style={{ fontSize: '24px' }}
                />
                <span>Joined Date</span>
              </div>
              <div className="flex items-center flex-1 overflow-hidden">
                <div className="attr-content">
                  <span>24/05/2023</span>
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
  );
};

export default OtherInfoBox;
