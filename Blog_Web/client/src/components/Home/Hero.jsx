import React from 'react';
import { motion } from 'framer-motion';
import { styles } from '../../styles';
import { images } from '../../constants';
import { ComputersCanvas } from './canvas';
import StarBg from './StarBg/StarBg';

const Hero = () => {
  return (
    <StarBg styles="flex justify-center items-center h-screen" minVh={false}>
      {/* <section className="relative w-full h-screen mx-auto"> */}
      <>
        <div
          className={`${styles.paddingX} absolute inset-0 top-[120px] max-w-7xl mx-auto flex flex-row items-start gap-5`}
        >
          <div className="flex flex-col justify-center items-center mt-5">
            <div className="w-5 h-5 rounded-full bg-[#7bb1ff]" />
            <div className="w-1 sm:h-80 h-40 light-blue-gradient" />
          </div>

          <div>
            <div className="flex items-center justify-start">
              <h1 className={`${styles.heroHeadText} text-white`}>
                Welcome To
              </h1>
              <img
                className="w-[250px] ml-4"
                src={images.nfclogo}
                alt="sm-white-nfc"
              />
            </div>

            <p className={`${styles.heroSubText} mt-2 text-white-100`}>
              Note, Flashcard & Calendar
              <br className="sm:block hidden" />
              All in one
            </p>
          </div>
        </div>

        <ComputersCanvas />
        <div className="absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center">
          <a href="#about">
            <div className="w-[35px] h-[64px] rounded-3xl border-4 border-secondary flex justify-center items-start p-2">
              <motion.div
                animate={{
                  y: [0, 24, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: 'loop',
                }}
                className="w-3 h-3 rounded-full bg-secondary mb-1"
              ></motion.div>
            </div>
          </a>
        </div>
      </>
      {/* </section> */}
    </StarBg>
  );
};

export default Hero;
