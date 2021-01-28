import {
  Follower,
  FollowError,
  FollowerActions,
  FollowerActionTypes,
} from './follower.types';

export const followNewUserStart = (
  userToFollow: string
): FollowerActionTypes => ({
  type: FollowerActions.FOLLOW_NEW_USER_START,
  payload: userToFollow,
});

export const followNewUserSuccess = (message: string): FollowerActionTypes => ({
  type: FollowerActions.FOLLOW_NEW_USER_SUCCESS,
  payload: message,
});

export const followNewUserFailure = (
  error: FollowError
): FollowerActionTypes => ({
  type: FollowerActions.FOLLOW_NEW_USER_FAILURE,
  payload: error,
});

export const getFollowersStart = (userId: string): FollowerActionTypes => ({
  type: FollowerActions.GET_FOLLOWERS_START,
  payload: userId,
});

export const getFollowersSuccess = (
  followers: Follower[]
): FollowerActionTypes => ({
  type: FollowerActions.GET_FOLLOWERS_SUCCESS,
  payload: followers,
});

export const getFollowersFailure = (
  error: FollowError
): FollowerActionTypes => ({
  type: FollowerActions.GET_FOLLOWERS_FAILURE,
  payload: error,
});
