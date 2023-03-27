import { takeLatest, takeEvery, put, all, call } from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';
import { ActionPattern, Saga } from '@redux-saga/types';

import {
  Follower,
  WhoseUsersFollowing,
  UsersFollowingRequest,
  FollowerActions,
  FollowError,
  NotificationActions,
  PostNotificationReq,
  NotificationError,
  Notification,
  GetNotificationsReq,
} from './follower.types';

import {
  followNewUserSuccess,
  followNewUserFailure,
  getFollowersSuccess,
  getFollowersFailure,
  getCurrentUserUsersFollowingSuccess,
  getOtherUserUsersFollowingSuccess,
  getUsersFollowingFailure,
  unfollowUserSuccess,
  unfollowUserFailure,
  postNotificationFailure,
  postNotificationSuccess,
  getNotificationsFailure,
  getNotificationsSuccess,
  setNotificationsQueryLength,
} from './follower.actions';

import axios from 'axios';

export function* followNewUser({
  payload: userToFollowId,
}: {
  payload: string;
}): any {
  try {
    const { data } = yield axios.post(
      `/api/followers/follow-new-user/${userToFollowId}`
    );

    yield put(followNewUserSuccess(data));
  } catch (err) {
    yield put(followNewUserFailure(err as FollowError));
  }
}

export function* getFollowers({
  payload: userToFollowId,
}: {
  payload: string;
}): any {
  try {
    const { data }: { data: Follower[] } = yield axios.get(
      `/api/followers/get-followers/${userToFollowId}`
    );

    yield put(getFollowersSuccess(data));
  } catch (err) {
    yield put(getFollowersFailure(err as FollowError));
  }
}

export function* getUsersFollowing({
  payload: { userId, whoseUsersFollowing },
}: {
  payload: UsersFollowingRequest;
}): any {
  try {
    const { data }: { data: Follower[] } = yield axios.get(
      `/api/followers/get-users-following/${userId}`
    );

    if (whoseUsersFollowing === WhoseUsersFollowing.CURRENT_USER) {
      yield put(getCurrentUserUsersFollowingSuccess(data));
    } else if (whoseUsersFollowing === WhoseUsersFollowing.OTHER_USER) {
      yield put(getOtherUserUsersFollowingSuccess(data));
    }
  } catch (err) {
    yield put(getUsersFollowingFailure(err as FollowError));
  }
}

export function* unfollowUser({ payload: userId }: { payload: string }): any {
  try {
    const { data } = yield axios.post(`/api/followers/unfollow-user/${userId}`);

    yield put(unfollowUserSuccess(data));
  } catch (err) {
    yield put(unfollowUserFailure(err as FollowError));
  }
}

export function* postNotification({
  payload: postNotificationReq,
}: {
  payload: PostNotificationReq;
}): any {
  try {
    const { data: notification }: { data: Notification } = yield axios.post(
      `/api/notifications/new`,
      postNotificationReq
    );

    yield put(postNotificationSuccess(notification));
  } catch (err) {
    yield put(postNotificationFailure(err as NotificationError));
  }
}

export function* getNotifications({
  payload: { userId, pageToShow, limit },
}: {
  payload: GetNotificationsReq;
}): any {
  try {
    const {
      data: { notifications, queryLength },
    }: { data: { notifications: Notification[]; queryLength: number | null } } =
      yield axios.get(
        `/api/notifications/${userId}?pageToShow=${pageToShow}&limit=${limit}`
      );

    if (queryLength) {
      yield all([
        put(getNotificationsSuccess(notifications)),
        put(setNotificationsQueryLength(queryLength)),
      ]);
    } else {
      yield put(getNotificationsSuccess(notifications));
    }
  } catch (err) {
    yield put(getNotificationsFailure(err as NotificationError));
  }
}

export function* onFollowNewUserStart(): SagaIterator {
  yield takeLatest<ActionPattern, Saga>(
    FollowerActions.FOLLOW_NEW_USER_START,
    followNewUser
  );
}

export function* onGetFollowersStart(): SagaIterator {
  yield takeLatest<ActionPattern, Saga>(
    FollowerActions.GET_FOLLOWERS_START,
    getFollowers
  );
}

export function* onGetUsersFollowingStart(): SagaIterator {
  yield takeEvery<ActionPattern, Saga>(
    FollowerActions.GET_USERS_FOLLOWING_START,
    getUsersFollowing
  );
}

export function* onUnfollowUserStart(): SagaIterator {
  yield takeLatest<ActionPattern, Saga>(
    FollowerActions.UNFOLLOW_USER_START,
    unfollowUser
  );
}

export function* onPostNotificationStart(): SagaIterator {
  yield takeLatest<ActionPattern, Saga>(
    NotificationActions.POST_NOTIFICATION_START,
    postNotification
  );
}

export function* onGetNotificationsStart(): SagaIterator {
  yield takeLatest<ActionPattern, Saga>(
    NotificationActions.GET_NOTIFICATIONS_START,
    getNotifications
  );
}

export function* followerSagas(): SagaIterator {
  yield all([
    call(onFollowNewUserStart),
    call(onGetFollowersStart),
    call(onGetUsersFollowingStart),
    call(onUnfollowUserStart),
    call(onPostNotificationStart),
    call(onGetNotificationsStart),
  ]);
}
