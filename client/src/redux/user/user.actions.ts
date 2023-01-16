import {
  UserActions,
  UserActionTypes,
  UserSignUp,
  UserSignIn,
  User,
  FieldsToUpdate,
  OtherUserRequest,
  ChangePassword,
  ResetPassword,
  Error,
} from './user.types';

export const signUpStart = ({
  username,
  name,
  email,
  password,
  passwordConfirm,
}: UserSignUp): UserActionTypes => ({
  type: UserActions.SIGN_UP_START,
  payload: { username, name, email, password, passwordConfirm },
});

export const signUpSuccess = (user: User): UserActionTypes => ({
  type: UserActions.SIGN_UP_SUCCESS,
  payload: user,
});

export const signUpFailure = (error: Error): UserActionTypes => ({
  type: UserActions.SIGN_UP_FAILURE,
  payload: error,
});

export const checkUserSession = (): UserActionTypes => ({
  type: UserActions.CHECK_USER_SESSION,
  payload: null,
});

export const setCurrentUser = (user: User | null): UserActionTypes => ({
  type: UserActions.SET_CURRENT_USER,
  payload: user,
});

export const signInStart = ({
  email,
  password,
}: UserSignIn): UserActionTypes => ({
  type: UserActions.SIGN_IN_START,
  payload: {
    email,
    password,
  },
});

export const signInSuccess = (user: User): UserActionTypes => ({
  type: UserActions.SIGN_IN_SUCCESS,
  payload: user,
});

export const signInFailure = (error: Error): UserActionTypes => ({
  type: UserActions.SIGN_IN_FAILURE,
  payload: error,
});

export const signOutStart = (): UserActionTypes => ({
  type: UserActions.SIGN_OUT_START,
  payload: null,
});

export const signOutSuccess = (): UserActionTypes => ({
  type: UserActions.SIGN_OUT_SUCCESS,
  payload: null,
});

export const signOutFailure = (error: Error): UserActionTypes => ({
  type: UserActions.SIGN_OUT_FAILURE,
  payload: error,
});

export const changeInfoStart = (
  fieldsToUpdate: FieldsToUpdate
): UserActionTypes => ({
  type: UserActions.CHANGE_INFO_START,
  payload: fieldsToUpdate,
});

export const changeInfoSuccess = (user: User): UserActionTypes => ({
  type: UserActions.CHANGE_INFO_SUCCESS,
  payload: user,
});

export const changeInfoFailure = (error: Error): UserActionTypes => ({
  type: UserActions.CHANGE_INFO_FAILURE,
  payload: error,
});

export const changePasswordStart = ({
  passwordCurrent,
  password,
  passwordConfirm,
}: ChangePassword): UserActionTypes => ({
  type: UserActions.CHANGE_PASSWORD_START,
  payload: { passwordCurrent, password, passwordConfirm },
});

export const changePasswordSuccess = (message: string): UserActionTypes => ({
  type: UserActions.CHANGE_PASSWORD_SUCCESS,
  payload: message,
});

export const changePasswordFailure = (error: Error): UserActionTypes => ({
  type: UserActions.CHANGE_PASSWORD_FAILURE,
  payload: error,
});

export const forgotPasswordStart = (email: string): UserActionTypes => ({
  type: UserActions.FORGOT_PASSWORD_START,
  payload: email,
});

export const forgotPasswordSuccess = (message: string): UserActionTypes => ({
  type: UserActions.FORGOT_PASSWORD_SUCCESS,
  payload: message,
});

export const forgotPasswordFailure = (error: Error): UserActionTypes => ({
  type: UserActions.FORGOT_PASSWORD_FAILURE,
  payload: error,
});

export const resetPasswordStart = ({
  password,
  passwordConfirm,
  token,
}: ResetPassword): UserActionTypes => ({
  type: UserActions.RESET_PASSWORD_START,
  payload: { password, passwordConfirm, token },
});

export const resetPasswordSuccess = (message: string): UserActionTypes => ({
  type: UserActions.RESET_PASSWORD_SUCCESS,
  payload: message,
});

export const resetPasswordFailure = (error: Error): UserActionTypes => ({
  type: UserActions.RESET_PASSWORD_FAILURE,
  payload: error,
});

export const deleteAccountStart = (): UserActionTypes => ({
  type: UserActions.DELETE_ACCOUNT_START,
  payload: null,
});

export const deleteAccountSuccess = (message: string): UserActionTypes => ({
  type: UserActions.DELETE_ACCOUNT_SUCCESS,
  payload: message,
});

export const deleteAccountFailure = (error: Error): UserActionTypes => ({
  type: UserActions.DELETE_ACCOUNT_FAILURE,
  payload: error,
});

export const clearInfoStatuses = (): UserActionTypes => ({
  type: UserActions.CLEAR_INFO_STATUSES,
  payload: null,
});

export const clearPasswordStatuses = (): UserActionTypes => ({
  type: UserActions.CLEAR_PASSWORD_STATUSES,
  payload: null,
});

export const getOtherUserStart = (
  otherUserReq: OtherUserRequest
): UserActionTypes => ({
  type: UserActions.GET_OTHER_USER_START,
  payload: otherUserReq,
});

export const getOtherUserSuccess = (user: User): UserActionTypes => ({
  type: UserActions.GET_OTHER_USER_SUCCESS,
  payload: user,
});

export const getFollowersSuccess = (user: User): UserActionTypes => ({
  type: UserActions.GET_FOLLOWERS_INFO_SUCCESS,
  payload: user,
});

export const getFollowingSuccess = (user: User): UserActionTypes => ({
  type: UserActions.GET_FOLLOWING_INFO_SUCCESS,
  payload: user,
});

export const getPostReactorsSuccess = (user: User): UserActionTypes => ({
  type: UserActions.GET_POST_REACTOR_SUCCESS,
  payload: user,
});

export const getOtherUserFailure = (error: Error): UserActionTypes => ({
  type: UserActions.GET_OTHER_USER_FAILURE,
  payload: error,
});

export const getUserSuggestionsStart = (match: string): UserActionTypes => ({
  type: UserActions.GET_USER_SUGGESTIONS_START,
  payload: match,
});

export const getUserSuggestionsSuccess = (users: User[]): UserActionTypes => ({
  type: UserActions.GET_USER_SUGGESTIONS_SUCCESS,
  payload: users,
});

export const getUserSuggestionsFailure = (error: Error): UserActionTypes => ({
  type: UserActions.GET_USER_SUGGESTIONS_FAILURE,
  payload: error,
});

export const clearUserSuggestions = (): UserActionTypes => ({
  type: UserActions.CLEAR_USER_SUGGESTIONS,
  payload: null,
});

export const clearFollowersAndFollowing = (): UserActionTypes => ({
  type: UserActions.CLEAR_FOLLOWERS_AND_FOLLOWING,
  payload: null,
});

export const setIsCurrentUserProfilePage = (
  isCurrentUserProfilePage: boolean
): UserActionTypes => ({
  type: UserActions.SET_IS_CURRENT_USER_PROFILE_PAGE,
  payload: isCurrentUserProfilePage,
});

export const getFeedPostReactorsSuccess = (user: User): UserActionTypes => ({
  type: UserActions.GET_FEED_POST_REACTOR_SUCCESS,
  payload: user,
});

export const getConversationUserSuccess = (user: User): UserActionTypes => ({
  type: UserActions.GET_CONVERSATION_USER_SUCCESS,
  payload: user,
});

export const getNotificationUserSuccess = (user: User): UserActionTypes => ({
  type: UserActions.GET_NOTIFICATION_USER_SUCCESS,
  payload: user,
});

export const clearConversationUsers = (): UserActionTypes => ({
  type: UserActions.CLEAR_CONVERSATION_USERS,
});
