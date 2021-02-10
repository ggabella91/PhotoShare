import {
  FollowerActions,
  FollowerActionTypes,
  FollowerState,
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
};

const followerReducer = (
  state = INITIAL_STATE,
  action: FollowerActionTypes
) => {
  switch (action.type) {
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
        unfollowConfirm: action.payload,
        unfollowError: null,
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
    case FollowerActions.CLEAR_UNFOLLOW_PROPERTIES:
      return {
        ...state,
        unfollowConfirm: null,
        unfollowError: null,
      };
    default:
      return state;
  }
};

export default followerReducer;
