import styled from 'styled-components';
import { IoIosArrowForward, IoIosBookmarks } from 'react-icons/io';
import { PiCardsFill } from 'react-icons/pi';
import { GiCardExchange } from 'react-icons/gi';

export const PostNew = styled.div`
  background-color: #fff;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
`;

export const PostNewTitle = styled.div`
  font-size: 12px;
  line-height: 1;
  color: #8592a3;
  font-weight: bold;
  margin-bottom: 12px;
`;

export const PostNewContent = styled.div`
  display: flex;
  align-items: center;
`;

export const PostNewButtonDiv = styled.div`
  margin-left: 0;
  display: inline-block;
  flex-shrink: 0;
  font-size: 14px;
  // width: 181px;
  flex: 1;
  min-width: 0;
  height: 40px;
`;

export const PostNewButtonDivAfter = styled.div`
  margin-left: 16px;
  display: inline-block;
  flex-shrink: 0;
  font-size: 14px;
  // width: 181px;
  flex: 1;
  min-width: 0;
  height: 40px;
`;

export const PostNewButton = styled.button`
  background-color: #f6f9fb;
  color: var(--default-dark-color-45);
  border-radius: 8px;
  padding: 0 8px;
  display: inline-flex;
  align-items: center;
  outline: none;
  border: none;
  width: 100%;
  height: 100%;
  transition-duration: 0.2s;
  transition-property: background-color, color;
  overflow: visible;

  &:hover {
    background-color: #c7f8e4;
    color: var(--default-dark-color-65);
    cursor: pointer;
  }
`;

export const PostNewButtonImg = styled.button`
  background-color: #f6f9fb;
  color: var(--default-dark-color-45);
  border-radius: 8px;
  padding: 0 8px;
  display: inline-flex;
  align-items: center;
  outline: none;
  border: none;
  width: 100%;
  height: 100%;
  transition-duration: 0.2s;
  transition-property: background-color, color;
  overflow: visible;

  &:hover {
    background-color: #d0e9fc;
    color: var(--default-dark-color-65);
    cursor: pointer;
  }
`;

export const PostNewButtonVid = styled.button`
  background-color: #f6f9fb;
  color: var(--default-dark-color-45);
  border-radius: 8px;
  padding: 0 8px;
  display: inline-flex;
  align-items: center;
  outline: none;
  border: none;
  width: 100%;
  height: 100%;
  transition-duration: 0.2s;
  transition-property: background-color, color;
  overflow: visible;

  &:hover {
    background-color: #ffeed0;
    color: var(--default-dark-color-65);
    cursor: pointer;
  }
`;

export const PostNewBtnSpan = styled.span`
  flex-grow: 1;
  text-align: left;
  line-height: 20px;
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const PostNewSymbolIcon = styled(GiCardExchange)`
  font-size: 24px;
  color: #36d6b7;
  margin-right: 8px;
  flex-shrink: 0;
`;

export const NewImageIcon = styled(PiCardsFill)`
  font-size: 24px;
  color: #55d2ff;
  margin-right: 8px;
  flex-shrink: 0;
`;

export const NewVideoIcon = styled(IoIosBookmarks)`
  font-size: 24px;
  color: #fcae59;
  margin-right: 8px;
  flex-shrink: 0;
`;

export const PostNewArrow = styled(IoIosArrowForward)`
  font-size: 16px;
  color: #b2bdce;
  line-height: 1;
  flex-srhink: 0;
`;
