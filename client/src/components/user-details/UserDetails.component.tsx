import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Avatar, Grid, Typography } from '@mui/material';
import { RadioButtonUnchecked, CheckCircle } from '@mui/icons-material';

import { UserInfoData } from '../search-bar/search-bar.component';

import { MessageUser } from '../../redux/message/message.types';
import { selectUsersArrayForNewConvoReq } from '../../redux/message/message.selectors';
import {
  addUserToConvoUsersArray,
  removeUserFromConvoUsersArray,
} from '../../redux/message/message.actions';

interface UserDetailsProps {
  key: string;
  userData: UserInfoData;
}

const UserDetails = ({ userData }: UserDetailsProps) => {
  const [isChecked, setIsChecked] = useState(false);

  const usersArrayForNewConvoReq = useSelector(selectUsersArrayForNewConvoReq);

  const dispatch = useDispatch();

  useEffect(() => {
    const userChipFound = usersArrayForNewConvoReq.find(
      (user) => user.userId === userData.id
    );

    if (!userChipFound && isChecked) {
      setIsChecked(false);
    }
  }, [usersArrayForNewConvoReq]);

  const handleClick = () => {
    const user: Partial<MessageUser> = {
      userId: userData.id!,
      name: userData.name,
      username: userData.username,
      photoS3Key: userData.photo || '',
    };

    isChecked
      ? dispatch(removeUserFromConvoUsersArray(user.userId!))
      : dispatch(addUserToConvoUsersArray(user));

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
        item
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
        item
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
        item
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
