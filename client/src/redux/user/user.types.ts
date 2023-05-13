export enum UserActions {
  CHECK_USER_SESSION = 'CHECK_USER_SESSION',
  SET_CURRENT_USER = 'SET_CURRENT_USER',
  SIGN_UP_START = 'SIGN_UP_START',
  SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS',
  SIGN_UP_FAILURE = 'SIGN_UP_FAILURE',
  SIGN_IN_START = 'SIGN_IN_START',
  SIGN_IN_SUCCESS = 'SIGN_IN_SUCCESS',
  SIGN_IN_FAILURE = 'SIGN_IN_FAILURE',
  SIGN_OUT_START = 'SIGN_OUT_START',
  SIGN_OUT_SUCCESS = 'SIGN_OUT_SUCCESS',
  SIGN_OUT_FAILURE = 'SIGN_OUT_FAILURE',
  CHANGE_INFO_START = 'CHANGE_INFO_START',
  CHANGE_INFO_SUCCESS = 'CHANGE_INFO_SUCCESS',
  CHANGE_INFO_FAILURE = 'CHANGE_INFO_FAILURE',
  CHANGE_PASSWORD_START = 'CHANGE_PASSWORD_START',
  CHANGE_PASSWORD_SUCCESS = 'CHANGE_PASSWORD_SUCCESS',
  CHANGE_PASSWORD_FAILURE = 'CHANGE_PASSWORD_FAILURE',
  FORGOT_PASSWORD_START = 'FORGOT_PASSWORD_START',
  FORGOT_PASSWORD_SUCCESS = 'FORGOT_PASSWORD_SUCCESS',
  FORGOT_PASSWORD_FAILURE = 'FORGOT_PASSWORD_FAILURE',
  RESET_PASSWORD_START = 'RESET_PASSWORD_START',
  RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_SUCCESS',
  RESET_PASSWORD_FAILURE = 'RESET_PASSWORD_FAILURE',
  DELETE_ACCOUNT_START = 'DELETE_ACCOUNT_START',
  DELETE_ACCOUNT_SUCCESS = 'DELETE_ACCOUNT_SUCCESS',
  DELETE_ACCOUNT_FAILURE = 'DELETE_ACCOUNT_FAILURE',
  CLEAR_INFO_STATUSES = 'CLEAR_INFO_STATUSES',
  CLEAR_PASSWORD_STATUSES = 'CLEAR_PASSWORD_STATUSES',
  GET_OTHER_USER_START = 'GET_OTHER_USER_START',
  GET_OTHER_USER_SUCCESS = 'GET_OTHER_USER_SUCCESS',
  GET_FOLLOWERS_INFO_SUCCESS = 'GET_FOLLOWERS_INFO_SUCCESS',
  GET_FOLLOWING_INFO_SUCCESS = 'GET_FOLLOWING_INFO_SUCCESS',
  GET_POST_REACTOR_SUCCESS = 'GET_POST_REACTORS_SUCCESS',
  GET_OTHER_USER_FAILURE = 'GET_OTHER_USER_FAILURE',
  GET_USER_SUGGESTIONS_START = 'GET_USER_SUGGESTIONS_START',
  GET_USER_SUGGESTIONS_SUCCESS = 'GET_USER_SUGGESTIONS_SUCCESS',
  GET_USER_SUGGESTIONS_FAILURE = 'GET_USER_SUGGESTIONS_FAILURE',
  CLEAR_USER_SUGGESTIONS = 'CLEAR_USER_SUGGESTIONS',
  CLEAR_FOLLOWERS_AND_FOLLOWING = 'CLEAR_FOLLOWERS_AND_FOLLOWING',
  SET_IS_CURRENT_USER_PROFILE_PAGE = 'SET_IS_CURRENT_USER_PROFILE_PAGE',
  GET_FEED_POST_REACTOR_SUCCESS = 'GET_FEED_POST_REACTOR_SUCCESS',
  GET_CONVERSATION_USER_SUCCESS = 'GET_CONVERSATION_USER_SUCCESS',
  GET_NOTIFICATION_USER_SUCCESS = 'GET_NOTIFICATION_USER_SUCCESS',
  CLEAR_CONVERSATION_USERS = 'CLEAR_CONVERSATION_USERS',
}

export interface UserSignUp {
  username: string;
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface UserSignIn {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  photo?: string;
  bio?: string;
}

export interface FieldsToUpdate {
  name?: string;
  email?: string;
  username?: string;
  bio?: string;
  photo?: string;
}

export interface ChangePassword {
  passwordCurrent: string;
  password: string;
  passwordConfirm: string;
}

export interface ResetPassword {
  password: string;
  passwordConfirm: string;
  token: string;
}

export interface Error {
  statusCode: number;
  message: string;
}

export enum OtherUserType {
  OTHER = 'OTHER',
  POST_PAGE_USER = 'POST_PAGE_USER',
  FOLLOWERS = 'FOLLOWERS',
  FOLLOWING = 'FOLLOWING',
  POST_REACTOR = 'POST_REACTOR',
  FEED_POST_REACTOR = 'FEED_POST_REACTOR',
  EXPLORE_POST_MODAL = 'EXPLORE_POST_MODAL',
  CONVERSATION_USER = 'CONVERSATION_USER',
  NOTIFICATION_USER = 'NOTIFICATION_USER',
}

export interface OtherUserRequest {
  type: OtherUserType;
  usernameOrId: string;
}

export type UserPayload =
  | UserSignUp
  | UserSignIn
  | User
  | ChangePassword
  | ResetPassword
  | Error
  | null;

export interface UserState {
  currentUser: User | null;
  isCurrentUserProfilePage: boolean;
  otherUser: User | null;
  followersInfo: User[] | null;
  followingInfo: User[] | null;
  otherUserError: Error | null;
  userSuggestions: User[] | null;
  userSuggestionsConfirm: string | null;
  userSuggestionsError: Error | null;
  postReactingUsers: User[] | null;
  signUpError: Error | null;
  signInOrOutError: Error | null;
  changeInfoConfirm: null | string;
  changeInfoError: null | Error;
  changePasswordConfirm: null | string;
  changePasswordError: null | Error;
  forgotConfirm: null | string;
  forgotError: null | Error;
  resetConfirm: null | string;
  resetError: null | Error;
  deleteAccountError: null | Error;
  feedPostReactingUsers: User[] | null;
  conversationUsers: User[] | null;
  notificationUsers: Record<string, User>;
}

export interface SignUpStart {
  type: typeof UserActions.SIGN_UP_START;
  payload: UserSignUp;
}

export interface SignUpSuccess {
  type: typeof UserActions.SIGN_UP_SUCCESS;
  payload: User;
}

export interface SignUpFailure {
  type: typeof UserActions.SIGN_UP_FAILURE;
  payload: Error;
}

export interface CheckUserSession {
  type: typeof UserActions.CHECK_USER_SESSION;
  payload: null;
}

export interface SetCurrentUser {
  type: typeof UserActions.SET_CURRENT_USER;
  payload: User | null;
}

export interface SignInStart {
  type: typeof UserActions.SIGN_IN_START;
  payload: UserSignIn;
}

export interface SignInSuccess {
  type: typeof UserActions.SIGN_IN_SUCCESS;
  payload: User;
}

export interface SignInFailure {
  type: typeof UserActions.SIGN_IN_FAILURE;
  payload: Error;
}

export interface SignOutStart {
  type: typeof UserActions.SIGN_OUT_START;
  payload: null;
}

export interface SignOutSuccess {
  type: typeof UserActions.SIGN_OUT_SUCCESS;
  payload: null;
}

export interface SignOutFailure {
  type: typeof UserActions.SIGN_OUT_FAILURE;
  payload: Error;
}

export interface ChangeInfoStart {
  type: typeof UserActions.CHANGE_INFO_START;
  payload: FieldsToUpdate;
}

export interface ChangeInfoSuccess {
  type: typeof UserActions.CHANGE_INFO_SUCCESS;
  payload: User;
}

export interface ChangeInfoFailure {
  type: typeof UserActions.CHANGE_INFO_FAILURE;
  payload: Error;
}

export interface ChangePasswordStart {
  type: typeof UserActions.CHANGE_PASSWORD_START;
  payload: ChangePassword;
}

export interface ChangePasswordSuccess {
  type: typeof UserActions.CHANGE_PASSWORD_SUCCESS;
  payload: string;
}

export interface ChangePasswordFailure {
  type: typeof UserActions.CHANGE_PASSWORD_FAILURE;
  payload: Error;
}

export interface ForgotPasswordStart {
  type: typeof UserActions.FORGOT_PASSWORD_START;
  payload: string;
}

export interface ForgotPasswordSuccess {
  type: typeof UserActions.FORGOT_PASSWORD_SUCCESS;
  payload: string;
}

export interface ForgotPasswordFailure {
  type: typeof UserActions.FORGOT_PASSWORD_FAILURE;
  payload: Error;
}

export interface ResetPasswordStart {
  type: typeof UserActions.RESET_PASSWORD_START;
  payload: ResetPassword;
}

export interface ResetPasswordSuccess {
  type: typeof UserActions.RESET_PASSWORD_SUCCESS;
  payload: string;
}

export interface ResetPasswordFailure {
  type: typeof UserActions.RESET_PASSWORD_FAILURE;
  payload: Error;
}

export interface DeleteAccountStart {
  type: typeof UserActions.DELETE_ACCOUNT_START;
  payload: null;
}

export interface DeleteAccountSuccess {
  type: typeof UserActions.DELETE_ACCOUNT_SUCCESS;
  payload: string;
}

export interface DeleteAccountFailure {
  type: typeof UserActions.DELETE_ACCOUNT_FAILURE;
  payload: Error;
}

export interface ClearInfoStatuses {
  type: typeof UserActions.CLEAR_INFO_STATUSES;
  payload: null;
}

export interface ClearPasswordStatuses {
  type: typeof UserActions.CLEAR_PASSWORD_STATUSES;
  payload: null;
}

export interface GetOtherUserStart {
  type: typeof UserActions.GET_OTHER_USER_START;
  payload: OtherUserRequest;
}

export interface GetOtherUserSuccess {
  type: typeof UserActions.GET_OTHER_USER_SUCCESS;
  payload: User;
}

export interface GetFollowersSuccess {
  type: typeof UserActions.GET_FOLLOWERS_INFO_SUCCESS;
  payload: User;
}

export interface GetFollowingSuccess {
  type: typeof UserActions.GET_FOLLOWING_INFO_SUCCESS;
  payload: User;
}

export interface GetPostReactorsSuccess {
  type: typeof UserActions.GET_POST_REACTOR_SUCCESS;
  payload: User;
}

export interface GetOtherUserFailure {
  type: typeof UserActions.GET_OTHER_USER_FAILURE;
  payload: Error;
}

export interface GetUserSuggestionsStart {
  type: typeof UserActions.GET_USER_SUGGESTIONS_START;
  payload: string;
}

export interface GetUserSuggestionsSuccess {
  type: typeof UserActions.GET_USER_SUGGESTIONS_SUCCESS;
  payload: User[];
}

export interface GetUserSuggestionsFailure {
  type: typeof UserActions.GET_USER_SUGGESTIONS_FAILURE;
  payload: Error;
}

export interface ClearUserSuggestions {
  type: typeof UserActions.CLEAR_USER_SUGGESTIONS;
  payload: null;
}

export interface ClearFollowersOrFollowing {
  type: typeof UserActions.CLEAR_FOLLOWERS_AND_FOLLOWING;
  payload: null;
}

export interface SetIsCurrentUserProfilePage {
  type: typeof UserActions.SET_IS_CURRENT_USER_PROFILE_PAGE;
  payload: boolean;
}

export interface GetFeedPostReactorsSuccess {
  type: typeof UserActions.GET_FEED_POST_REACTOR_SUCCESS;
  payload: User;
}

export interface GetConversationUserSuccess {
  type: typeof UserActions.GET_CONVERSATION_USER_SUCCESS;
  payload: User;
}

export interface GetNotificationUserSuccess {
  type: typeof UserActions.GET_NOTIFICATION_USER_SUCCESS;
  payload: User;
}

export interface ClearConversationUsers {
  type: typeof UserActions.CLEAR_CONVERSATION_USERS;
}

export type UserActionTypes =
  | SignUpStart
  | SignUpSuccess
  | SignUpFailure
  | SignInStart
  | SignInSuccess
  | SignInFailure
  | SignOutStart
  | SignOutSuccess
  | SignOutFailure
  | SignOutFailure
  | CheckUserSession
  | SetCurrentUser
  | ChangeInfoStart
  | ChangeInfoSuccess
  | ChangeInfoFailure
  | ChangePasswordStart
  | ChangePasswordSuccess
  | ChangePasswordFailure
  | ForgotPasswordStart
  | ForgotPasswordSuccess
  | ForgotPasswordFailure
  | ResetPasswordStart
  | ResetPasswordSuccess
  | ResetPasswordFailure
  | DeleteAccountStart
  | DeleteAccountSuccess
  | DeleteAccountFailure
  | ClearInfoStatuses
  | ClearPasswordStatuses
  | GetOtherUserStart
  | GetOtherUserSuccess
  | GetFollowersSuccess
  | GetFollowingSuccess
  | GetPostReactorsSuccess
  | GetOtherUserFailure
  | GetUserSuggestionsStart
  | GetUserSuggestionsSuccess
  | GetUserSuggestionsFailure
  | ClearUserSuggestions
  | ClearFollowersOrFollowing
  | SetIsCurrentUserProfilePage
  | GetFeedPostReactorsSuccess
  | GetConversationUserSuccess
  | GetNotificationUserSuccess
  | ClearConversationUsers;
