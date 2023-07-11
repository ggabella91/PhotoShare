import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { FormInput } from '../form-input/form-input.component';
import Button from '../button/button.component';
import Alert from 'react-bootstrap/Alert';

import { signInStart } from '../../redux/user/user.actions';
import { selectUserSignInOrOutError } from '../../redux/user/user.selectors';

export const SignIn: React.FC = () => {
  const [userCredentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const [show, setShow] = useState(true);
  const dispatch = useDispatch();

  const { email, password } = userCredentials;
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    dispatch(signInStart({ email, password }));
  };

  const [error, setError] = useState(false);
  const signInError = useSelector(selectUserSignInOrOutError);

  useEffect(() => {
    if (signInError) {
      setError(true);
    }
  }, [signInError]);

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

    setCredentials({ ...userCredentials, [name]: value });
  };

  const handleHideAlert = () => setShow(false);

  return (
    <div className='sign-in'>
      <h4>Existing user?</h4>
      <div className='sub-text'>
        <span>Sign in</span>
      </div>

      <form className='sign-in-form' onSubmit={handleSubmit}>
        <FormInput
          name='email'
          type='email'
          value={email}
          onChange={handleChange}
          label='email'
        />
        <FormInput
          name='password'
          type='password'
          value={password}
          onChange={handleChange}
          label='password'
        />
        <div>
          {error
            ? handleRenderAlert('danger', 'Incorrect email or password.')
            : null}
        </div>

        <div className='button'>
          <Button className='submit-button' onClick={handleSubmit}>
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

export default SignIn;
