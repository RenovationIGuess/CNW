import React from 'react';
import './NewPostPopover.scss';
import '../styles/global.scss';
import { Tooltip } from 'antd';
import { AiFillCamera, AiOutlineEdit } from 'react-icons/ai';
import { BsFillImageFill } from 'react-icons/bs';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { FaFirstdraft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const NewPostPopover = () => {
  const navigate = useNavigate();

  return (
    <div className="popover-dialog">
      <div>
        <div className="post-new">
          {/* <div className='post-new__title'>
            Create new post now!
          </div> */}
          <div className="post-new__content">
            <div className="post-new__post">
              <Tooltip placement="left" title="All type of content">
                <button
                  type="button"
                  className="post-button__button"
                  onClick={() => navigate('/newBlog?type=all')}
                >
                  <span className="post-button__icon__wrapper">
                    <AiOutlineEdit className="post-button__icon" />
                  </span>
                  <span className="post-button__title">New Blog</span>
                  <MdKeyboardArrowRight className="post-icon-arrow" />
                </button>
              </Tooltip>
            </div>
            <div className="post-new__post">
              <Tooltip placement="left" title="Image as main content">
                <button type="button" className="post-button__button">
                  <span className="post-button__icon__wrapper post-new-image__post">
                    <BsFillImageFill className="post-button__icon" />
                  </span>
                  <span className="post-button__title">New Image Blog</span>
                  <MdKeyboardArrowRight className="post-icon-arrow" />
                </button>
              </Tooltip>
            </div>
            <div className="post-new__post">
              <Tooltip placement="left" title="Video as main content">
                <button type="button" className="post-button__button">
                  <span className="post-button__icon__wrapper post-new-video__post">
                    <AiFillCamera className="post-button__icon" />
                  </span>
                  <span className="post-button__title">New Video Blog</span>
                  <MdKeyboardArrowRight className="post-icon-arrow" />
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
      <Tooltip placement="left" title="View all your drafts">
        <div className="newpost-dialog__draft">
          <FaFirstdraft className="icon-draft" />
          <span>Draft (10)</span>
        </div>
      </Tooltip>
    </div>
  );
};

export default NewPostPopover;
