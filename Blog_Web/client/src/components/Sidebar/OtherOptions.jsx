import { Tooltip } from 'antd';
import React from 'react';
import { BsTrash2 } from 'react-icons/bs';
import { FaUsers } from 'react-icons/fa';
import { HiTemplate } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const OtherOptions = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="other-options-container">
        <Tooltip placement="right" title="See what people are posting ~">
          <div className="user-option" onClick={() => navigate('/blogs')}>
            <div className="user-option__icon-wrp">
              <FaUsers className="user-option__icon" />
            </div>
            <div className="option-title">Social</div>
          </div>
        </Tooltip>
        <Tooltip placement="right" title="Makes your works easier ~">
          <div className="user-option">
            <div className="user-option__icon-wrp">
              <HiTemplate className="user-option__icon" />
            </div>
            <div className="option-title">Templates</div>
          </div>
        </Tooltip>
        <Tooltip placement="right" title="Maybe you need something here...">
          <div className="user-option" onClick={() => navigate('/trash')}>
            <div className="user-option__icon-wrp">
              <BsTrash2 className="user-option__icon" />
            </div>
            <div className="option-title">Trash</div>
          </div>
        </Tooltip>
      </div>
    </>
  );
};

export default OtherOptions;
