import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import {
  About,
  Contact,
  Experience,
  Feedbacks,
  Hero,
  Tech,
  Works,
  StarsCanvas,
} from '../components/Home';
import './styles/Home.scss';

import Navbar from '../components/Layout/Guest/Navbar/Navbar';
import StarBg from '../components/Home/StarBg/StarBg';
import { userStateContext } from '../contexts/ContextProvider';

const Home = () => {
  const { userToken } = userStateContext();

  useEffect(() => {
    document.title = 'Welcome to NFC - Home';
  }, []);

  if (userToken) {
    return <Navigate to="/profile/private" />;
  }

  return (
    <div className="relative z-0 bg-primary">
      <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
        <Navbar isLogin={false} />
        <Hero />
      </div>
      <About />
      <Experience />
      <Tech />
      <Works />
      <Feedbacks />
      <StarBg styles="min-h-screen" minVh={true}>
        <div className="relative z-0">
          <Contact />
          <StarsCanvas />
        </div>
      </StarBg>
    </div>
  );
};

export default Home;
