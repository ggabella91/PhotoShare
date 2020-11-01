import { takeLatest, put, all, call } from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';
import { ActionPattern, Saga } from '@redux-saga/types';

import { UserSignUp, UserSignIn, User, UserActions } from './user.types';

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
    // @ts-ignore
    const { data } = yield axios.post('/api/users/signup', {
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

export function* signIn({
  payload: { email, password },
}: {
  payload: UserSignIn;
}): SagaIterator {
  try {
    // @ts-ignore
    const { data } = yield axios.post('/api/users/signin/', {
      email,
      password,
    });

    yield put(signInSuccess(data.data.user));
  } catch (err) {
    yield put(signInFailure(err));
  }
}

export function* isLoggedIn(): SagaIterator {
  try {
    //@ts-ignore
    const userLoggedIn = yield axios.get('/api/users/currentuser');

    if (!userLoggedIn.data.currentUser) return;
    yield put(setCurrentUser(userLoggedIn.data.currentUser));
  } catch (err) {
    yield put(signInFailure(err));
  }
}

export function* signOut(): SagaIterator {
  try {
    //@ts-ignore
    yield axios.get(`${origin}api/users/signout`);
    yield put(signOutSuccess());
  } catch (err) {
    yield put(signOutFailure(err));
  }
}

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
  yield all([
    call(onSignUpStart),
    call(onSignUpSuccess),
    call(onSignInStart),
    call(onCheckUserSession),
    call(onSignOutStart),
  ]);
}
