export const UserActions = {
  CHECK_USER_SESSION: 'CHECK_USER_SESSION',
  SET_CURRENT_USER: 'SET_CURRENT_USER',
  SIGN_UP_START: 'SIGN_UP_START',
  SIGN_UP_SUCCESS: 'SIGN_UP_SUCCESS',
  SIGN_UP_FAILURE: 'SIGN_UP_FAILURE',
  SIGN_IN_START: 'SIGN_IN_START',
  SIGN_IN_SUCCESS: 'SIGN_IN_SUCCESS',
  SIGN_IN_FAILURE: 'SIGN_IN_FAILURE',
  SIGN_OUT_START: 'SIGN_OUT_START',
  SIGN_OUT_SUCCESS: 'SIGN_OUT_SUCCESS',
  SIGN_OUT_FAILURE: 'SIGN_OUT_FAILURE',
};

export interface UserState {
  currentUser: { name: string; email: string } | null;
  signUpError: string | null;
  signInOrOutError: string | null;
}

export interface UserSignUp {
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
  name: string;
  email: string;
}

export interface Error {
  statusCode: number;
  message: string;
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
  payload: User;
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

export type UserActionTypes =
  | SignUpStart
  | SignUpSuccess
  | SignOutFailure
  | SignInStart
  | SignInSuccess
  | SignInFailure
  | SignOutStart
  | SignOutSuccess
  | SignOutFailure
  | CheckUserSession
  | SetCurrentUser;
