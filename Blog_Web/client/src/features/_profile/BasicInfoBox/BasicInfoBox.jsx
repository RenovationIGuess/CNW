import React from 'react';
import { AiFillEdit } from 'react-icons/ai';
import { BsPostcardFill } from 'react-icons/bs';

const BasicInfoBox = () => {
  return (
    <div className="side-section no-padding basic-info">
      <div className="side-section__header-border">
        <h2 className="side-section__title">
          <div className="flex items-center justify-between">
            <span>Basic Information</span>
            <AiFillEdit
              role="button"
              title="Edit page info"
              className="side-section__icon"
            />
          </div>
        </h2>
      </div>
      <div className="side-section__body" style={{ margin: 0 }}>
        <div className="flex flex-col">
          {/* Attribute items */}
          <div className="page-id-container">
            <BsPostcardFill className="id-icon" />
            <p>My ID: 123456789</p>
          </div>
        </div>
      </div>
      <div className="side-section__footer no-border-top-short"></div>
    </div>
  );
};

export default BasicInfoBox;
