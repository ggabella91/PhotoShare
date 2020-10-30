import { takeLatest, put, all, call } from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';
import {ActionPattern} from '@redux-saga/types'

import { UserSignUp, User, UserActions, UserActionTypes } from './user.types';

import axios from 'axios';

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
  UserActionTypes;
}): SagaIterator {
  try {
    const { data } = yield axios.post('api/v1/users/signup', {
      name,
      email,
      password,
      passwordConfirm,
    });

    yield put(signUpSuccess(data.data.user));
  } catch (err) {
    yield put(signUpFailure(err));
  }
}

export function* onSignUpStart(): SagaIterator {
  yield takeLatest<ActionPattern>(UserActions.SIGN_UP_START, signUp);
}

export function* onSignUpSuccess(): SagaIterator {
  yield takeLatest(UserActions.SIGN_UP_SUCCESS, signInAfterSignUp);
}

export function* signInAfterSignUp({ payload: user }): SagaIterator {
  yield put(setCurrentUser(user));
}

export function* onSignInStart(): SagaIterator {
  yield takeLatest(UserActions.SIGN_IN_START, signIn);
}

export function* onCheckUserSession(): SagaIterator {
  yield takeLatest(UserActions.CHECK_USER_SESSION, isLoggedIn);
}

export function* onSignOutStart(): SagaIterator {
  yield takeLatest(UserActions.SIGN_OUT_START, signOut);
}

export function* userSagas(): SagaIterator {
  yield all([]);
}
