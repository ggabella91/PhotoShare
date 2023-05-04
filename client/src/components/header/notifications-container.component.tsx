import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Typography } from '@mui/material';
import NotificationItem from './notification-item.component';

import { OtherUserType } from '../../redux/user/user.types';
import {
  selectCurrentUser,
  selectNotificationUsers,
} from '../../redux/user/user.selectors';
import { getOtherUserStart } from '../../redux/user/user.actions';

import { Notification } from '../../redux/follower/follower.types';
import {
  selectIsNotificationsDataLoading,
  selectNotifications,
  selectNotificationsQueryLength,
} from '../../redux/follower/follower.selectors';
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
import { useLazyLoading } from '../../hooks';

const NotificationsContainer: React.FC = () => {
  const [readyToRender, setReadyToRender] = useState(false);
  const [usersReady, setUsersReady] = useState(false);
  const [postFilesReady, setPostFilesReady] = useState(false);
  const [readyToFetchPhotos, setReadyToFetchPhotos] = useState(false);
  const currentUser = useSelector(selectCurrentUser);
  const notifications = useSelector(selectNotifications);
  const notificationUsers = useSelector(selectNotificationUsers);
  const notificationUserMap = useSelector(selectNotificationUserMap);
  const notificationPostData = useSelector(selectNotificationPostData);
  const notificationPostFiles = useSelector(selectNotificationPostFiles);
  const isNotificationsDataLoading = useSelector(
    selectIsNotificationsDataLoading
  );
  const notificationsQueryLength = useSelector(selectNotificationsQueryLength);
  const postDataFetchCount = useRef<Record<string, boolean>>({});
  const pageToFetch = useRef<number>(1);
  const dispatch = useDispatch();

  const { intersectionCounter, observedElementRef } = useLazyLoading(
    isNotificationsDataLoading,
    true,
    1000
  );

  let postsBucket: string;
  let profileBucket: string;

  if (process.env.NODE_ENV === 'production') {
    postsBucket = 'photo-share-app';
    profileBucket = 'photo-share-app-profile-photos';
  } else {
    postsBucket = 'photo-share-app-dev';
    profileBucket = 'photo-share-app-profile-photos-dev';
  }

  useEffect(() => {
    if (currentUser && !notifications) {
      dispatch(
        getNotificationsStart({
          userId: currentUser.id,
          pageToShow: 1,
          limit: 10,
        })
      );
    }
  }, [dispatch, currentUser, notifications]);

  useEffect(() => {
    const shouldFetchMoreNotifications = () =>
      notifications?.length &&
      notificationsQueryLength &&
      intersectionCounter !== pageToFetch.current &&
      notifications.length < notificationsQueryLength &&
      pageToFetch.current + 1 <= Math.ceil(notificationsQueryLength / 10);

    if (currentUser && shouldFetchMoreNotifications()) {
      dispatch(
        getNotificationsStart({
          userId: currentUser.id,
          limit: 10,
          pageToShow: ++pageToFetch.current,
        })
      );
    }
  }, [
    dispatch,
    currentUser,
    intersectionCounter,
    notifications,
    notificationsQueryLength,
  ]);

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

        if (
          postId &&
          !(postId in postDataFetchCount.current) &&
          !notificationPostData.hasOwnProperty(postId)
        ) {
          postDataFetchCount.current[postId] = true;
          dispatch(getSinglePostDataStart({ postId, notificationPost: true }));
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (
      Object.values(notificationPostData).length ===
        Object.values(postDataFetchCount.current).length &&
      Object.values(notificationPostData).length !==
        Object.values(notificationPostFiles).length
    ) {
      Object.values(notificationPostData).forEach((post) => {
        dispatch(
          getPostFileStart({
            s3Key: post.s3Key,
            bucket: postsBucket,
            user: UserType.notificationUser,
            fileRequestType: FileRequestType.notificationPost,
            isVideo: !!post.isVideo,
            ...(post.videoThumbnailS3Key && {
              videoThumbnailS3Key: post.videoThumbnailS3Key,
            }),
          })
        );
      });
    }
  }, [dispatch, postsBucket, notificationPostData, notificationPostFiles.size]);

  useEffect(() => {
    if (readyToFetchPhotos) {
      Object.values(notificationUsers).forEach((user) => {
        if (user.photo && !notificationUserMap.get(user.photo)) {
          dispatch(
            getPostFileStart({
              fileRequestType: FileRequestType.singlePost,
              bucket: profileBucket,
              s3Key: user.photo,
              user: UserType.notificationUser,
            })
          );
        }
      });

      setUsersReady(true);
    }
  }, [
    dispatch,
    profileBucket,
    readyToFetchPhotos,
    notificationUsers,
    notificationUserMap,
  ]);

  useEffect(() => {
    if (
      Object.values(notificationPostFiles).length ===
      Object.values(postDataFetchCount.current).length
    ) {
      setPostFilesReady(true);
    }
  }, [notificationPostFiles]);

  useEffect(() => {
    if (usersReady && postFilesReady) {
      setReadyToRender(true);
    }
  }, [usersReady, postFilesReady]);

  return (
    <Grid sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {readyToRender &&
        notifications?.map((notification, idx) => {
          const user = notificationUsers?.[notification.fromUserId];
          const userPhotoInfo =
            (!!user.photo?.length && notificationUserMap.get(user.photo)) ||
            null;
          const postPhotoS3Key =
            notification.postId &&
            notificationPostData?.[notification.postId].s3Key;
          const postPhotoInfo =
            postPhotoS3Key && notificationPostFiles[postPhotoS3Key];

          return (
            <NotificationItem
              notification={notification}
              key={notification.id}
              user={user}
              userPhotoInfo={userPhotoInfo}
              postPhotoInfo={postPhotoInfo || null}
              custRef={
                idx === notifications.length - 1 ? observedElementRef : null
              }
            />
          );
        })}
      {!notifications?.length && (
        <Grid sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
          <Typography>No notifications</Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default NotificationsContainer;
