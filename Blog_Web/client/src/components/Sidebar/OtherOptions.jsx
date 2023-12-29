import { Tooltip } from 'antd';
import React from 'react';
import { FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const OtherOptions = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="other-options-container">
        <Tooltip placement="right" title="See what people are blogging ~">
          <div className="user-option" onClick={() => navigate('/blogs')}>
            <div className="user-option__icon-wrp">
              <FaUsers className="user-option__icon" />
            </div>
            <div className="option-title">Social</div>
          </div>
        </Tooltip>
      </div>
    </>
  );
};

export default OtherOptions;
