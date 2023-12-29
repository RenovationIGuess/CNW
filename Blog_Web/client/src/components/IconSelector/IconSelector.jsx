import { useState } from 'react';
// import data from '@emoji-mart/data';
// import Picker from '@emoji-mart/react';
import EmoticonSelector from './EmoticonSelector';
import './styles.scss';
import EmojiPicker from 'emoji-picker-react';

const IconSelector = ({ callback, disableEmoticon = false }) => {
  // false - emojis | true - emoticons
  const [viewState, setViewState] = useState(false);

  const handleChangeState = (e) => {
    e.stopPropagation();
    setViewState(!viewState);
  };

  return (
    <div>
      <div className="icon-selector-header">
        <div
          onClick={(e) => viewState && handleChangeState(e)}
          className={`icon-selector-option icon-selector-option--sm${
            !viewState ? ' selector-option-title--active' : ''
          }`}
        >
          <p className="selector-option-title">Emoji</p>
          <div className="switch-tab__line"></div>
        </div>
        {!disableEmoticon && (
          <div
            onClick={(e) => !viewState && handleChangeState(e)}
            className={`icon-selector-option icon-selector-option--sm${
              viewState ? ' selector-option-title--active' : ''
            }`}
          >
            <p className="selector-option-title">Emoticon</p>
            <div className="switch-tab__line"></div>
          </div>
        )}
      </div>
      {viewState ? (
        <EmoticonSelector callback={callback} />
      ) : (
        <EmojiPicker
          onEmojiClick={(emojiObject, e) => {
            e.stopPropagation();
            callback(emojiObject.emoji);
          }}
          width={602}
          height={329}
          className="emoji-picker"
        />
      )}
    </div>
  );
};

export default IconSelector;
