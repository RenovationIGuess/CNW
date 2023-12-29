import { Tooltip } from 'antd';
import { useState } from 'react';
import { AiOutlineClockCircle, AiOutlinePlusCircle } from 'react-icons/ai';
import { emojis, folder_icons } from '~/constants';
import {
  MdOutlineArrowBackIosNew,
  MdOutlineArrowForwardIos,
} from 'react-icons/md';

const emoticons = [
  [...folder_icons.directoryIcons],
  [...emojis.genshinChristmas],
  [...emojis.genshinGifs1],
  [...emojis.paimonPaintingsSet19],
  [...emojis.paimonPaintingsSet20],
  [...emojis.paimonPaintingsSet21],
  [...emojis.paimonPaintingsSet23],
  [...emojis.paimonPaintingsSet24],
  [...emojis.paimonPaintingsSet25],
  [...emojis.pomGalleryClosedBeta],
  [...emojis.poumGalleryMarch7th],
  [...emojis.poumGalleryPomPom],
  [...emojis.poumGalleryStellaronHunters],
  [...emojis.poumStickers],
];

const EmoticonSelector = ({ callback, setPopoverOpen }) => {
  const [currentSelectIndex, setCurrentSelectIndex] = useState(0);
  const [offset, setOffset] = useState(0);

  return (
    <>
      <div className="reply-box__emoticon">
        <div className="emoticon">
          <div className="emoticon-top">
            <div className="emoticon-add">
              <Tooltip placement="top" title="Click to add an image">
                <label role="button" htmlFor="noteIconUpload">
                  <AiOutlinePlusCircle className="emoticon-opt-icon" />
                  <input
                    type="file"
                    id="noteIconUpload"
                    name="noteIconUpload"
                    className="hidden"
                    // onChange={(e) => setUploadImg(e.target.files[0])}
                  />
                </label>
              </Tooltip>
            </div>
            <ul className="emoticon-tabs">
              <li className="emoticon-type">
                <div className="emoticon-type__wrapper">
                  <AiOutlineClockCircle className="emoticon-opt-icon" />
                </div>
              </li>
              {emoticons.map((item, index) => (
                <li
                  key={index}
                  className={`emoticon-type`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSelectIndex(index);
                  }}
                >
                  <div
                    className={`emoticon-type__wrapper${
                      currentSelectIndex === index
                        ? ' emoticon-type__wrapper--selected'
                        : ''
                    }`}
                  >
                    <div className="emoticon-emoji">
                      <div className="emoticon-emoji__container">
                        <img src={item[0].url} alt="emoji-type" />
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="emoticon-pager">
              <div className="emoticon-pager-btn emoticon-pager-btn--prev">
                <MdOutlineArrowBackIosNew className="emoticon-opt-icon" />
              </div>
              <div className="emoticon-pager-btn emoticon-pager-btn--next">
                <MdOutlineArrowForwardIos className="emoticon-opt-icon" />
              </div>
            </div>
          </div>
          <div className="emoticon-wrapper">
            <ul className="emoticon-list">
              {emoticons[currentSelectIndex].map((emoticon, ind) => (
                <li
                  onClick={(e) => {
                    e.stopPropagation();
                    callback(emoticon.url);
                  }}
                  key={ind}
                  className="emoticon-item"
                >
                  <div className="emoticon-item__wrapper">
                    <div className="emoticon-emoji">
                      <div className="emoticon-emoji__container">
                        <img src={emoticon.url} alt="emoticon" />
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmoticonSelector;
