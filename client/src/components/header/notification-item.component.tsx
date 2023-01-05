import React from 'react';
import { Grid, Typography } from '@mui/material';
import { Notification } from '../../redux/follower/follower.types';

interface NotificationItemProps {
  notification: Notification;
}

// TODO: Make component a button; add click handler that will,
// if the notification involves a post, navigate user to that post

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
}) => {
  const { message, createdAt } = notification;

  return (
    <Grid sx={{ display: 'flex', flexDirection: 'row', height: '60px' }}>
      <Grid>{/* Avatar will go here */}</Grid>
      <Grid sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography>{message}</Typography>
        <Typography>{createdAt.toDateString()}</Typography>
      </Grid>
    </Grid>
  );
};

export default NotificationItem;
