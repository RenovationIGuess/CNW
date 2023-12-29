import { Tooltip } from 'antd';
import React from 'react';
import { BsFilePost } from 'react-icons/bs';
import { GiCardExchange, GiNotebook } from 'react-icons/gi';
import { Link } from 'react-router-dom';
import { userStateContext } from '~/contexts/ContextProvider';
import useFlashcardStore from '~/store/useFlashcardStore';

const Creator = () => {
  const [deck] = useFlashcardStore((state) => [state.deck]);

  return (
    <div className="side-section">
      <div className="side-section__header">
        <h2 className="side-section__title">Creator Information</h2>
      </div>
      <div className="side-section__body">
        <div className="user-info-side">
          <Tooltip placement="top" title="View creator's public profile">
            <Link
              className="flex flex-1 items-center"
              to={`/profile/${deck.user.id}/public`}
            >
              <div className="user-info__avatar">
                <img src={deck.user.profile.avatar} alt="avatar" />
              </div>
              <span className="user-info__nickname">
                {deck.user.profile.name}
              </span>
            </Link>
          </Tooltip>
          <div className="poster-follow-button" role="button">
            <span>Follow</span>
          </div>
        </div>
        <div className="user-record__list">
          <div className="user-record__item">
            <div className="record-desc">
              <GiNotebook className="icon" />
              <span>Notes</span>
            </div>
            <div className="record-value">100</div>
          </div>
          <div className="user-record__item">
            <div className="record-desc">
              <GiCardExchange className="icon" />
              <span>Decks</span>
            </div>
            <div className="record-value">100</div>
          </div>
          <div className="user-record__item">
            <div className="record-desc">
              <BsFilePost className="icon" />
              <span>Post</span>
            </div>
            <div className="record-value">100</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Creator;
