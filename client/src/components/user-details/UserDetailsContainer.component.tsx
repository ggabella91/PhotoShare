import React from 'react';
import { Grid } from '@mui/material';

import UserDetails from './UserDetails.component';
import { UserInfoData } from '../search-bar/search-bar.component';

interface UserDetailsContainerProps {
  userDataArray: UserInfoData[];
}

const UserDetailsContainer = ({ userDataArray }: UserDetailsContainerProps) => {
  return (
    <Grid sx={{ width: '100%', height: 'auto' }}>
      {userDataArray.map((userData) => (
        <UserDetails userData={userData} key={userData.id!} />
      ))}
    </Grid>
  );
};

export default UserDetailsContainer;
