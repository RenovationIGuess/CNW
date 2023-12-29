import React, { useState } from 'react';
import { navDatas } from '~/constants';
import HoverEffectNav from '~/components/HoverEffNav/HoverEffectNav';
import { Tooltip } from 'antd';
import { PiListPlusBold } from 'react-icons/pi';
import NewDeckModal from './NewDeckModal';
import NoAnimateSearchBar from '~/components/SearchBar/NoAnimateSearchBar';
import { cn } from '~/utils';
import useModalStore from '~/store/useModalStore';

const deckNav = navDatas.deckPageNavData;

const ContainerHeader = ({ viewState, setViewState, handleCreateDeck }) => {
  const [newDeckModalOpen, setNewDeckModalOpen] = useState(false);

  const [setSelectedPath] = useModalStore((state) => [state.setSelectedPath]);

  return (
    <>
      <div className="social-page-header">
        <div className="social-page-header-mask">
          <div className="social-page-header-wrp">
            <div className="social-page-header-content">
              <div className="social-switch-tab" id="social-switch-tab">
                <ul className="switch-tab__list">
                  <Tooltip placement="top" title="View all decks">
                    <li
                      className={cn(
                        'switch-tab__icon',
                        viewState === 'decks' && ' switch-tab__icon--active'
                      )}
                      onClick={() => {
                        setViewState('decks');
                      }}
                    >
                      <p className="switch-tab__label">Decks</p>
                      <span className="switch-tab__line"></span>
                    </li>
                  </Tooltip>
                  <Tooltip
                    placement="top"
                    title="Add new deck with its flashcards"
                  >
                    <li
                      className={cn(
                        'switch-tab__icon',
                        viewState === 'add' && ' switch-tab__icon--active'
                      )}
                      onClick={() => {
                        setViewState('add');
                        setSelectedPath([]);
                      }}
                    >
                      <p className="switch-tab__label">Add</p>
                      <span className="switch-tab__line"></span>
                    </li>
                  </Tooltip>
                </ul>

                <div className="flex items-center gap-4 h-full">
                  {viewState === 'decks' && (
                    <>
                      <NoAnimateSearchBar
                        id={'deck-searchbar'}
                        placeholder={'Search decks'}
                      />
                      <ul className="switch-tab__list">
                        <Tooltip placement="top" title="Add new deck">
                          <li
                            className={`switch-tab__icon`}
                            onClick={() => setNewDeckModalOpen(true)}
                          >
                            <PiListPlusBold className="tab__icon" />
                          </li>
                        </Tooltip>
                      </ul>
                    </>
                  )}
                  {viewState === 'add' && (
                    <div
                      onClick={handleCreateDeck}
                      className="post-poster-card__follow"
                    >
                      <div className="poster-follow-button" role="button">
                        <span>Create</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <NewDeckModal open={newDeckModalOpen} setOpen={setNewDeckModalOpen} />
    </>
  );
};

export default ContainerHeader;
