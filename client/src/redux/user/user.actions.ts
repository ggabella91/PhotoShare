import UserActions from './user.types';

interface UserSignUp {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

interface UserSignIn {
  email: string;
  password: string;
}

interface User {
  name: string;
  email: string;
}

interface Error {
  statusCode: number;
  message: string;
}

export const signUpStart = ({
  name,
  email,
  password,
  passwordConfirm,
}: UserSignUp) => ({
  type: UserActions.SIGN_UP_START,
  payload: { name, email, password, passwordConfirm },
});

export const signUpSuccess = (user: User) => ({
  type: UserActions.SIGN_UP_SUCCESS,
  payload: user,
});

export const signUpFailure = (error: Error) => ({
  type: UserActions.SIGN_UP_FAILURE,
  payload: error,
});

export const checkUserSession = () => ({
  type: UserActions.CHECK_USER_SESSION,
});

export const setCurrentUser = (user: User) => ({
  type: UserActions.SET_CURRENT_USER,
  payload: user,
});

export const signInStart = ({ email, password }: UserSignIn) => ({
  type: UserActions.SIGN_IN_START,
  payload: { email, password },
});

export const signInSuccess = (user: User) => ({
  type: UserActions.SIGN_IN_SUCCESS,
  payload: user,
});

export const signInFailure = (error: Error) => ({
  type: UserActions.SIGN_IN_FAILURE,
  payload: error,
});

export const signOutStart = () => ({
  type: UserActions.SIGN_OUT_START,
});

export const signOutSuccess = () => ({
  type: UserActions.SIGN_OUT_SUCCESS,
});

export const signOutFailure = (error: Error) => ({
  type: UserActions.SIGN_OUT_FAILURE,
  payload: error,
});
