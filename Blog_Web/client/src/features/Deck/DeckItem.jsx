import React, { useState } from 'react';
import { IoMdArrowDropdown } from 'react-icons/io';
import Tag from '../Tag/Tag';
import { FaCalendarDay, FaTags } from 'react-icons/fa';
import MoreActions from './MoreActions';
import { Popover, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { cn } from '~/utils';
import { useNavigate } from 'react-router-dom';

const startOfMonth = dayjs().startOf('month');
const endOfMonth = dayjs().endOf('month');

let day = startOfMonth;
let days = [];

while (day <= endOfMonth) {
  days.push(day.format('YYYY-MM-DD'));
  day = day.add(1, 'day');
}

const DeckItem = ({ data, index }) => {
  const navigate = useNavigate();
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <Tooltip placement="top" title="Click in the name to view detail">
      <div className="deck-item">
        <div className="deck-item__header">
          <div className="deck-info">
            <div className="deck-icon__wrapper">
              {data.icon.includes('/') ? (
                <img src={data.icon} alt="deck-icon" />
              ) : (
                <p className="text-3xl">{data.icon}</p>
              )}
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <p
                className="deck-title"
                onClick={() => navigate(`/decks/${data.id}`)}
              >
                {data.title}
              </p>
              <p className="deck-desc">{data.description}</p>
            </div>
          </div>
        </div>

        {/* Streak section */}
        <div className="deck-item__header">
          <div className="streak-grid">
            {days.map((day, ind) => (
              // <div key={index} className={cn('streak-box__wrap')}>
              <Tooltip
                key={ind}
                title={`You have learn in ${day}`}
                placement="top"
              >
                <div
                  className={cn(
                    'streak-box',
                    ind % 2 === 0 && 'streak-box--learned'
                  )}
                ></div>
              </Tooltip>
              // </div>
            ))}
          </div>
        </div>

        <div className="deck-item__header justify-end">
          <Popover
            rootClassName="custom-popover"
            placement="bottomLeft"
            trigger={'click'}
            arrow={false}
            open={popoverOpen}
            onOpenChange={() => setPopoverOpen(!popoverOpen)}
            content={
              <MoreActions
                index={index}
                data={data}
                setPopoverOpen={setPopoverOpen}
              />
            }
          >
            <div className="post-poster-card__follow">
              <div className="poster-follow-button" role="button">
                <span>Actions</span>
                <IoMdArrowDropdown className="arrow-icon" />
              </div>
            </div>
          </Popover>
        </div>

        <div className="deck-item__footer">
          <div className="tag-list">
            {data.tags.length > 0 ? (
              <>
                {data.tags.slice(0, 3).map((tag, index) => (
                  <Tag
                    tag={tag}
                    key={tag.id}
                    deletable={false}
                    mouseEvent={false}
                  />
                ))}
                {data.tags.length - 3 > 0 && (
                  <p className="more-tags">
                    + {data.tags.length - 3}
                    <FaTags className="tag-icon" />
                    More
                  </p>
                )}
              </>
            ) : (
              <p className="no-tag">No tags attached</p>
            )}
          </div>
        </div>

        {/* Last learn */}
        <div className="deck-item__footer">
          <FaCalendarDay className="last-learn__icon" />
          <p className="last-learned__label">
            Last learned: {dayjs().format('MMM D YYYY')}
          </p>
        </div>

        <div className="deck-item__footer">
          <div className="deck-stats">
            <div className="learned-count">
              <p className="count">0</p>
              <p className="label">Learned</p>
            </div>
            <div className="divider"></div>
            <div className="remaining-count">
              <p className="count">0</p>
              <p className="label">Remaining</p>
            </div>
            <div className="divider"></div>
            <div className="total-count">
              <p className="count">{data.flashcards.length}</p>
              <p className="label">Total</p>
            </div>
          </div>
        </div>
      </div>
    </Tooltip>
  );
};

export default DeckItem;
