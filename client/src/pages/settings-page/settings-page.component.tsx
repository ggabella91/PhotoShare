import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { FormInput } from '../../components/form-input/form-input.component';
import Button from '../../components/button/button.component';
import Alert from 'react-bootstrap/Alert';

import './settings-page.styles.scss';

const SettingsPage: React.FC = () => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
  });

  const [userPassword, setUserPassword] = useState({
    passwordCurrent: '',
    password: '',
    passwordConfirm: '',
  });

  const { name, email } = userInfo;
  const { passwordCurrent, password, passwordConfirm } = userPassword;

  const handleInfoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;

    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmitInfo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // changeInfoStart(name, email);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;

    setUserPassword({ ...userPassword, [name]: value });
  };

  const handleSubmitPassword = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    // changePasswordStart(passwordCurrent, password, passwordConfirm);
  };

  return (
    <div className='settings'>
      <h2>Settings</h2>
      <form className='change-info' onSubmit={handleSubmitInfo}>
        <span>Update your info</span>
        <FormInput
          type='text'
          name='name'
          value={name}
          onChange={handleInfoChange}
          label='name'
        />
        <FormInput
          type='email'
          name='email'
          value={email}
          onChange={handleInfoChange}
          label='email'
        />
        <div className='button'>
          <Button
            className='submit-button settings-button'
            onSubmit={handleSubmitInfo}
          >
            <span className='update-info'>Update Info</span>
          </Button>
        </div>
      </form>
      <form className='change-info' onSubmit={handleSubmitPassword}>
        <span>Change your password</span>
        <FormInput
          type='password'
          name='passwordCurrent'
          value={passwordCurrent}
          onChange={handlePasswordChange}
          label='current password'
        />
        <FormInput
          type='password'
          name='password'
          value={password}
          onChange={handlePasswordChange}
          label='new password'
        />
        <FormInput
          type='password'
          name='passwordConfirm'
          value={passwordConfirm}
          onChange={handlePasswordChange}
          label='confirm new password'
        />
        <div className='button'>
          <Button
            className='submit-button settings-button password-button'
            onSubmit={handleSubmitPassword}
          >
            <span className='update-info password'>Change Password</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({});

const mapDispatchProps = () => ({});

export default connect(mapStateToProps, mapDispatchProps)(SettingsPage);
