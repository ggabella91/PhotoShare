import { Action, ActionCreator } from 'redux';
import { takeLatest, put, all, call } from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';
import { ActionPattern, ActionType, Saga } from '@redux-saga/types';

import {
  UserSignUp,
  User,
  UserActions,
  UserPayload,
  UserActionTypes,
} from './user.types';

import axios, {
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';

interface MyAction extends Action {
  type: string;
  payload?: UserPayload;
}

import {
  setCurrentUser,
  signInSuccess,
  signInFailure,
  signOutSuccess,
  signOutFailure,
  signUpSuccess,
  signUpFailure,
} from './user.actions';

export function* signUp({
  payload: { name, email, password, passwordConfirm },
}: {
  payload: UserSignUp;
}): SagaIterator {
  try {
    const { data } = yield axios.post<UserSignUp, AxiosResponse<User>>('/api/v1/users/signup', {
      name,
      email,
      password,
      passwordConfirm,
    }): Promise<AxiosResponse<User>>;

    yield put(signUpSuccess(data.data.user));
  } catch (err) {
    yield put(signUpFailure(err));
  }
}

export function* signIn() {}

export function* isLoggedIn() {}

export function* signOut() {}

export function* onSignUpStart(): SagaIterator {
  yield takeLatest<ActionPattern, Saga>(UserActions.SIGN_UP_START, signUp);
}

export function* onSignUpSuccess(): SagaIterator {
  yield takeLatest<ActionPattern, Saga>(
    UserActions.SIGN_UP_SUCCESS,
    signInAfterSignUp
  );
}

export function* signInAfterSignUp({
  payload: user,
}: {
  payload: User;
}): SagaIterator {
  yield put(setCurrentUser(user));
}

export function* onSignInStart(): SagaIterator {
  yield takeLatest<ActionPattern, Saga>(UserActions.SIGN_IN_START, signIn);
}

export function* onCheckUserSession(): SagaIterator {
  yield takeLatest<ActionPattern, Saga>(
    UserActions.CHECK_USER_SESSION,
    isLoggedIn
  );
}

export function* onSignOutStart(): SagaIterator {
  yield takeLatest<ActionPattern, Saga>(UserActions.SIGN_OUT_START, signOut);
}

export function* userSagas(): SagaIterator {
  yield all([]);
}
