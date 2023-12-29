import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
// import emailjs from "@emailjs/browser";

import { styles } from '../../styles';
import { EarthCanvas } from './canvas';
import { SectionWrapper } from '../../hoc';
import { slideIn } from '../../utils/motion';
import HoyoButton from '../HoyoButton/HoyoButton';
import {
  itemVariants2,
  parentVariants,
  errorVariants,
} from '../../constants/motion';
import { authFieldsCheck } from '../../utils';
import '../../views/styles/SignIn.scss';

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({
    name: '',
    email: '',
  });
  // const [value, setValue] = useState(mkdStr);
  const [loading, setLoading] = useState(false);

  // Error status
  const [nameErr, setNameErr] = useState({
    status: false,
    msg: '',
  });
  const [emailErr, setEmailErr] = useState({
    status: false,
    msg: '',
  });

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  const handleClickOutside = (event) => {
    const currentFocused = document.querySelector('.form__box-input-focus');
    if (
      event.target.parentElement &&
      currentFocused &&
      currentFocused !== event.target.parentElement
    ) {
      currentFocused.classList.remove('form__box-input-focus');
    }
  };

  const handleSubmit = (e) => {};

  const handleClickField = (event) => {
    const currentFocused = document.querySelector('.form__box-input-focus');
    if (currentFocused) {
      currentFocused.classList.remove('form__box-input-focus');
    }
    event.target.parentElement.classList.add('form__box-input-focus');
  };

  const onNameFieldBlur = () => {
    if (form.name === '') {
      document
        .querySelector('#name-field')
        .parentElement.classList.add('error-status');
      setNameErr({
        status: true,
        msg: "*Don't leave this field blank",
      });
    }
  };

  const onEmailFieldBlur = () => {
    if (form.email === '') {
      document
        .querySelector('#email-field')
        .parentElement.classList.add('error-status');
      setEmailErr({
        status: true,
        msg: "*Don't leave this field blank",
      });
    }
  };

  const onNameFieldChange = (event) => {
    if (nameErr) setNameErr(false);
    if (event.target.parentElement.classList.contains('error-status')) {
      event.target.parentElement.classList.remove('error-status');
    }

    setForm({ ...form, name: event.target.value });
  };

  const onEmailFieldChange = (event) => {
    if (emailErr) setEmailErr(false);
    if (event.target.parentElement.classList.contains('error-status')) {
      event.target.parentElement.classList.remove('error-status');
    }
    if (!authFieldsCheck.validateEmail(event.target.value)) {
      document
        .querySelector('#email-field')
        .parentElement.classList.add('error-status');
      setEmailErr({
        status: true,
        msg: '*Must be a valid email address',
      });
    }

    setForm({ ...form, email: event.target.value });
  };

  return (
    <div className="xl:mt-12 xl:flex-row flex-col-reverse flex gap-10 overflow-hidden">
      <motion.div
        variants={slideIn('left', 'tween', 0.2, 1)}
        className="flex-[0.75] bg-white p-8 rounded-2xl"
      >
        <p className={styles.sectionSubText}>Get in touch</p>
        <h3 className="text-[#333] font-bold md:text-[60px] sm:text-[50px] xs:text-[40px] text-[30px]">
          Contact.
        </h3>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="mt-8 flex flex-col gap-4"
        >
          <motion.label variants={parentVariants} className="flex flex-col">
            <motion.span
              variants={itemVariants2}
              className="text-[#333] font-medium mb-4"
            >
              Your Name
            </motion.span>
            {/* <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="What's your name?"
              className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium "
            /> */}
            <motion.div
              variants={itemVariants2}
              onClick={(e) => handleClickField(e)}
              className="form__box-input-wrap"
              style={{ marginTop: 0 }}
            >
              <input
                type="text"
                maxLength="100"
                className="form__box-input"
                id="name-field"
                placeholder="Please enter your name"
                value={form.name}
                onChange={(e) => onNameFieldChange(e)}
                onBlur={() => onNameFieldBlur()}
              />
              <span className="count-tip">{form.name.length}/100</span>
            </motion.div>
            <motion.p
              variants={errorVariants}
              className={nameErr.status ? 'error-text' : 'closed'}
              animate={nameErr.status ? 'open' : 'closed'}
            >
              {nameErr.msg}
            </motion.p>
          </motion.label>
          <motion.label variants={parentVariants} className="flex flex-col">
            <motion.span
              variants={itemVariants2}
              className="text-[#333] font-medium mb-4"
            >
              Your Email
            </motion.span>
            {/* <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="What's your email?"
              className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium "
            /> */}
            <motion.div
              variants={itemVariants2}
              onClick={(e) => handleClickField(e)}
              className="form__box-input-wrap"
              style={{ marginTop: 0 }}
            >
              <input
                type="text"
                maxLength="100"
                className="form__box-input"
                id="email-field"
                placeholder="Please enter your email address"
                value={form.email}
                onChange={(e) => onEmailFieldChange(e)}
                onBlur={() => onEmailFieldBlur()}
              />
              <span className="count-tip">{form.email.length}/100</span>
            </motion.div>
            <motion.p
              variants={errorVariants}
              className={emailErr.status ? 'error-text' : 'closed'}
              animate={emailErr.status ? 'open' : 'closed'}
            >
              {emailErr.msg}
            </motion.p>
          </motion.label>
          <label className="flex flex-col">
            <span className="text-[#333] font-medium mb-4">Your Message</span>
            {/* <textarea
              rows="7"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="What do you want to say?"
              className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium "
            /> */}
            {/* <div data-color-mode="light">
              <MDEditor height={200} value={value} onChange={setValue} />
            </div> */}
          </label>

          {/* <button type="submit" className="bg-tertiary py-3 px-8 outline-none w-fit text-white font-bold shadow-md shadow-primary rounded-xl">
            {loading ? "Sending..." : "Send"}
          </button> */}
          <HoyoButton description="Send" handleFunc={handleSubmit} />
        </form>
      </motion.div>

      <motion.div
        variants={slideIn('right', 'tween', 0.2, 1)}
        className="xl:flex-1 xl:h-auto md:h-[550px] h-[350px]"
      >
        <EarthCanvas />
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Contact, 'contact');
