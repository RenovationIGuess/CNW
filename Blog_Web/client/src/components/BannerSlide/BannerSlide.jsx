import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Banner,
  BannerBullet,
  BannerImg,
  BannerItem,
  BannerNext,
  BannerPagination,
  BannerPrev,
  BannerWrapper,
  NextIcon,
  PrevIcon,
  SwiperWrapper,
} from './BannerSlideComponent';

const slides = [
  'https://firebasestorage.googleapis.com/v0/b/gr1-project-bebf6.appspot.com/o/background_image%2Fbgex2.jpg?alt=media&token=b6d8fea0-f61f-408c-8cb7-bee56c8b3879',
  'https://firebasestorage.googleapis.com/v0/b/gr1-project-bebf6.appspot.com/o/background_image%2Fbgex3.jpg?alt=media&token=24989544-cf0d-4be6-b254-7fd9bf037e4d',
  'https://firebasestorage.googleapis.com/v0/b/gr1-project-bebf6.appspot.com/o/background_image%2Fbgexample1.jpg?alt=media&token=f350ec84-c9e8-494d-8798-f030d8608153',
  'https://firebasestorage.googleapis.com/v0/b/gr1-project-bebf6.appspot.com/o/background_image%2Fkleebg.jpg?alt=media&token=5ca6be23-fe69-44d5-88ec-bffd06f1261b',
  'https://firebasestorage.googleapis.com/v0/b/gr1-project-bebf6.appspot.com/o/background_image%2Fraidenbg.jpg?alt=media&token=02e1c977-ea91-4e53-a260-ab6bf2d47809',
];

const slideLength = slides.length;
const delay = 3000;

const BannerSlide = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showButton, setShowButton] = useState(false);

  const timeoutRef = useRef(null);

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setCurrentSlide(
          currentSlide === slideLength - 1 ? 0 : currentSlide + 1
        ),
      delay
    );
    return () => {
      resetTimeout();
    };
  }, [currentSlide, slideLength]);

  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return (
    <Banner>
      <BannerWrapper>
        <SwiperWrapper transform={`${-currentSlide * 100}%`}>
          {slides.map((item, index) => (
            <BannerItem
              key={index}
              onMouseOver={() => setShowButton(true)}
              onMouseOut={() => setShowButton(false)}
            >
              <BannerImg src={item} alt="banner-image" />
            </BannerItem>
          ))}
        </SwiperWrapper>
        {showButton && (
          <>
            <BannerPrev onMouseOver={() => setShowButton(true)}>
              <PrevIcon
                onClick={() =>
                  setCurrentSlide(
                    currentSlide === 0 ? slideLength - 1 : currentSlide - 1
                  )
                }
              />
            </BannerPrev>
            <BannerNext onMouseOver={() => setShowButton(true)}>
              <NextIcon
                onClick={() =>
                  setCurrentSlide(
                    currentSlide === slideLength - 1 ? 0 : currentSlide + 1
                  )
                }
              />
            </BannerNext>
          </>
        )}
        <BannerPagination>
          {slides.map((item, index) => (
            <BannerBullet
              key={index}
              isCurrent={index === currentSlide}
              onClick={() => setCurrentSlide(index)}
            ></BannerBullet>
          ))}
        </BannerPagination>
      </BannerWrapper>
    </Banner>
  );
};

export default BannerSlide;
