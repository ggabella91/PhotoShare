import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid } from '@mui/material';
import NotificationItem from './notification-item.component';

import { OtherUserType } from '../../redux/user/user.types';
import {
  selectCurrentUser,
  selectNotificationUsers,
} from '../../redux/user/user.selectors';
import { getOtherUserStart } from '../../redux/user/user.actions';

import { Notification } from '../../redux/follower/follower.types';
import { selectNotifications } from '../../redux/follower/follower.selectors';
import { getNotificationsStart } from '../../redux/follower/follower.actions';

import { selectNotificationUserMap } from '../../redux/post/post.selectors';
import { getPostFileStart } from '../../redux/post/post.actions';
import { FileRequestType, UserType } from '../../redux/post/post.types';

const NotificationsContainer: React.FC = () => {
  const [readyToRender, setReadyToRender] = useState(false);
  const [readyToFetchPhotos, setReadyToFetchPhotos] = useState(false);
  const currentUser = useSelector(selectCurrentUser);
  const notifications = useSelector(selectNotifications);
  const notificationUsers = useSelector(selectNotificationUsers);
  const notificationUserMap = useSelector(selectNotificationUserMap);
  const dispatch = useDispatch();

  let bucket: string;

  if (process.env.NODE_ENV === 'production') {
    bucket = 'photo-share-app-profile-photos';
  } else {
    bucket = 'photo-share-app-profile-photos-dev';
  }

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

  useEffect(() => {
    if (notificationUsers) {
      const ready = notifications?.every(
        (notification: Notification) =>
          notificationUsers?.[notification.fromUserId]
      );

      setReadyToFetchPhotos(ready || false);
    }
  }, [notifications, notificationUsers]);

  useEffect(() => {
    if (readyToFetchPhotos) {
      Object.values(notificationUsers).forEach((user) => {
        if (user.photo && !notificationUserMap.get(user.photo)) {
          dispatch(
            getPostFileStart({
              fileRequestType: FileRequestType.singlePost,
              bucket,
              s3Key: user.photo,
              user: UserType.notificationUser,
            })
          );
        }
      });

      setReadyToRender(true);
    }
  }, [
    dispatch,
    bucket,
    readyToFetchPhotos,
    notificationUsers,
    notificationUserMap,
  ]);

  return (
    <Grid sx={{ display: 'flex', flexDirection: 'column', width: 'inherit' }}>
      {readyToRender &&
        notifications?.map((notification) => {
          const user = notificationUsers?.[notification.fromUserId];
          const photoInfo =
            (!!user.photo?.length && notificationUserMap.get(user.photo)) ||
            null;

          return (
            <NotificationItem
              notification={notification}
              key={notification.id}
              user={user}
              photoInfo={photoInfo}
            />
          );
        })}
    </Grid>
  );
};

export default NotificationsContainer;
