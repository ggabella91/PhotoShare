import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid } from '@mui/material';
import NotificationItem from './notification-item.component';

import {
  selectCurrentUser,
  selectNotificationUsers,
} from '../../redux/user/user.selectors';

import { selectNotifications } from '../../redux/follower/follower.selectors';
import { getNotificationsStart } from '../../redux/follower/follower.actions';
import { getOtherUserStart } from '../../redux/user/user.actions';
import { OtherUserType } from '../../redux/user/user.types';

const NotificationsContainer: React.FC = () => {
  const currentUser = useSelector(selectCurrentUser);
  const notifications = useSelector(selectNotifications);
  const notificationUsers = useSelector(selectNotificationUsers);
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser) {
      dispatch(
        getNotificationsStart({
          userId: currentUser.id,
          pageToShow: 1,
          limit: 10,
        })
      );
    }
  }, [dispatch, currentUser]);

  useEffect(() => {
    if (notifications?.length) {
      notifications.forEach((notification) => {
        if (!(notification.fromUserId in notificationUsers)) {
          dispatch(
            getOtherUserStart({
              type: OtherUserType.NOTIFICATION_USER,
              usernameOrId: notification.fromUserId,
            })
          );
        }
      });
    }
  }, [dispatch, notifications, notificationUsers]);

  return (
    <Grid sx={{ display: 'flex', flexDirection: 'column', width: 'inherit' }}>
      {notifications?.map((notification) => (
        <NotificationItem
          notification={notification}
          key={notification.id}
          user={notificationUsers[notification.fromUserId]}
        />
      ))}
    </Grid>
  );
};

export default NotificationsContainer;
