import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import StarBg from '~/components/Home/StarBg/StarBg';
import { userStateContext } from '~/contexts/ContextProvider';

const GuestLayout = () => {
  const { userToken } = userStateContext();

  if (userToken) {
    return <Navigate to="/profile/private" />;
  }

  return (
    <>
      <Navbar isLogin={true} />
      <StarBg minVh={false} styles="h-screen">
        <Outlet />
      </StarBg>
    </>
  );
};

export default GuestLayout;
