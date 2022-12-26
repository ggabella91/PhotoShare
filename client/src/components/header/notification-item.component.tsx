import React from 'react';
import { Grid, Typography } from '@mui/material';
import { Notification } from '../../redux/follower/follower.types';

interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
}) => {
  const { message, createdAt } = notification;

  return (
    <Grid sx={{ display: 'flex', flexDirection: 'row' }}>
      <Grid>{/* Avatar will go here */}</Grid>
      <Grid sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography>{message}</Typography>
        <Typography>{createdAt.toDateString()}</Typography>
      </Grid>
    </Grid>
  );
};

export default NotificationItem;
