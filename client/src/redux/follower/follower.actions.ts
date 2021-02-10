import {
  Follower,
  FollowError,
  UsersFollowingRequest,
  FollowerActions,
  FollowerActionTypes,
} from './follower.types';

export const followNewUserStart = (
  userToFollowId: string
): FollowerActionTypes => ({
  type: FollowerActions.FOLLOW_NEW_USER_START,
  payload: userToFollowId,
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

export const getUsersFollowingStart = ({
  userId,
  whoseUsersFollowing,
}: UsersFollowingRequest): FollowerActionTypes => ({
  type: FollowerActions.GET_USERS_FOLLOWING_START,
  payload: {
    userId,
    whoseUsersFollowing,
  },
});

export const getCurrentUserUsersFollowingSuccess = (
  usersFollowing: Follower[]
): FollowerActionTypes => ({
  type: FollowerActions.GET_CURRENT_USER_USERS_FOLLOWING_SUCCESS,
  payload: usersFollowing,
});

export const getOtherUserUsersFollowingSuccess = (
  usersFollowing: Follower[]
): FollowerActionTypes => ({
  type: FollowerActions.GET_OTHER_USER_USERS_FOLLOWING_SUCCESS,
  payload: usersFollowing,
});

export const getUsersFollowingFailure = (
  error: FollowError
): FollowerActionTypes => ({
  type: FollowerActions.GET_USERS_FOLLOWING_FAILURE,
  payload: error,
});

export const unfollowUserStart = (userId: string): FollowerActionTypes => ({
  type: FollowerActions.UNFOLLOW_USER_START,
  payload: userId,
});

export const unfollowUserSuccess = (message: string): FollowerActionTypes => ({
  type: FollowerActions.UNFOLLOW_USER_SUCCESS,
  payload: message,
});

export const unfollowUserFailure = (
  error: FollowError
): FollowerActionTypes => ({
  type: FollowerActions.UNFOLLOW_USER_FAILURE,
  payload: error,
});

export const clearUnfollowProperties = (): FollowerActionTypes => ({
  type: FollowerActions.CLEAR_UNFOLLOW_PROPERTIES,
  payload: null,
});
