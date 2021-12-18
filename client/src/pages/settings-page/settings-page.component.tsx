import React from 'react';

import UpdateProfilePhoto from '../../components/update-profile-photo/update-profile-photo.component';
import UpdateInfo from '../../components/update-info/update-info.component';
import UpdatePassword from '../../components/update-password/update-password.component';

import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

import './settings-page.styles.scss';

export const SettingsPage: React.FC = () => {
  return (
    <Tabs id='settings-page' transition={false} data-testid='settings-page'>
      <Tab eventKey='update-profile-photo' title='Update Profile Photo'>
        <UpdateProfilePhoto />
      </Tab>
      <Tab eventKey='update-info' className='settings' title='Update Info'>
        <UpdateInfo />
      </Tab>
      <Tab
        eventKey='update-password'
        className='settings'
        title='Update Password'
      >
        <UpdatePassword />
      </Tab>
    </Tabs>
  );
};

export default SettingsPage;
