import React, { useState } from 'react';
import { Avatar, Grid, Typography } from '@mui/material';
import { RadioButtonUnchecked, CheckCircle } from '@mui/icons-material';

import { UserInfoData } from '../search-bar/search-bar.component';

interface UserDetailsProps {
  userData: UserInfoData;
}

const UserDetails = ({ userData }: UserDetailsProps) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleClick = () => {
    setIsChecked(!isChecked);
  };

  return (
    <Grid
      sx={{
        width: '100%',
        height: '60px',
        padding: '5px 15px',
        display: 'flex',
        cursor: 'pointer',
      }}
      onClick={handleClick}
    >
      <Grid
        xs={2}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: '12px',
          width: '15%',
        }}
      >
        <Avatar
          src={`data:image/jpeg;base64,${userData.profilePhotoFileString}`}
          alt={userData.name}
          sx={{ height: '44px', width: '44px' }}
        />
      </Grid>
      <Grid
        xs={8}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          width: '75%',
        }}
      >
        <Typography sx={{ fontSize: 14, fontWeight: 520 }}>
          {userData.username}
        </Typography>
        <Typography sx={{ fontSize: 14, fontWeight: 300 }}>
          {userData.name}
        </Typography>
      </Grid>
      <Grid
        xs={2}
        fontSize='large'
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          width: '10%',
        }}
      >
        {isChecked ? (
          <CheckCircle sx={{ color: 'rgb(0, 149, 246)' }} />
        ) : (
          <RadioButtonUnchecked />
        )}
      </Grid>
    </Grid>
  );
};

export default UserDetails;
