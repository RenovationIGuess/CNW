import React from 'react';
import AddFlashcardSection from '~/features/Deck/AddFlashcard/AddFlashcardSection';
import { BsTrash } from 'react-icons/bs';
import { Tooltip } from 'antd';
import {
  HiOutlineArrowCircleDown,
  HiOutlineArrowCircleUp,
} from 'react-icons/hi';
import { FaRegCopy } from 'react-icons/fa';
import { cn } from '~/utils';

const NewFlashcard = ({
  index,
  data,
  setLength,
  error,
  setErrors,
  initId = 0,
  showCreateButton = false,
  handleAddFlashcard = () => {},
}) => {
  return (
    <div className="flashcard-container">
      <div className="social-page-header-content">
        <div className="social-switch-tab" id="social-switch-tab">
          <p className="font-bold">Flashcard&nbsp;{index + initId + 1}</p>

          <div className="flex items-center gap-4 h-full">
            <ul className="switch-tab__list">
              <Tooltip placement="top" title="Duplicate">
                <li
                  className={`switch-tab__icon`}
                  onClick={() => {
                    const item = data.current[index];
                    item.key = data.current.at(-1).key + 1;
                    data.current.splice(index, 0, item);
                    // setLength((prev) => [...prev, item.key]);
                  }}
                >
                  <FaRegCopy className="tab__icon" />
                </li>
              </Tooltip>
              <Tooltip placement="top" title="Move up">
                <li
                  onClick={() => {}}
                  className={cn(
                    `switch-tab__icon`,
                    index === 0 && 'switch-tab__icon--disabled'
                  )}
                >
                  <HiOutlineArrowCircleUp className="tab__icon" />
                </li>
              </Tooltip>
              <Tooltip placement="top" title="Move down">
                <li
                  onClick={() => {}}
                  className={cn(
                    `switch-tab__icon`,
                    index === data.current.length - 1 &&
                      'switch-tab__icon--disabled'
                  )}
                >
                  <HiOutlineArrowCircleDown className="tab__icon" />
                </li>
              </Tooltip>
              <Tooltip placement="top" title="Remove this flashcard">
                <li
                  className={`switch-tab__icon`}
                  onClick={() => {
                    const itemKey = data.current[index].key;
                    setLength((prev) =>
                      prev.filter((item) => item !== itemKey)
                    );
                    setErrors((prev) =>
                      prev.filter((err) => err.key !== itemKey)
                    );
                    // data.current.splice(index, 1);
                    data.current = data.current.filter(
                      (fc) => fc.key !== itemKey
                    );
                  }}
                >
                  <BsTrash className="tab__icon" />
                </li>
              </Tooltip>
            </ul>
            {showCreateButton && (
              <div
                onClick={() => handleAddFlashcard(index)}
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

      <AddFlashcardSection index={index} data={data} error={error} />
    </div>
  );
};

export default NewFlashcard;
