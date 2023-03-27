import React from 'react';
import { Grid } from '@mui/material';
import { List } from 'immutable';

import UserDetails from './UserDetails.component';
import { UserInfoData } from '../search-bar/search-bar.component';

// TODO Change immmutable List to regular array

interface UserDetailsContainerProps {
  userDataList: List<UserInfoData>;
}

const UserDetailsContainer = ({ userDataList }: UserDetailsContainerProps) => {
  return (
    <Grid sx={{ width: '100%', height: 'auto' }}>
      {userDataList.map((userData) => (
        <UserDetails userData={userData} key={userData.id!} />
      ))}
    </Grid>
  );
};

export default UserDetailsContainer;
