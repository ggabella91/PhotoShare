import React, { useState, useEffect } from 'react';

import { FormInput } from '../../components/form-input/form-input.component';
import Button from '../../components/button/button.component';
import Alert from 'react-bootstrap/Alert';

import './settings-page.styles.scss';

const SettingsPage: React.FC = () => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
  });

  const { name, email } = userInfo;

  const handleInfoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;

    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmitInfo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // changeInfoStart(name, email);
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
            <span>Update Info</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
