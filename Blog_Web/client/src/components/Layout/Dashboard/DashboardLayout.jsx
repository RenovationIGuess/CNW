import { useEffect } from 'react';
import { userStateContext } from '~/contexts/ContextProvider';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import './DashboardLayout.scss';
import axiosClient from '~/axios';
import { ToastContainer } from 'react-toastify';
import Sidebar from '~/components/Sidebar/Sidebar';
import ActionNotiToast from '~/components/ActionNotiToast';
import ActionNotiToastBottom from '~/components/ActionNotiToastBottom';
import ConfirmModal from '~/components/ConfirmModal/ConfirmModal';
import useModalStore from '~/store/useModalStore';
import { objUtils } from '~/utils';
import { Toaster } from 'sonner';
import SidebarSkeleton from '~/components/Sidebar/SidebarSkeleton';

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // const navigate = useNavigate();
  const { currentUser, setCurrentUser, userToken, setUserToken } =
    userStateContext();

  const { fetchingUser, setFetchingUser } = userStateContext();

  const [
    bottomToast,
    actionToast,
    setActionToast,
    confirmModalInfo,
    confirmModalOpen,
    setConfirmModalOpen,
    confirmModalLoading,
  ] = useModalStore((state) => [
    state.bottomToast,
    state.actionToast,
    state.setActionToast,
    state.confirmModalInfo,
    state.confirmModalOpen,
    state.setConfirmModalOpen,
    state.confirmModalLoading,
  ]);

  useEffect(() => {
    if (userToken) {
      setFetchingUser(true);
      axiosClient
        .get('/auth/me')
        .then(({ data }) => {
          // console.log(data);
          if (data.message === 'Unauthorized') {
            navigate('/nfc/signin');
          } else {
            const userInfo = data.data;
            setCurrentUser(userInfo);
          }
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            console.log('Unauthorized');
            localStorage.removeItem('TOKEN');
            setUserToken(null);
          }
          console.error(err);
        })
        .finally(() => setFetchingUser(false));
    } else {
      console.log('Navigated');
      navigate('/nfc/signin');
    }
  }, [userToken]);

  if (!userToken) {
    return <Navigate to="/nfc/signin" />;
  }

  // If the user state is not null => definitely have token
  if (location.pathname === '/' && !objUtils.isEmptyObject(currentUser)) {
    return <Navigate to="/blogs" />;
  }

  if (fetchingUser) {
    return (
      <div className="app__container h-screen overflow-hidden min-h-0 relative flex">
        <SidebarSkeleton />
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 min-h-0 min-w-0 flex items-center justify-center">
            <div className="flex justify-center items-center flex-col gap-4">
              <div className="my-loader loader-xl"></div>
              <p className="loader-text">Getting your datas...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="app__container h-screen overflow-hidden min-h-0 relative flex">
        <Sidebar />
        <Outlet
        // context={[isSidebarMinimized]}
        />
        <ToastContainer autoClose={3000} />
        <Toaster
          // expand={true}
          duration={1500}
          position="top-right"
          theme="light"
          closeButton={true}
          richColors
        />

        {/* Modal aka Popups */}
        {actionToast.status && (
          <ActionNotiToast
            actionToast={actionToast}
            setActionToast={setActionToast}
          />
        )}

        <ActionNotiToastBottom bottomToast={bottomToast} />

        <ConfirmModal
          loading={confirmModalLoading}
          confirmTitle={confirmModalInfo.title}
          confirmMessage={confirmModalInfo.message}
          confirmModalOpen={confirmModalOpen}
          confirmCallback={confirmModalInfo.confirmCallback}
          cancelCallback={confirmModalInfo.cancelCallback}
          setConfirmModalOpen={setConfirmModalOpen}
        />
      </div>
    </>
  );
};

export default DashboardLayout;
