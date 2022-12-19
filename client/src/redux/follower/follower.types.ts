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
  UNFOLLOW_USER_START = 'UNFOLLOW_USER_START',
  UNFOLLOW_USER_SUCCESS = 'UNFOLLOW_USER_SUCCESS',
  UNFOLLOW_USER_FAILURE = 'UNFOLLOW_USER_FAILURE',
  CLEAR_FOLLOW_STATE = 'CLEAR_FOLLOW_STATE',
}

export enum NotificationActions {
  POST_NOTIFICATION_START = 'POST_NOTIFICATION_START',
  POST_NOTIFICATION_SUCCESS = 'POST_NOTIFICATION_SUCCESS',
  POST_NOTIFICATION_FAILURE = 'POST_NOTIFICATION_FAILURE',
  GET_NOTIFICATIONS_START = 'GET_NOTIFICATIONS_START',
  GET_NOTIFICATIONS_SUCCESS = 'GET_NOTIFICATIONS_SUCCESS',
  GET_NOTIFICATIONS_FAILURE = 'GET_NOTIFICATIONS_FAILURE',
}

export interface Follower {
  userId: string;
  followerId: string;
}

export interface FollowError {
  statusCode: number;
  message: string;
}

export interface NotificationError {
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
  unfollowConfirm: string | null;
  unfollowError: FollowError | null;
  postNotificationConfirm: Notification | null;
  postNotificationFailure: NotificationError | null;
  notifications: Notification[] | null;
  getNotificationsError: NotificationError | null;
}

export interface PostNotificationReq {
  fromUserId: string;
  toUserId: string;
  message: string;
}

export interface Notification {
  id: string;
  fromUserId: string;
  toUserId: string;
  message: string;
  createdAt: Date;
}

export interface GetNotificationsReq {
  userId: string;
  pageToShow: string;
  limit: string;
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

export interface UnfollowUserStart {
  type: typeof FollowerActions.UNFOLLOW_USER_START;
  payload: string;
}

export interface UnfollowUserSuccess {
  type: typeof FollowerActions.UNFOLLOW_USER_SUCCESS;
  payload: string;
}

export interface UnfollowUserFailure {
  type: typeof FollowerActions.UNFOLLOW_USER_FAILURE;
  payload: FollowError;
}

export interface ClearFollowState {
  type: typeof FollowerActions.CLEAR_FOLLOW_STATE;
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
  | GetUsersFollowingFailure
  | UnfollowUserStart
  | UnfollowUserSuccess
  | UnfollowUserFailure
  | ClearFollowState;

export interface PostNotificationStart {
  type: typeof NotificationActions.POST_NOTIFICATION_START;
  payload: PostNotificationReq;
}

export interface PostNotificationSuccess {
  type: typeof NotificationActions.POST_NOTIFICATION_SUCCESS;
  payload: Notification;
}

export interface PostNotificationFailure {
  type: typeof NotificationActions.POST_NOTIFICATION_FAILURE;
  payload: NotificationError;
}

export interface GetNotificationsStart {
  type: typeof NotificationActions.GET_NOTIFICATIONS_START;
  payload: GetNotificationsReq;
}

export interface GetNotificationsSuccess {
  type: typeof NotificationActions.GET_NOTIFICATIONS_SUCCESS;
  payload: Notification[];
}

export interface GetNotificationsFailure {
  type: typeof NotificationActions.GET_NOTIFICATIONS_FAILURE;
  payload: NotificationError;
}

export type NotificationActionTypes =
  | PostNotificationStart
  | PostNotificationSuccess
  | PostNotificationFailure
  | GetNotificationsStart
  | GetNotificationsSuccess
  | GetNotificationsFailure;
