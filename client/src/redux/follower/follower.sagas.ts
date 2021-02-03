import { takeLatest, put, all, call } from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';
import { ActionPattern, Saga } from '@redux-saga/types';

import {
  Follower,
  FollowError,
  WhoseUsersFollowing,
  UsersFollowingRequest,
  FollowerActions,
  FollowerActionTypes,
} from './follower.types';

import {
  followNewUserSuccess,
  followNewUserFailure,
  getFollowersSuccess,
  getFollowersFailure,
  getUsersFollowingStart,
  getCurrentUserUsersFollowingSuccess,
  getOtherUserUsersFollowingSuccess,
  getUsersFollowingFailure,
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
    yield put(followNewUserFailure(err));
  }
}

export function* getFollowers({
  payload: userToFollowId,
}: {
  payload: string;
}): any {
  try {
    const { data } = yield axios.get(
      `/api/followers/get-followers/${userToFollowId}`
    );

    yield put(getFollowersSuccess(data));
  } catch (err) {
    yield put(getFollowersFailure(err));
  }
}

export function* getUsersFollowing({
  payload: { userId, whoseUsersFollowing },
}: {
  payload: UsersFollowingRequest;
}): any {
  try {
    const { data } = yield axios.get(
      `/api/followers/get-users-following/${userId}`
    );

    if (whoseUsersFollowing === WhoseUsersFollowing.CURRENT_USER) {
      yield put(getCurrentUserUsersFollowingSuccess(data));
    } else if (whoseUsersFollowing === WhoseUsersFollowing.OTHER_USER) {
      yield put(getOtherUserUsersFollowingSuccess(data));
    }
  } catch (err) {
    yield put(getUsersFollowingFailure(err));
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
  yield takeLatest<ActionPattern, Saga>(
    FollowerActions.GET_USERS_FOLLOWING_START,
    getUsersFollowing
  );
}

export function* followerSagas(): SagaIterator {
  yield all([
    call(onFollowNewUserStart),
    call(onGetFollowersStart),
    call(onGetUsersFollowingStart),
  ]);
}
