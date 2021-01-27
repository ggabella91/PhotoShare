import {
  FollowerActions,
  FollowerActionTypes,
  FollowerState,
} from './follower.types';

const INITIAL_STATE: FollowerState = {
  followers: null,
  following: null,
  followConfirm: null,
  followError: null,
  getFollowersConfirm: null,
  getFollowersError: null,
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
    default:
      return state;
  }
};

export default followerReducer;
