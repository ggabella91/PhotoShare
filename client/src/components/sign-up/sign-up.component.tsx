import React, { useState, useEffect } from 'react';

import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import FormInput from '../form-input/form-input.component';
import Button from '../button/button.component';
import Alert from 'react-bootstrap/Alert';

import { AppState } from '../../redux/root-reducer';
import { Error } from '../../redux/user/user.types';
import { signUpStart } from '../../redux/user/user.actions';
import { selectUserSignUpError } from '../../redux/user/user.selectors';
import { UserSignUp, UserPayload } from '../../redux/user/user.types';

import './sign-up.styles.scss';

interface SignUpProps {
  signUpStart: typeof signUpStart;
  signUpError: UserPayload;
}

const SignUp: React.FC<SignUpProps> = ({ signUpStart, signUpError }) => {
  const [userCredentials, setUserCredentials] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });

  const [show, setShow] = useState(true);

  const { name, email, password, passwordConfirm } = userCredentials;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    signUpStart({ name, email, password, passwordConfirm });
  };

  const [error, setError] = useState(false);

  useEffect(() => {
    if (signUpError) {
      setError(true);
    }
  }, [signUpError]);

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

    setUserCredentials({ ...userCredentials, [name]: value });
  };

  return (
    <div>
      <h2 className='title'>I do not have an account</h2>
      <span>Sign up with your email and password</span>
      <form className='sign-up-form' onSubmit={handleSubmit}>
        <FormInput
          type='text'
          name='name'
          value={name}
          onChange={handleChange}
          label='name'
        />
        <FormInput
          type='email'
          name='email'
          value={email}
          onChange={handleChange}
          label='email'
        />
        <FormInput
          type='password'
          name='password'
          value={password}
          onChange={handleChange}
          label='password'
        />
        <FormInput
          type='password'
          name='passwordConfirm'
          value={passwordConfirm}
          onChange={handleChange}
          label='confirm password'
        />
        <div>
          {error
            ? handleRenderAlert('error', 'Error signing up. Please try again.')
            : null}
        </div>
        <div className='button'>
          <Button
            className='submit-button'
            onSubmit={handleSubmit}
            type='submit'
          >
            Sign Up
          </Button>
        </div>
      </form>
    </div>
  );
};

interface LinkStateProps {
  signUpError: Error | null;
}

const mapStateToProps = createStructuredSelector<AppState, LinkStateProps>({
  signUpError: selectUserSignUpError,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  signUpStart: ({ name, email, password, passwordConfirm }: UserSignUp) =>
    dispatch(signUpStart({ name, email, password, passwordConfirm })),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
