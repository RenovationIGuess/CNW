import { Tooltip } from 'antd';
import React from 'react';
import { BsPlusLg, BsThreeDots } from 'react-icons/bs';

const StarredSection = ({}) => {
  return (
    <>
      <div className="option-list__header">
        <Tooltip placement="topLeft" title="Or Favorites">
          <div className="list-header__title">Starred</div>
        </Tooltip>
        <div className="flex items-center gap-[4px]">
          <BsThreeDots className="list-header__icon" />
          <BsPlusLg className="list-header__icon" />
        </div>
      </div>
    </>
  );
};

export default StarredSection;
