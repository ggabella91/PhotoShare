import {
  UserActions,
  UserActionTypes,
  UserSignUp,
  UserSignIn,
  User,
  Error,
} from './user.types';

export const signUpStart = ({
  name,
  email,
  password,
  passwordConfirm,
}: UserSignUp): UserActionTypes => ({
  type: UserActions.SIGN_UP_START,
  payload: { name, email, password, passwordConfirm },
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
