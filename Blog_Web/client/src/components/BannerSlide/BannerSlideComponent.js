import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import styled from 'styled-components';

export const Banner = styled.div`
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;
`;

export const BannerWrapper = styled.div`
  margin-left: auto;
  margin-right: auto;
  position: relative;
  overflow: hidden;
  list-style: none;
  padding: 0;
  z-index: 1;
`;

export const SwiperWrapper = styled.div`
  transition-duration: 300ms;
  transform: translate3d(${(props) => props.transform}, 0, 0);
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
  display: flex;
  transition-property: transform;
  box-sizing: border-box;
`;

export const BannerItem = styled.div`
  width: 100%;
  height: 153px;
  cursor: pointer;
  flex-shrink: 0;
  position: relative;
  /* transition-property: transform; */
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.1);
  }
`;

export const BannerImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-style: none;
  object-position: center;
`;

export const BannerPrev = styled.div`
  left: 16px;
  position: absolute;
  top: 50%;
  width: 24px;
  height: 24px;
  margin-top: -12px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  z-index: 55;
  cursor: pointer;
  font-size: 16px;
  align-items: center;
  justify-content: center;
  display: flex;

  &:hover {
    background-color: #657ef8;
  }
`;

export const BannerNext = styled.div`
  right: 16px;
  position: absolute;
  top: 50%;
  width: 24px;
  height: 24px;
  margin-top: -12px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  z-index: 55;
  cursor: pointer;
  font-size: 16px;
  align-items: center;
  justify-content: center;
  display: flex;

  &:hover {
    background-color: #657ef8;
  }
`;

export const PrevIcon = styled(IoIosArrowBack)`
  /* transform: scaleX(-1); */
  color: #fff;
  line-height: 1;
`;

export const NextIcon = styled(IoIosArrowForward)`
  /* transform: scaleX(-1); */
  color: #fff;
  line-height: 1;
`;

export const BannerPagination = styled.div`
  position: absolute;
  bottom: 8px !important;
  left: auto !important;
  width: auto !important;
  right: 16px;
  height: 6px;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const BannerBullet = styled.span`
  background-color: rgba(0, 0, 0, 0.5);
  width: ${(props) => (props.isCurrent ? '30px' : '6px')};
  height: 6px;
  border-radius: 3px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  margin: 0 0 0 10px;
  position: relative;
  cursor: pointer;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    position: absolute;
    width: 0%;
    height: 100%;
    left: 0;
    top: 0;
    background-color: #657ef8;
    /* -webkit-animation: bullet 3s linear forwards; */
    animation: ${(props) =>
      props.isCurrent ? 'bullet 3s linear forwards' : ''};
    /* transform: translateX(${(props) => (props.isCurrent ? '0' : '-100%')});
    transition: all 3s linear; */
  }

  @keyframes bullet {
    0% {
      width: 0%;
    }
    100% {
      width: 100%;
    }
  }
`;
