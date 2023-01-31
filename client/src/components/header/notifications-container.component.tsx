import React, { useState, useEffect, useRef } from 'react';
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

import {
  selectNotificationUserMap,
  selectNotificationPostData,
  selectNotificationPostFiles,
} from '../../redux/post/post.selectors';
import {
  getSinglePostDataStart,
  getPostFileStart,
} from '../../redux/post/post.actions';
import { FileRequestType, UserType } from '../../redux/post/post.types';

// TODO Add logic to fetch post data and post files for notifications
// associated with posts

const NotificationsContainer: React.FC = () => {
  const [readyToRender, setReadyToRender] = useState(false);
  const [readyToFetchPhotos, setReadyToFetchPhotos] = useState(false);
  const currentUser = useSelector(selectCurrentUser);
  const notifications = useSelector(selectNotifications);
  const notificationUsers = useSelector(selectNotificationUsers);
  const notificationUserMap = useSelector(selectNotificationUserMap);
  const notificationPostData = useSelector(selectNotificationPostData);
  const postDataFetchCount = useRef(0);
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
      notifications.forEach(({ fromUserId, postId }) => {
        if (!(notificationUsers && fromUserId in notificationUsers)) {
          dispatch(
            getOtherUserStart({
              type: OtherUserType.NOTIFICATION_USER,
              usernameOrId: fromUserId,
            })
          );
        }

        if (postId) {
          postDataFetchCount.current++;
          dispatch(getSinglePostDataStart({ postId, notificationPost: true }));
        }
      });
    }
  }, [dispatch, notifications, notificationUsers]);

  useEffect(() => {
    if (!!notificationUsers) {
      const ready = notifications?.every(
        (notification: Notification) =>
          notificationUsers?.[notification.fromUserId]
      );

      setReadyToFetchPhotos(ready || false);
    }
  }, [notifications, notificationUsers]);

  useEffect(() => {
    if (notificationPostData.size === postDataFetchCount.current) {
      notificationPostData.toList().forEach((post) => {
        dispatch(
          getPostFileStart({
            s3Key: post.s3Key,
            bucket,
            user: UserType.notificationUser,
            fileRequestType: FileRequestType.notificationPost,
          })
        );
      });
    }
  }, [dispatch, bucket, notificationPostData]);

  // TODO Check that all post files are fetched and that the
  // notifications are ready to render (update conditions that
  // determine whether readyToRender should be set to true)

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
