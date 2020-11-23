import { takeLatest, put, all, call } from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';
import { ActionPattern, Saga } from '@redux-saga/types';

import {
  UserSignUp,
  UserSignIn,
  User,
  UserActions,
  ChangePassword,
  ResetPassword,
} from './user.types';

import {
  setCurrentUser,
  signInSuccess,
  signInFailure,
  signOutSuccess,
  signOutFailure,
  signUpSuccess,
  signUpFailure,
  changeInfoSuccess,
  changeInfoFailure,
  changePasswordSuccess,
  changePasswordFailure,
  forgotPasswordSuccess,
  forgotPasswordFailure,
  resetPasswordSuccess,
  resetPasswordFailure,
  deleteAccountSuccess,
  deleteAccountFailure,
} from './user.actions';

import axios from 'axios';

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

    yield put(signUpSuccess(data));
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
    const { data } = yield axios.post('/api/users/signin', {
      email,
      password,
    });

    yield put(signInSuccess(data));
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
    yield put(setCurrentUser(null));
  }
}

export function* signOut(): SagaIterator {
  try {
    //@ts-ignore
    yield axios.post('/api/users/signout');
    yield put(signOutSuccess());
  } catch (err) {
    yield put(signOutFailure(err));
  }
}

export function* changeInfo({
  payload: { name, email },
}: {
  payload: User;
}): SagaIterator {
  try {
    // @ts-ignore
    const { data } = yield axios.patch('/api/users/updateMe', {
      name,
      email,
    });

    yield put(changeInfoSuccess(data));
  } catch (err) {
    yield put(changeInfoFailure(err));
  }
}

export function* changePassword({
  payload: { passwordCurrent, password, passwordConfirm },
}: {
  payload: ChangePassword;
}): SagaIterator {
  try {
    // @ts-ignore
    const { data } = yield axios.patch('/api/users/updatePassword', {
      passwordCurrent,
      password,
      passwordConfirm,
    });

    yield put(changePasswordSuccess(data));
  } catch (err) {
    yield put(changePasswordFailure(err));
  }
}

export function* forgotPassword({
  payload: email,
}: {
  payload: string;
}): SagaIterator {
  try {
    // @ts-ignore
    yield axios.post('/api/users/forgotPassword', { email });

    yield put(forgotPasswordSuccess('Reset token generated!'));
  } catch (err) {
    yield put(forgotPasswordFailure(err));
  }
}

export function* resetPassword({
  payload: { password, passwordConfirm, token },
}: {
  payload: ResetPassword;
}): SagaIterator {
  try {
    // @ts-ignore
    yield axios.patch(`/api/users/resetPassword/${token}`, {
      password,
      passwordConfirm,
    });

    yield put(resetPasswordSuccess('Password reset successfully!'));
  } catch (err) {
    yield put(resetPasswordFailure(err));
  }
}

export function* deleteAccount(): SagaIterator {
  try {
    // @ts-ignore
    yield axios.patch('/api/users/deleteMe');

    yield put(deleteAccountSuccess('Account deleted!'));
  } catch (err) {
    yield put(deleteAccountFailure(err));
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

export function* onChangeInfoStart(): SagaIterator {
  yield takeLatest<ActionPattern, Saga>(
    UserActions.CHANGE_INFO_START,
    changeInfo
  );
}

export function* onChangePasswordStart(): SagaIterator {
  yield takeLatest<ActionPattern, Saga>(
    UserActions.CHANGE_PASSWORD_START,
    changePassword
  );
}

export function* onForgotPasswordStart(): SagaIterator {
  yield takeLatest<ActionPattern, Saga>(
    UserActions.FORGOT_PASSWORD_START,
    forgotPassword
  );
}

export function* onResetPasswordStart(): SagaIterator {
  yield takeLatest<ActionPattern, Saga>(
    UserActions.RESET_PASSWORD_START,
    resetPassword
  );
}

export function* onDeleteAccountStart(): SagaIterator {
  yield takeLatest<ActionPattern, Saga>(
    UserActions.DELETE_ACCOUNT_START,
    deleteAccount
  );
}

export function* userSagas(): SagaIterator {
  yield all([
    call(onSignUpStart),
    call(onSignUpSuccess),
    call(onSignInStart),
    call(onCheckUserSession),
    call(onSignOutStart),
    call(onChangeInfoStart),
    call(onChangePasswordStart),
    call(onForgotPasswordStart),
    call(onResetPasswordStart),
    call(onDeleteAccountStart),
  ]);
}
