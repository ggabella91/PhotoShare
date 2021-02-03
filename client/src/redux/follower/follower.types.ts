export enum FollowerActions {
  FOLLOW_NEW_USER_START = 'FOLLOW_NEW_USER_START',
  FOLLOW_NEW_USER_SUCCESS = 'FOLLOW_NEW_USER_SUCCESS',
  FOLLOW_NEW_USER_FAILURE = 'FOLLOW_NEW_USER_FAILURE',
  GET_FOLLOWERS_START = 'GET_FOLLOWERS_START',
  GET_FOLLOWERS_SUCCESS = 'GET_FOLLOWERS_SUCCESS',
  GET_FOLLOWERS_FAILURE = 'GET_FOLLOWERS_FAILURE',
  GET_USERS_FOLLOWING_START = 'GET_USERS_FOLLOWING_START',
  GET_CURRENT_USER_USERS_FOLLOWING_SUCCESS = 'GET_CURRENT_USER_USERS_FOLLOWING_SUCCESS',
  GET_OTHER_USER_USERS_FOLLOWING_SUCCESS = 'GET_OTHER_USER_USERS_FOLLOWING_SUCCESS',
  GET_USERS_FOLLOWING_FAILURE = 'GET_USERS_FOLLOWING_FAILURE',
}

export interface Follower {
  userId: string;
  followerId: string;
}

export interface FollowError {
  statusCode: number;
  message: string;
}

export enum WhoseUsersFollowing {
  CURRENT_USER = 'CURRENT_USER',
  OTHER_USER = 'OTHER_USER',
}

export interface UsersFollowingRequest {
  userId: string;
  whoseUsersFollowing: WhoseUsersFollowing;
}

export type FollowerPayload = Follower | FollowError | null;

export interface FollowerState {
  followers: Follower[] | null;
  currentUserUsersFollowing: Follower[] | null;
  otherUserUsersFollowing: Follower[] | null;
  followConfirm: string | null;
  followError: FollowError | null;
  getFollowersConfirm: string | null;
  getFollowersError: FollowError | null;
  getUsersFollowingConfirm: string | null;
  getUsersFollowingError: FollowError | null;
}

export interface FollowNewUserStart {
  type: typeof FollowerActions.FOLLOW_NEW_USER_START;
  payload: string;
}

export interface FollowNewUserSuccess {
  type: typeof FollowerActions.FOLLOW_NEW_USER_SUCCESS;
  payload: string;
}

export interface FollowNewUserFailure {
  type: typeof FollowerActions.FOLLOW_NEW_USER_FAILURE;
  payload: FollowError;
}

export interface GetFollowersStart {
  type: typeof FollowerActions.GET_FOLLOWERS_START;
  payload: string;
}

export interface GetFollowersSuccess {
  type: typeof FollowerActions.GET_FOLLOWERS_SUCCESS;
  payload: Follower[];
}

export interface GetFollowersFailure {
  type: typeof FollowerActions.GET_FOLLOWERS_FAILURE;
  payload: FollowError;
}

export interface GetUsersFollowingStart {
  type: typeof FollowerActions.GET_USERS_FOLLOWING_START;
  payload: UsersFollowingRequest;
}

export interface GetCurrentUserUsersFollowingSuccess {
  type: typeof FollowerActions.GET_CURRENT_USER_USERS_FOLLOWING_SUCCESS;
  payload: Follower[];
}

export interface GetOtherUserUsersFollowingSuccess {
  type: typeof FollowerActions.GET_OTHER_USER_USERS_FOLLOWING_SUCCESS;
  payload: Follower[];
}

export interface GetUsersFollowingFailure {
  type: typeof FollowerActions.GET_USERS_FOLLOWING_FAILURE;
  payload: FollowError;
}

export type FollowerActionTypes =
  | FollowNewUserStart
  | FollowNewUserSuccess
  | FollowNewUserFailure
  | GetFollowersStart
  | GetFollowersSuccess
  | GetFollowersFailure
  | GetUsersFollowingStart
  | GetCurrentUserUsersFollowingSuccess
  | GetOtherUserUsersFollowingSuccess
  | GetUsersFollowingFailure;
