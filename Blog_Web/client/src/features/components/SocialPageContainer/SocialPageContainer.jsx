import React from 'react';
import './SocialPageContainer.scss';
import SocialPageContentContainer from '~/features/Posts/SocialPageContentContainer';
import PostNow from '../ContainerRight/PostNow';
import BannerSlide from '~/components/BannerSlide/BannerSlide';

const postTypes = [
  {
    label: 'Following',
    url: '/following',
  },
  {
    label: 'Recommended',
    url: '/',
  },
];

const SocialPageContainerHeader = () => {
  return (
    <div className="social-page-header">
      <div className="social-page-header-mask">
        <div className="social-page-header-wrp">
          <div className="social-page-header-content">
            <div className="social-switch-tab" id="social-switch-tab">
              <ul className="social-switch-tab__list">
                {postTypes.map((postType, index) => (
                  <li key={index} className="social-switch-tab__tag">
                    <span className="social-switch-tab__label">
                      <span>{postType.label}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SocialPageContainer = () => {
  return (
    <div className="root-page-container social-root-page-container">
      <div className="root-page-container__content">
        <div className="root-page-container__left root-page-container__left--bg">
          <div className="social-main-page social-layout__main">
            <div className="social-home">
              <SocialPageContainerHeader />
              <SocialPageContentContainer />
            </div>
          </div>
        </div>
        <div className="root-page-container__right">
          <div className="layout-sub">
            <div className="sticky-scroll-section--wrap">
              <div className="sticky-scroll-section">
                <BannerSlide />
                <PostNow />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialPageContainer;
