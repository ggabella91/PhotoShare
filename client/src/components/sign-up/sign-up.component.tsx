import React, { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { FormInput } from '../form-input/form-input.component';
import Button from '../button/button.component';
import Alert from 'react-bootstrap/Alert';

import { signUpStart } from '../../redux/user/user.actions';
import { selectUserSignUpError } from '../../redux/user/user.selectors';

export const SignUp: React.FC = () => {
  const [userCredentials, setUserCredentials] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });

  const [show, setShow] = useState(true);
  const dispatch = useDispatch();

  const { username, name, email, password, passwordConfirm } = userCredentials;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Need to handle including username in /signup route request body in auth service
    dispatch(signUpStart({ username, name, email, password, passwordConfirm }));
  };

  const [error, setError] = useState(false);

  const signUpError = useSelector(selectUserSignUpError);

  useEffect(() => {
    if (signUpError) {
      setError(true);
    }
  }, [signUpError]);

  const handleRenderAlert = (type: string, message: string) => {
    if (show) {
      return (
        <Alert variant={type} onClose={handleHideAlert} dismissible>
          {message}
        </Alert>
      );
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;

    setUserCredentials({ ...userCredentials, [name]: value });
  };

  const handleHideAlert = () => setShow(false);

  return (
    <div>
      <h4 className='title'>Don't have an account yet?</h4>
      <div className='sub-text'>
        <span>Sign up below!</span>
      </div>
      <form className='sign-up-form' onSubmit={handleSubmit}>
        <FormInput
          type='text'
          name='username'
          value={username}
          onChange={handleChange}
          label='username'
        />
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
            ? handleRenderAlert('danger', 'Error signing up. Please try again.')
            : null}
        </div>
        <div className='button'>
          <Button className='submit-button' onClick={handleSubmit}>
            Sign Up
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
