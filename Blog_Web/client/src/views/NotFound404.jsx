import React, { useEffect, useState } from 'react';
import Header from '../components/Header/Header';
import { images } from '../constants';
import './styles/NotFound404.scss';
import { useNavigate } from 'react-router-dom';

const NotFound404 = () => {
  const navigate = useNavigate();
  // const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    document.title = 'Page Not Found';
  }, []);

  return (
    <div className="flex-1 flex flex-col max-w-full">
      <Header
        type={'404_page'}
        // searchValue={searchValue}
        // setSearchValue={setSearchValue}
      />
      <div className="root-page-container">
        <div className="root-page-container__content">
          <div className="root-page-container__left">
            <div className="page-404">
              <div className="page-404__container">
                <img
                  src={images.notfound}
                  alt="404"
                  className="page-404__img"
                />
                <p className="page-404__text">
                  {'Trang của bạn hình như đã xa rời trái đất...>_<'}
                </p>
                <button onClick={() => navigate(-1)} className="button-primary">
                  <span>Quay lại</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound404;
