import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import FormInput, { FormInputProps } from '../form-input/form-input.component';
import Button from '../button/button.component';
import Alert from 'react-bootstrap/Alert';
// import { signInStart } from '../../redux/user/user.actions';
// import { selectUserSignInOrOutError } from '../../redux/user/user.selectors';
// import { UserSignIn } from '../../redux/user/user.types';

import './sign-in.styles.scss';

type FormProps = {
  onSubmit: () => void;
};

type SubmitProps = {
  handleSubmit: () => void;
  onSubmit: () => void;
};

type SignInProps = {
  signInStart: (email: string, password: string) => {};
  signInError: string;
};

const SignIn: React.FC<SignInProps> = ({ signInStart, signInError }) => {
  const [userCredentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const [show, setShow] = useState(true);

  const { email, password } = userCredentials;
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    signInStart(email, password);
  };

  const [error, setError] = useState(false);

  useEffect(() => {
    if (signInError) {
      setError(true);
    }
  }, [signInError]);

  const handleRenderAlert = (type: string, message: string) => {
    if (type === 'error' && show) {
      return (
        <Alert variant='danger' onClose={() => setShow(false)} dismissible>
          {message}
        </Alert>
      );
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;

    setCredentials({ ...userCredentials, [name]: value });
  };

  return (
    <div className='sign-in'>
      <h2>I already have an account</h2>
      <span>Sign in with your email and password</span>

      <form onSubmit={handleSubmit}>
        <FormInput
          name='email'
          type='email'
          value={email}
          handleChange={handleChange}
          label='email'
        />
        <FormInput
          name='password'
          type='password'
          value={password}
          handleChange={handleChange}
          label='password'
        />
        <div>
          {error
            ? handleRenderAlert('error', 'Incorrect email or password.')
            : null}
        </div>

        <div className='button'>
          <Button
            className='submit-button'
            onSubmit={handleSubmit}
            type='submit'
          >
            Sign In
          </Button>
        </div>
        <div className='link-container'>
          <NavLink className='link' to='/forgot-password'>
            Forgot your password?
          </NavLink>
        </div>
      </form>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  signInError: selectUserSignInOrOutError,
});

const mapDispatchToProps = (dispatch) => ({
  signInStart: (email, password) => dispatch(signInStart(email, password)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
