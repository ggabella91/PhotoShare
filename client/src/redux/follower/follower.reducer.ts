import {
  FollowerActions,
  FollowerActionTypes,
  FollowerState,
  NotificationActions,
  NotificationActionTypes,
} from './follower.types';

const INITIAL_STATE: FollowerState = {
  followers: null,
  currentUserUsersFollowing: null,
  otherUserUsersFollowing: null,
  followConfirm: null,
  followError: null,
  getFollowersConfirm: null,
  getFollowersError: null,
  getUsersFollowingConfirm: null,
  getUsersFollowingError: null,
  unfollowConfirm: null,
  unfollowError: null,
  postNotificationConfirm: null,
  postNotificationError: null,
  isNotificationsDataLoading: false,
  notificationsQueryLength: 0,
  notifications: null,
  getNotificationsError: null,
  isFollowersModal: true,
};

const followerReducer = (
  state = INITIAL_STATE,
  action: FollowerActionTypes | NotificationActionTypes
): FollowerState => {
  switch (action.type) {
    case NotificationActions.GET_NOTIFICATIONS_START:
      return {
        ...state,
        isNotificationsDataLoading: true,
      };
    case FollowerActions.FOLLOW_NEW_USER_SUCCESS:
      return {
        ...state,
        followConfirm: 'New user followed!',
        followError: null,
      };
    case FollowerActions.GET_FOLLOWERS_SUCCESS:
      return {
        ...state,
        followers: action.payload,
        getFollowersConfirm: 'Followers fetched successfully!',
        getFollowersError: null,
      };
    case FollowerActions.GET_CURRENT_USER_USERS_FOLLOWING_SUCCESS:
      return {
        ...state,
        currentUserUsersFollowing: action.payload,
        getUsersFollowingConfirm:
          "Current user's users following fetched successfully!",
        getUsersFollowingError: null,
      };
    case FollowerActions.GET_OTHER_USER_USERS_FOLLOWING_SUCCESS:
      return {
        ...state,
        otherUserUsersFollowing: action.payload,
        getUsersFollowingConfirm:
          "Other user's users following fetched successfully!",
        getUsersFollowingError: null,
      };
    case FollowerActions.UNFOLLOW_USER_SUCCESS:
      return {
        ...state,
        unfollowConfirm: 'User unfollowed successfully',
        unfollowError: null,
      };
    case FollowerActions.SET_IS_FOLLOWERS_MODAL:
      return {
        ...state,
        isFollowersModal: action.payload,
      };
    case NotificationActions.POST_NOTIFICATION_SUCCESS:
      return {
        ...state,
        postNotificationConfirm: action.payload,
        postNotificationError: null,
      };
    case NotificationActions.GET_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        notifications: action.payload,
        getNotificationsError: null,
        isNotificationsDataLoading: false,
      };
    case NotificationActions.SET_NOTIFICATIONS_QUERY_LENGTH:
      return {
        ...state,
        notificationsQueryLength: action.payload,
      };
    case FollowerActions.FOLLOW_NEW_USER_FAILURE:
      return {
        ...state,
        followConfirm: null,
        followError: action.payload,
      };
    case FollowerActions.GET_FOLLOWERS_FAILURE:
      return {
        ...state,
        getFollowersConfirm: null,
        getFollowersError: action.payload,
      };
    case FollowerActions.GET_USERS_FOLLOWING_FAILURE:
      return {
        ...state,
        getUsersFollowingConfirm: null,
        getUsersFollowingError: action.payload,
      };
    case FollowerActions.UNFOLLOW_USER_FAILURE:
      return {
        ...state,
        unfollowConfirm: null,
        unfollowError: action.payload,
      };
    case NotificationActions.POST_NOTIFICATION_FAILURE:
      return {
        ...state,
        postNotificationConfirm: null,
        postNotificationError: action.payload,
      };
    case NotificationActions.GET_NOTIFICATIONS_FAILURE:
      return {
        ...state,
        notifications: null,
        getNotificationsError: action.payload,
        isNotificationsDataLoading: false,
      };
    case FollowerActions.CLEAR_FOLLOW_STATE:
      return {
        ...INITIAL_STATE,
      };
    default:
      return state;
  }
};

export default followerReducer;
