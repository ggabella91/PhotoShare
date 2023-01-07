import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Button, Typography } from '@mui/material';
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
    <Grid sx={{ display: 'flex', flexDirection: 'row', height: '60px' }}>
      <Grid>{/* Avatar will go here */}</Grid>
      <Button
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          minWidth: 'unset',
          height: '100%',
          textTransform: 'unset',
          padding: 0,
          '&:hover': {
            backgroundColor: 'unset',
          },
        }}
        disableRipple
        onClick={handleClickNotificationItem}
      >
        <Typography>{message}</Typography>
        <Typography>{createdAt.toDateString()}</Typography>
      </Button>
    </Grid>
  );
};

export default NotificationItem;
