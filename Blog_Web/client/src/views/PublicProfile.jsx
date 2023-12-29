import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header/Header';
import BackgroundSection from '../components/BackgroundSection/BackgroundSection';
import { BiCommentDetail } from 'react-icons/bi';
import { TiArrowSortedDown } from 'react-icons/ti';
import { FiMinimize } from 'react-icons/fi';
import { GiNotebook, GiCardExchange } from 'react-icons/gi';
import { IoCalendarSharp } from 'react-icons/io5';
import './styles/Dashboard.scss';
import { randomColorGenerator } from '../utils/randomColorGen';
import useComponentVisible from '../hooks/useComponentVisible';
import Toolbox from '../components/Toolbox/Toolbox';
import BasicInfoBox from '../features/_profile/BasicInfoBox/BasicInfoBox';
import OtherInfoBox from '../features/_profile/OtherInfoBox/OtherInfoBox';
import UserInfoEditModal from '../features/_profile/UserInfoEditModal/UserInfoEditModal';
import BackgroundImgModal from '../features/_profile/BackgroundImgModal/BackgroundImgModal';
import { userStateContext } from '../contexts/ContextProvider';
import axiosClient from '../axios';
import NotesContainer from '../features/_profile/NotesContainer/NotesContainer';
import { useParams } from 'react-router-dom';
import { images } from '~/constants';

const PublicProfile = () => {
  const { id } = useParams();
  const paramId = parseInt(id);

  const { currentUser } = userStateContext();

  // UserEditModal Control
  const [editModalOpen, setEditModalOpen] = useState(false);
  // Variable that store user information if the id !== currentUser.id
  const [user, setUser] = useState(currentUser);
  const [fetchUserLoading, setFetchUserLoading] = useState(true);
  // Payload for patch request
  const [userInfo, setUserInfo] = useState({
    name: currentUser.profile.name,
    sign: currentUser.profile.sign,
    avatar: currentUser.profile.avatar,
    background_image: currentUser.profile.background_image,
  });

  // Value for searchbar
  // const [searchValue, setSearchValue] = useState('');

  // Background Image Modal
  const [bgModalOpen, setBgModalOpen] = useState(false);

  const [isMinimized, setIsMinimized] = useState(false);
  const [optionsRef, isOptionsVisible, setOptionsVisible] = useComponentVisible(
    false,
    'float-dialog'
  );

  // All recent notes
  // const [notes, setNotes] = useState([]);
  // const [fetchNotesLoading, setFetchNotesLoading] = useState(true);
  // const [paginateNotes, setPaginateNotes] = useState({});
  // // All starred notes
  // const [starredNotes, setStarredNotes] = useState([]);
  // const [fetchStarredNotesLoading, setFetchStarredNotesLoading] =
  //   useState(true);
  // const [paginateStarredNotes, setPaginateStarredNotes] = useState({});

  const toolList = useMemo(() => {
    return [
      // First row
      {
        title: 'Add Note',
        icon: images.page,
        tooltip: 'Saved to Private folder',
        callback: 'createNewNote',
      },
      {
        title: 'Add Deck',
        icon: images.flashcards,
        tooltip: 'Saved to Private folder',
        callback: 'createNewDeck',
      },
      {
        title: 'Add Schedule',
        icon: images.check,
        tooltip: 'Saved to Private folder',
        callback: 'createNewSchedule',
      },
      {
        title: 'Social',
        icon: images.team,
        tooltip: 'See what people are blogging',
        callback: () => {
          navigate('/blogs');
        },
      },
    ];
  }, []);

  useEffect(() => {
    document.title = 'Public Profile';
    if (paramId === currentUser.id) {
      document.title = `Public Profile | ${currentUser.profile.name}`;
      setUser({ ...currentUser });
    } else {
      setFetchUserLoading(true);
      axiosClient
        .get(`/profile/${paramId}`)
        .then(({ data }) => {
          setUser(data.data);
          document.title = `Public Profile | ${data.data.profile.name}`;
        })
        .catch((err) => console.log(err))
        .finally(() => setFetchUserLoading(false));
    }
  }, [paramId]);

  // Get all the notes (recently)
  // useEffect(() => {
  //   // setFetchNotesLoading(true);
  //   axiosClient
  //     .get('/notes')
  //     .then(({ data }) => {
  //       setNotes(data.data.data);
  //       setPaginateNotes({
  //         total: data.data.total,
  //         last_page: data.data.last_page,
  //         per_page: data.data.per_page,
  //         current_page: data.data.last_page > 1 ? 2 : 1,
  //         loading: false,
  //       });
  //     })
  //     .catch((err) => console.log(err))
  //     .finally(() => setFetchNotesLoading(false));
  // }, []);

  // Get all the starred notes
  // useEffect(() => {
  //   // setFetchStarredNotesLoading(true);
  //   axiosClient
  //     .get('/notes/starred')
  //     .then(({ data }) => {
  //       setStarredNotes(data.data.data);
  //       setPaginateStarredNotes({
  //         total: data.data.total,
  //         last_page: data.data.last_page,
  //         per_page: data.data.per_page,
  //         current_page: data.data.last_page > 1 ? 2 : 1,
  //         loading: false,
  //       });
  //     })
  //     .catch((err) => console.log(err))
  //     .finally(() => setFetchStarredNotesLoading(false));
  // }, []);

  // const getNotes = (current_page) => {
  //   setPaginateNotes({
  //     ...paginateNotes,
  //     loading: true,
  //   });
  //   axiosClient
  //     .get(`/notes?page=${current_page}`)
  //     .then(({ data }) => {
  //       setNotes([...notes, ...data.data.data]);
  //     })
  //     .catch((err) => console.log(err))
  //     .finally(() =>
  //       setPaginateNotes({
  //         ...paginateNotes,
  //         loading: false,
  //         current_page: paginateNotes.current_page + 1,
  //       })
  //     );
  // };

  // const getStarredNotes = (current_page) => {
  //   setPaginateStarredNotes({
  //     ...paginateNotes,
  //     loading: true,
  //   });
  //   axiosClient
  //     .get(`/notes/starred?page=${current_page}`)
  //     .then(({ data }) => {
  //       setStarredNotes([...starredNotes, ...data.data.data]);
  //     })
  //     .catch((err) => console.log(err))
  //     .finally(() =>
  //       setPaginateStarredNotes({
  //         ...paginateStarredNotes,
  //         current_page: paginateStarredNotes.current_page + 1,
  //         loading: false,
  //       })
  //     );
  // };

  const handleMinimized = () => {
    const topbarElement = document.querySelector('.topbar');
    const headerElement = document.querySelector('.page-center-bg');
    const userContentContainer = document.querySelector(
      '.page-root-container__content'
    );

    if (isMinimized) {
      topbarElement.classList.remove('topbar-minimized');
      headerElement.classList.remove('page-center-bg-hidden');
    } else {
      topbarElement.classList.add('topbar-minimized');
      headerElement.classList.add('page-center-bg-hidden');
    }

    userContentContainer.classList.toggle(
      'page-root-container__content--minimized'
    );

    setIsMinimized((prev) => !prev);
  };

  const onDragEnd = () => {};

  return (
    <>
      <div className="flex-1 flex flex-col max-w-full relative min-w-0">
        <Header
          type={'user_page'}
          // searchValue={searchValue}
          // setSearchValue={setSearchValue}
        />
        <section className="w-full flex flex-col flex-1 max-h-full">
          <BackgroundSection
            hidden={true}
            image={user.profile.background_image}
          />
          <div className="default-layout-topbar">
            <div
              className="topbar--wrap"
              style={{ height: 'auto' }}
              data-top="356"
            >
              <div className="topbar">
                <div className="topbar__container">
                  <div className="account-center-topbar__container">
                    <div className="account-center-avatar-wrap">
                      <div className="account-center-avatar">
                        <img
                          className="avatar__img"
                          src={user.profile.avatar}
                          alt="user-avatar"
                        />
                      </div>
                    </div>
                    <div className="account-center-user-wrap">
                      <div className="account-center-basic-rows account-center-basic-rows--top">
                        {/* User name and level? */}
                        <div className="account-center-basic-row1">
                          <span className="user-basic-nickname">
                            {user.profile.name}
                          </span>
                          <div
                            className="account-title__level"
                            style={{
                              backgroundColor: `var(${randomColorGenerator()})`,
                            }}
                          >
                            <span>Level 1</span>
                          </div>
                        </div>
                        {/* User sign, tags,... */}
                        <div className="account-center-basic-row2">
                          {/* Icon here */}
                          <BiCommentDetail className="icon-user__intro" />
                          {/* User sign here */}
                          <p>
                            {user.profile.sign
                              ? user.profile.sign
                              : 'Chữ ký mặc định của hệ thống đã được cấp cho mọi người'}
                          </p>
                        </div>
                      </div>
                      <div className="account-center-basic-rows account-center-basic-rows--bottom">
                        <div className="account-center-basic-item">
                          {/* Icon goes here */}
                          <span>
                            <GiNotebook className="account-center-icon" />
                          </span>
                          <span className="account-center-basic-num">1</span>
                          <span className="account-center-basic-name">
                            Notes
                          </span>
                          <span className="account-center-basic-split">/</span>
                        </div>
                        <div className="account-center-basic-item">
                          {/* Icon goes here */}
                          <span>
                            <IoCalendarSharp className="account-center-icon" />
                          </span>
                          <span className="account-center-basic-num">1</span>
                          <span className="account-center-basic-name">
                            Schedules
                          </span>
                          <span className="account-center-basic-split">/</span>
                        </div>
                        <div className="account-center-basic-item">
                          {/* Icon goes here */}
                          <span>
                            <GiCardExchange className="account-center-icon" />
                          </span>
                          <span className="account-center-basic-num">1</span>
                          <span className="account-center-basic-name">
                            Flashcards
                          </span>
                          {/* <span className="account-center-basic-split">/</span> */}
                        </div>
                      </div>
                    </div>
                    <div className="account-center-btn-group">
                      <div className="drop-expand">
                        <div
                          className="account-center-select-btn"
                          style={{ marginRight: '16px' }}
                          title="Thu nhỏ phần avatar và background"
                          onClick={() => handleMinimized()}
                        >
                          <span className="flex items-center justify-center">
                            {isMinimized ? 'Mở rộng' : 'Thu nhỏ'}
                            {/* Icon goes here */}
                            <FiMinimize className="icon-select__arrow" />
                          </span>
                        </div>
                        <div
                          onClick={() => {
                            setOptionsVisible(!isOptionsVisible);
                          }}
                          ref={optionsRef}
                          className="account-center-select-btn"
                        >
                          <span className="flex items-center justify-center">
                            Chỉnh sửa
                            {/* Icon goes here */}
                            <TiArrowSortedDown className="icon-select__arrow" />
                          </span>
                        </div>
                        {isOptionsVisible && (
                          <div className="float-dialog">
                            <ul className="account-center-select-submenu">
                              <li
                                onClick={() => setEditModalOpen(true)}
                                className="account-center-submenu-item"
                              >
                                Hoàn thiện thông tin cá nhân
                              </li>
                              <li
                                onClick={() => setBgModalOpen(true)}
                                className="account-center-submenu-item"
                              >
                                {/* Decorate lại trang private */}
                                Thay đổi hình nền
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="page-root-container__content user-root-container__content">
            <div className="page-scroller profile-page-scroller">
              {/* Left side of the main content */}
              {/* <div className="page-root-container__left profile-root-container__left">
                  <NotesContainer
                    paginate={paginateStarredNotes}
                    loading={fetchStarredNotesLoading}
                    headerTitle={'Starred Notes'}
                    data={starredNotes}
                    setStarredNotes={setStarredNotes}
                    setNotes={setNotes}
                    getNotes={getStarredNotes}
                  />
                  <NotesContainer
                    paginate={paginateNotes}
                    loading={fetchNotesLoading}
                    headerTitle={'Recent Notes'}
                    data={notes}
                    setStarredNotes={setStarredNotes}
                    setNotes={setNotes}
                    getNotes={getNotes}
                  />
                </div> */}

              {/* Right side of the main content */}
              <div className="page-root-container__right">
                <div className="layout__sub w-full">
                  <div>
                    <div className="w-[336px]">
                      <Toolbox toolList={toolList} />
                      <BasicInfoBox />
                      <OtherInfoBox />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Edit info modal */}
      <UserInfoEditModal
        user={user}
        setUser={setUser}
        editModalOpen={editModalOpen}
        setEditModalOpen={setEditModalOpen}
        userInfo={userInfo}
        setUserInfo={setUserInfo}
        isCurrentUser={paramId === currentUser.id}
      />

      {/* BackgroundImgModal */}
      <BackgroundImgModal
        user={user}
        setUser={setUser}
        userInfo={userInfo}
        setUserInfo={setUserInfo}
        bgModalOpen={bgModalOpen}
        setBgModalOpen={setBgModalOpen}
        isCurrentUser={paramId === currentUser.id}
      />
    </>
  );
};

export default PublicProfile;
