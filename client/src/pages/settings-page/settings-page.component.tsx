import React from 'react';

import UpdateProfilePhoto from '../../components/update-profile-photo/update-profile-photo.component';
import UpdateInfo from '../../components/update-info/update-info.component';
import UpdatePassword from '../../components/update-password/update-password.component';

import Tabs from 'react-bootstrap/Tabs';

import './settings-page.styles.scss';

const SettingsPage: React.FC = () => {
  return (
    <div className='settings'>
      <h2>Settings</h2>
      <UpdateProfilePhoto />
      <UpdateInfo />
      <UpdatePassword />
    </div>
  );
};

export default SettingsPage;
