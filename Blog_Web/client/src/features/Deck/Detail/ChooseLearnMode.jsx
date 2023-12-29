import React from 'react';
import {
  NewImageIcon,
  NewVideoIcon,
  PostNew,
  PostNewArrow,
  PostNewBtnSpan,
  PostNewButton,
  PostNewButtonDiv,
  PostNewButtonDivAfter,
  PostNewButtonImg,
  PostNewButtonVid,
  PostNewContent,
  PostNewSymbolIcon,
  PostNewTitle,
} from './ChooseLearnModeComponents';

const ChooseLearnMode = () => {
  return (
    <PostNew>
      <PostNewTitle>Choose how flashcards should be displayed</PostNewTitle>
      <PostNewContent>
        <PostNewButtonDiv>
          <PostNewButton>
            <PostNewSymbolIcon />
            <PostNewBtnSpan>Flip card</PostNewBtnSpan>
            <PostNewArrow />
          </PostNewButton>
        </PostNewButtonDiv>
        <PostNewButtonDivAfter>
          <PostNewButtonImg>
            <NewImageIcon />
            <PostNewBtnSpan>Full screen</PostNewBtnSpan>
            <PostNewArrow />
          </PostNewButtonImg>
        </PostNewButtonDivAfter>
        <PostNewButtonDivAfter>
          <PostNewButtonVid>
            <NewVideoIcon />
            <PostNewBtnSpan>Both faces</PostNewBtnSpan>
            <PostNewArrow />
          </PostNewButtonVid>
        </PostNewButtonDivAfter>
      </PostNewContent>
    </PostNew>
  );
};

export default ChooseLearnMode;
