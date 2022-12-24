import React from 'react';
import { useSelector } from 'react-redux';
import { Grid } from '@mui/material';
import NotificationItem from './notification-item.component';
import { selectNotifications } from '../../redux/follower/follower.selectors';

const NotificationsContainer: React.FC = () => {
  const notifications = useSelector(selectNotifications);

  return (
    <Grid>
      {notifications?.map((notification) => (
        <NotificationItem notification={notification} />
      ))}
    </Grid>
  );
};

export default NotificationsContainer;
