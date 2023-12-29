import React, { useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import PostActions from './PostActions';
import { Popover } from 'antd';

const PostDetailHeader = ({ post }) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <div className="social-page-header">
      <div className="social-page-header-mask">
        <div className="social-page-header-wrp">
          <div className="social-page-header-content">
            <div className="post-page-header-main">
              <div className="post-page-header__left">
                <div className="post-title-container">
                  <span className="post-page-header__title">
                    Blog Detail's Page
                  </span>
                </div>
              </div>
              <div className="post-page-header__right">
                <div className="post-action">
                  <Popover
                    rootClassName="custom-popover"
                    trigger="click"
                    placement="bottomRight"
                    open={popoverOpen}
                    onOpenChange={() => setPopoverOpen(!popoverOpen)}
                    content={
                      <PostActions
                        post={post}
                        setPopoverOpen={setPopoverOpen}
                      />
                    }
                  >
                    <div className="post-action__button" role="button">
                      <BsThreeDots className="icon" />
                    </div>
                  </Popover>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailHeader;
