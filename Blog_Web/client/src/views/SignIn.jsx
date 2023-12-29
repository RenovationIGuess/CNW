import React, { useEffect, useState } from 'react';
import { images } from '../constants';
import './styles/SignIn.scss';
import { stringUtils } from '../utils';
import { authFieldsCheck } from '../utils';
import { motion } from 'framer-motion';
import axiosClient from '../axios';
import { userStateContext } from '../contexts/ContextProvider';
import { useNavigate } from 'react-router-dom';
import InputSection from '~/features/SignIn_SignUp/InputSection';
import ValidateSection from '~/features/SignIn_SignUp/ValidateSection';

const SignIn = () => {
  const navigate = useNavigate();
  const { setUserToken, setFirstIn } = userStateContext();

  // status === false => sign in else sign up
  const [status, setStatus] = useState(false);
  // Track first time change status
  const [count, setCount] = useState(0);

  // Form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfPass, setShowConfPass] = useState(false);

  // Sign up
  // 0 - Email & Password
  // 1 - Name & Job & Work Place
  const [step, setStep] = useState(0);

  // Requirements
  // Toggle validation for fields
  const [emailReq, setEmailReq] = useState({
    valid_email: 'none',
  });

  const [passwordReq, setPasswordReq] = useState({
    least_chars: 'none',
    contain_number: 'none',
    contain_letter: 'none',
    contain_special_char: 'none',
  });

  const [confPasswordReq, setConfPasswordReq] = useState({
    same_with_password: 'none',
  });

  // Use to track the requirement completion progress
  const [errorStatus, setErrorStatus] = useState(false);
  const [loading, setLoading] = useState(false);

  // Error status
  const [emailErr, setEmailErr] = useState({
    status: false,
    msg: '',
  });
  const [passwordErr, setPasswordErr] = useState({
    status: false,
    msg: '',
  });
  const [confPasswordErr, setConfPasswordErr] = useState({
    status: false,
    msg: '',
  });

  useEffect(() => {
    document.title = 'Sign In | Sign Up';
  }, []);

  useEffect(() => {
    const keyDownHandler = (event) => {
      // console.log("User pressed: ", event.key);

      if (event.key === 'Enter') {
        event.preventDefault();

        // 👇️ your logic here
        if (passwordConfirmation) handleSignUp();
        else handleSignIn();
      }
    };

    document.addEventListener('keydown', keyDownHandler);

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, [email, password, passwordConfirmation]);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  useEffect(() => {
    if (status) trackErrorBoxes();
  }, [email, password, passwordConfirmation]);

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

  const handleClickField = (event) => {
    const currentFocused = document.querySelector('.form__box-input-focus');
    if (currentFocused) {
      currentFocused.classList.remove('form__box-input-focus');
    }
    event.currentTarget.classList.add('form__box-input-focus');
  };

  const handleChangeStatus = () => {
    const formTitleElement = document.querySelector('#form-title');
    const hoyoButtonElement = document.querySelector('#button__title');
    const rightSideTitle = document.querySelector('#right-side-title');
    changeFormTitle(rightSideTitle, status ? 'Welcome User' : 'Requirements');
    changeFormTitle(formTitleElement, status ? 'Sign In' : 'Sign Up');
    changeFormTitle(hoyoButtonElement, status ? 'Sign In' : 'Sign Up');
    if (count === 0) setCount(1);
    clearAllFields();
    setStatus(!status);
  };

  const clearAllFields = () => {
    const errorFields = document.querySelectorAll('.error-status');
    if (errorFields) {
      errorFields.forEach((item) => item.classList.remove('error-status'));
    }

    setPasswordConfirmation('');
    setPassword('');
    setEmail('');

    setPasswordReq({
      least_chars: 'none',
      contain_number: 'none',
      contain_letter: 'none',
      contain_special_char: 'none',
    });

    setEmailReq({
      valid_email: 'none',
    });

    setConfPasswordReq({
      same_with_password: 'none',
    });

    setEmailErr({
      msg: '',
      status: false,
    });
    setConfPasswordErr({
      msg: '',
      status: false,
    });
    setPasswordErr({
      msg: '',
      status: false,
    });

    setShowConfPass(false);
    setShowPass(false);

    setErrorStatus(false);
  };

  // Hover change text effect
  // textValue1 = before value, textValue2 = after value
  const changeFormTitle = (element, textValue) => {
    let iterations = 0;
    const upperCaseLetter = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCaseLetter = 'abcdefghijklmnopqrstuvwxyz';

    const interval = setInterval(() => {
      // 0 1 2 3 4 5 6
      // S i g n   U p
      element.innerText = element.innerText
        .split('')
        .map((letter, index) => {
          if (index < iterations) {
            return textValue[index];
          }
          if (textValue[index] === ' ') return ' ';
          if (stringUtils.isUpperCase(textValue[index])) {
            return upperCaseLetter[Math.floor(Math.random() * 26)];
          } else {
            return lowerCaseLetter[Math.floor(Math.random() * 26)];
          }
        })
        .join('');

      if (iterations >= textValue.length) {
        clearInterval(interval);
      }

      iterations += 1 / 3;
    }, 30);
  };

  const onEmailFieldBlur = () => {
    if (email === '') {
      document
        .querySelector('#email-field')
        .parentElement.classList.add('error-status');

      setEmailReq({
        valid_email: 'none',
      });

      setEmailErr({
        status: true,
        msg: "*Don't leave this field blank",
      });
    }
  };

  const onPasswordFieldBlur = () => {
    if (password === '') {
      document
        .querySelector('#pass-field')
        .parentElement.classList.add('error-status');

      setPasswordReq({
        least_chars: 'none',
        contain_number: 'none',
        contain_letter: 'none',
        contain_special_char: 'none',
      });

      setPasswordErr({
        status: true,
        msg: "*Don't leave this field blank",
      });
    }
  };

  const onConfPasswordFieldBlur = () => {
    if (passwordConfirmation === '') {
      document
        .querySelector('#conf-pass-field')
        .parentElement.classList.add('error-status');

      setConfPasswordReq({
        same_with_password: 'none',
      });

      setConfPasswordErr({
        status: true,
        msg: "*Don't leave this field blank",
      });
    }
  };

  const onEmailFieldChange = (event) => {
    if (emailErr.status)
      setEmailErr({
        msg: '',
        status: false,
      });

    if (event.target.parentElement.classList.contains('error-status')) {
      event.target.parentElement.classList.remove('error-status');
    }

    if (!authFieldsCheck.validateEmail(event.target.value)) {
      setEmailReq({
        valid_email: 'error',
      });
    } else {
      setEmailReq({
        valid_email: 'success',
      });
    }

    setEmail(event.target.value);
  };

  const onPasswordFieldChange = (event) => {
    let charPattern = /[A-Za-z]/;
    let numberPattern = /[0-9]/;
    let specialCharPattern = /\W/;

    if (passwordErr.status)
      setPasswordErr({
        status: false,
        msg: '',
      });

    if (event.target.parentElement.classList.contains('error-status')) {
      event.target.parentElement.classList.remove('error-status');
    }

    let leastChars = 'none';
    let containLetter = 'none';
    let containNumber = 'none';
    let containSpecialChar = 'none';

    if (event.target.value.length < 8) {
      leastChars = 'error';
    } else {
      leastChars = 'success';
    }

    if (event.target.value.match(numberPattern)) {
      containNumber = 'success';
    } else {
      containNumber = 'error';
    }

    if (event.target.value.match(charPattern)) {
      containLetter = 'success';
    } else {
      containLetter = 'error';
    }

    if (event.target.value.match(specialCharPattern)) {
      containSpecialChar = 'success';
    } else {
      containSpecialChar = 'error';
    }

    if (passwordConfirmation !== '') {
      if (event.target.value === passwordConfirmation) {
        setConfPasswordReq({
          same_with_password: 'success',
        });
      } else {
        setConfPasswordReq({
          same_with_password: 'error',
        });
      }
    }

    setPasswordReq({
      least_chars: leastChars,
      contain_number: containNumber,
      contain_letter: containLetter,
      contain_special_char: containSpecialChar,
    });
    setPassword(event.target.value);
  };

  const onConfPasswordFieldChange = (event) => {
    if (confPasswordErr.status)
      setConfPasswordErr({
        msg: '',
        status: false,
      });

    if (event.target.parentElement.classList.contains('error-status')) {
      event.target.parentElement.classList.remove('error-status');
    }

    if (event.target.value === password) {
      setConfPasswordReq({
        same_with_password: 'success',
      });
    } else {
      setConfPasswordReq({
        same_with_password: 'error',
      });
    }

    setPasswordConfirmation(event.target.value);
  };

  // Use to check the require-box has error state or not
  // And change the errorState
  const trackErrorBoxes = () => {
    let errorBoxExist = false;
    const errorBoxes = document.querySelectorAll('div.require-box');
    for (let box of errorBoxes) {
      if (box.classList.contains('error-status')) {
        errorBoxExist = true;
        break;
      }
    }
    if (errorStatus && !errorBoxExist) {
      setErrorStatus(false);
    }
  };

  const handleSignIn = () => {
    if (!email) onEmailFieldBlur();
    if (!password) onPasswordFieldBlur();
    if (!email || !password) return;

    setLoading(true);

    axiosClient
      .post('/auth/signin', {
        email,
        password,
      })
      .then(({ data }) => {
        setUserToken(data.token);
        setFirstIn(true);
      })
      .catch((err) => {
        console.error(err);
        if (err.response) {
          // err.response.data.errors: la 1 object voi cac tt: email + password
          // trong do email, password la 1 array => lay ra loi dau tien trong xau
          // error thi lai la truong hop khac
          if (err.response.data.error) {
            setPasswordErr({
              msg: err.response.data.error,
              status: true,
            });
            document
              .querySelector('#pass-field')
              .parentElement.classList.add('error-status');
          } else {
            if (err.response.data.errors.email) {
              setEmailErr({
                msg: err.response.data.errors.email[0],
                status: true,
              });
              document
                .querySelector('#email-field')
                .parentElement.classList.add('error-status');
            }

            if (err.response.data.errors.password) {
              setPasswordErr({
                msg: err.response.data.errors.password[0],
                status: true,
              });
              document
                .querySelector('#pass-field')
                .parentElement.classList.add('error-status');
            }
          }
        }
      })
      .finally(() => setLoading(false));
  };

  const handleSignUp = () => {
    if (!email) onEmailFieldBlur();
    if (!password) onPasswordFieldBlur();
    if (!passwordConfirmation) onConfPasswordFieldBlur();
    if (!email || !password || !passwordConfirmation) return;

    let errorState = false;
    const requireBoxes = document.querySelectorAll('div.require-box');
    for (let node of requireBoxes) {
      if (node.classList.contains('error-status')) {
        errorState = true;
        break;
      }
    }
    if (errorState) {
      setErrorStatus(true);
      return;
    }

    setLoading(true);

    axiosClient
      .post('/auth/signup', {
        email,
        password,
        password_confirmation: passwordConfirmation,
      })
      .then(({ data }) => {
        setFirstIn(true);
        setUserToken(data.token);
      })
      .catch((err) => {
        console.error(err);
        if (err.response) {
          // err.response.data.errors: la 1 object voi cac tt: email + password
          // trong do email, password la 1 array => lay ra loi dau tien trong xau
          if (err.response.data.errors?.email) {
            setEmailErr({
              msg: err.response.data.errors.email[0],
              status: true,
            });
            document
              .querySelector('#email-field')
              .parentElement.classList.add('error-status');
          }

          if (err.response.data.errors?.password) {
            setPasswordErr({
              msg: err.response.data.errors.password[0],
              status: true,
            });
            document
              .querySelector('#pass-field')
              .parentElement.classList.add('error-status');
          }
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      {/* open - sign up | closed - sign in */}
      <motion.div initial="closed" animate="open" className="form__container">
        <div className="form__container-wrapper">
          <div
            className={
              status
                ? 'form__box-container extend-height'
                : 'form__box-container'
            }
          >
            <img className="img-paimon" src={images.paimon} alt="paimon" />
            <img className="img-star" src={images.star1} alt="star1-1" />
            <img className="img-star" src={images.star1} alt="star1-2" />
            <img className="img-star" src={images.star2} alt="star2-2" />
            <img className="img-star" src={images.star2} alt="star2-1" />
            <img className="img-globe" src={images.globe1} alt="globe-1" />
            <img className="img-globe" src={images.globe2} alt="globe-2" />
            <img className="img-globe" src={images.globe3} alt="globe-3" />
            {/* <ErrorToastMsg 
                style={{ top: '-50px', left: '-200px' }}
                variants={itemVariants}
                description="Please resolve the requirements"
              /> */}

            <InputSection
              email={email}
              emailErr={emailErr}
              onEmailFieldChange={onEmailFieldChange}
              onEmailFieldBlur={onEmailFieldBlur}
              password={password}
              passwordErr={passwordErr}
              onPasswordFieldChange={onPasswordFieldChange}
              onPasswordFieldBlur={onPasswordFieldBlur}
              showPass={showPass}
              setShowPass={setShowPass}
              passwordConfirmation={passwordConfirmation}
              showConfPass={showConfPass}
              setShowConfPass={setShowConfPass}
              confPasswordErr={confPasswordErr}
              onConfPasswordFieldChange={onConfPasswordFieldChange}
              onConfPasswordFieldBlur={onConfPasswordFieldBlur}
              status={status}
              handleChangeStatus={handleChangeStatus}
              handleSignIn={handleSignIn}
              handleSignUp={handleSignUp}
              loading={loading}
              count={count}
              handleClickField={handleClickField}
            />

            <ValidateSection
              status={status}
              errorStatus={errorStatus}
              emailReq={emailReq}
              passwordReq={passwordReq}
              confPasswordReq={confPasswordReq}
            />
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default SignIn;
