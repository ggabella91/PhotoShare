import {
  FollowerActions,
  FollowerActionTypes,
  FollowerState,
} from './follower.types';

const INITIAL_STATE: FollowerState = {
  followers: null,
  usersFollowing: null,
  followConfirm: null,
  followError: null,
  getFollowersConfirm: null,
  getFollowersError: null,
  getUsersFollowingConfirm: null,
  getUsersFollowingError: null,
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
    case FollowerActions.GET_USERS_FOLLOWING_SUCCESS:
      return {
        ...state,
        usersFollowing: action.payload,
        getUsersFollowingConfirm: 'Users following fetched successfully!',
        getUsersFollowingError: null,
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
    default:
      return state;
  }
};

export default followerReducer;
