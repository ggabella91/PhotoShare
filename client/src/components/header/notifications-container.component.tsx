import React, { useState, useEffect } from 'react';
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
import { Notification } from '../../redux/follower/follower.types';

const NotificationsContainer: React.FC = () => {
  const [readyToRender, setReadyToRender] = useState(false);
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
      notifications.forEach(({ fromUserId }) => {
        if (!(notificationUsers && fromUserId in notificationUsers)) {
          dispatch(
            getOtherUserStart({
              type: OtherUserType.NOTIFICATION_USER,
              usernameOrId: fromUserId,
            })
          );
        }
      });
    }
  }, [dispatch, notifications, notificationUsers]);

  console.log('notificationUsers: ', notificationUsers);

  useEffect(() => {
    if (notificationUsers) {
      const ready = notifications?.every(
        (notification: Notification) =>
          notificationUsers?.[notification.fromUserId]
      );

      setReadyToRender(ready || false);
    }
  }, [notifications, notificationUsers]);

  return (
    <Grid sx={{ display: 'flex', flexDirection: 'column', width: 'inherit' }}>
      {readyToRender &&
        notifications?.map((notification) => (
          <NotificationItem
            notification={notification}
            key={notification.id}
            user={
              (notificationUsers?.[notification.fromUserId] &&
                notificationUsers[notification.fromUserId]) ||
              null
            }
          />
        ))}
    </Grid>
  );
};

export default NotificationsContainer;
