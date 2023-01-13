import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Button, Typography, Avatar } from '@mui/material';
import { Notification } from '../../redux/follower/follower.types';

interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
}) => {
  const { message, createdAt, postId } = notification;
  const navigate = useNavigate();

  const handleClickNotificationItem = () => {
    if (postId) {
      navigate(`/p/${postId}`);
    }
  };

  return (
    <Grid sx={{ display: 'flex', flexDirection: 'row', height: '75px' }}>
      <Grid>
        <Avatar
          src={''
            // userInfo?.profilePhotoFileString
            //   ?
            // `data:image/jpeg;base64,${
              // '' /**user profile photo's file string */
            // }`
            // : ''
          }
          alt={''}
          sx={{ height: '56px', width: '56px' }}
        />
      </Grid>
      <Button
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          minWidth: 'unset',
          height: '100%',
          textTransform: 'unset',
          padding: 1,
          color: 'black',
          borderBottom: '1px solid rgb(219,219,219)',
          borderRadius: 0,
          textAlign: 'start',
          '&:hover': {
            backgroundColor: 'unset',
          },
        }}
        disableRipple
        onClick={handleClickNotificationItem}
      >
        <Typography sx={{ width: 'inherit', fontSize: '14px ' }}>
          {message}
        </Typography>
        <Typography sx={{ width: 'inherit', fontSize: '12px ' }}>
          {new Date(createdAt).toDateString()}
        </Typography>
      </Button>
    </Grid>
  );
};

export default NotificationItem;
