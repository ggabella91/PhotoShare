import { UserActions, UserActionTypes, UserState } from './user.types';
import { addUserToUsersArray } from './user.utils';

const INITIAL_STATE: UserState = {
  currentUser: null,
  isCurrentUserProfilePage: true,
  otherUser: null,
  followersInfo: null,
  followingInfo: null,
  otherUserError: null,
  userSuggestions: null,
  userSuggestionsConfirm: null,
  userSuggestionsError: null,
  postReactingUsers: null,
  signUpError: null,
  signInOrOutError: null,
  changeInfoConfirm: null,
  changeInfoError: null,
  changePasswordConfirm: null,
  changePasswordError: null,
  forgotConfirm: null,
  forgotError: null,
  resetConfirm: null,
  resetError: null,
  deleteAccountError: null,
  feedPostReactingUsers: null,
  conversationUsers: null,
  notificationUsers: {},
};

const userReducer = (
  state = INITIAL_STATE,
  action: UserActionTypes
): UserState => {
  switch (action.type) {
    case UserActions.SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload,
        signInOrOutError: null,
        signUpError: null,
      };
    case UserActions.GET_OTHER_USER_SUCCESS:
      return {
        ...state,
        otherUser: action.payload,
        otherUserError: null,
      };
    case UserActions.GET_FOLLOWERS_INFO_SUCCESS:
      return {
        ...state,
        followersInfo: addUserToUsersArray(state.followersInfo, action.payload),
        otherUserError: null,
      };
    case UserActions.GET_FOLLOWING_INFO_SUCCESS:
      return {
        ...state,
        followingInfo: addUserToUsersArray(state.followingInfo, action.payload),
        otherUserError: null,
      };
    case UserActions.GET_USER_SUGGESTIONS_SUCCESS:
      return {
        ...state,
        userSuggestions: action.payload,
        userSuggestionsConfirm: 'User suggestions fetched!',
        userSuggestionsError: null,
      };
    case UserActions.GET_POST_REACTOR_SUCCESS:
      return {
        ...state,
        postReactingUsers: addUserToUsersArray(
          state.postReactingUsers,
          action.payload
        ),
        otherUserError: null,
      };
    case UserActions.GET_FEED_POST_REACTOR_SUCCESS:
      return {
        ...state,
        feedPostReactingUsers: addUserToUsersArray(
          state.feedPostReactingUsers,
          action.payload
        ),
        otherUserError: null,
      };
    case UserActions.GET_CONVERSATION_USER_SUCCESS:
      return {
        ...state,
        conversationUsers: addUserToUsersArray(
          state.conversationUsers,
          action.payload
        ),
        otherUserError: null,
      };
    case UserActions.GET_NOTIFICATION_USER_SUCCESS:
      return {
        ...state,
        notificationUsers: {
          ...state.notificationUsers,
          [action.payload.id]: action.payload,
        },
      };
    case UserActions.SIGN_UP_SUCCESS:
      return {
        ...state,
        currentUser: action.payload,
        signUpError: null,
      };
    case UserActions.SIGN_IN_SUCCESS:
      return {
        ...state,
        currentUser: action.payload,
        signInOrOutError: null,
      };
    case UserActions.SIGN_OUT_SUCCESS:
      return {
        ...INITIAL_STATE,
      };
    case UserActions.CHANGE_INFO_SUCCESS:
      return {
        ...state,
        changeInfoConfirm: 'Info changed succesfully!',
        changeInfoError: null,
      };
    case UserActions.CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        changePasswordConfirm: 'Password changed successfully!',
        changePasswordError: null,
      };
    case UserActions.FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        forgotConfirm: action.payload,
        forgotError: null,
      };
    case UserActions.RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        resetConfirm: action.payload,
        resetError: null,
      };
    case UserActions.DELETE_ACCOUNT_SUCCESS:
      return {
        ...state,
        currentUser: null,
        deleteAccountError: null,
      };
    case UserActions.SIGN_UP_FAILURE:
      return {
        ...state,
        signUpError: action.payload,
      };
    case UserActions.SIGN_IN_FAILURE:
    case UserActions.SIGN_OUT_FAILURE:
      return {
        ...state,
        signInOrOutError: action.payload,
      };
    case UserActions.GET_OTHER_USER_FAILURE:
      return {
        ...state,
        otherUser: null,
        otherUserError: action.payload,
      };
    case UserActions.CHANGE_INFO_FAILURE:
      return {
        ...state,
        changeInfoConfirm: null,
        changeInfoError: action.payload,
      };
    case UserActions.CHANGE_PASSWORD_FAILURE:
      return {
        ...state,
        changePasswordConfirm: null,
        changePasswordError: action.payload,
      };
    case UserActions.FORGOT_PASSWORD_FAILURE:
      return {
        ...state,
        forgotConfirm: null,
        forgotError: action.payload,
      };
    case UserActions.RESET_PASSWORD_FAILURE:
      return {
        ...state,
        resetConfirm: null,
        resetError: action.payload,
      };
    case UserActions.DELETE_ACCOUNT_FAILURE:
      return {
        ...state,
        deleteAccountError: action.payload,
      };
    case UserActions.GET_USER_SUGGESTIONS_FAILURE:
      return {
        ...state,
        userSuggestions: null,
        userSuggestionsConfirm: null,
        userSuggestionsError: action.payload,
      };
    case UserActions.CLEAR_INFO_STATUSES:
      return {
        ...state,
        changeInfoError: null,
        changeInfoConfirm: null,
      };
    case UserActions.CLEAR_PASSWORD_STATUSES:
      return {
        ...state,
        changePasswordError: null,
        changePasswordConfirm: null,
      };
    case UserActions.CLEAR_USER_SUGGESTIONS:
      return {
        ...state,
        userSuggestions: null,
        userSuggestionsConfirm: null,
        userSuggestionsError: null,
      };
    case UserActions.CLEAR_CONVERSATION_USERS:
      return {
        ...state,
        conversationUsers: null,
      };
    case UserActions.CLEAR_FOLLOWERS_AND_FOLLOWING:
      return {
        ...state,
        followersInfo: null,
        followingInfo: null,
        otherUserError: null,
      };
    case UserActions.SET_IS_CURRENT_USER_PROFILE_PAGE:
      return {
        ...state,
        isCurrentUserProfilePage: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
