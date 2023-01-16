import { takeLatest, takeEvery, put, all, call } from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';
import { ActionPattern, Saga } from '@redux-saga/types';

import {
  UserSignUp,
  UserSignIn,
  User,
  UserActions,
  FieldsToUpdate,
  OtherUserType,
  OtherUserRequest,
  ChangePassword,
  ResetPassword,
  Error,
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
  getOtherUserSuccess,
  getFollowersSuccess,
  getFollowingSuccess,
  getPostReactorsSuccess,
  getOtherUserFailure,
  getUserSuggestionsSuccess,
  getUserSuggestionsFailure,
  getFeedPostReactorsSuccess,
  getConversationUserSuccess,
  getNotificationUserSuccess,
} from './user.actions';

import { clearPostState } from '../post/post.actions';

import axios from 'axios';

// TODO: Update saga for fetching 'other' users with routing
// for notification users, to store a map of these as a
// separate prop in redux user state

export function* signUp({
  payload: { username, name, email, password, passwordConfirm },
}: {
  payload: UserSignUp;
}): any {
  try {
    const { data } = yield axios.post('/api/users/signup', {
      username,
      name,
      email,
      password,
      passwordConfirm,
    });

    yield put(signUpSuccess(data));
  } catch (err) {
    yield put(signUpFailure(err as Error));
  }
}

export function* signIn({
  payload: { email, password },
}: {
  payload: UserSignIn;
}): any {
  try {
    const { data }: { data: User } = yield axios.post('/api/users/signin', {
      email,
      password,
    });

    yield put(signInSuccess(data));
  } catch (err) {
    yield put(signInFailure(err as Error));
  }
}

export function* isLoggedIn(): any {
  try {
    const userLoggedIn = yield axios.get('/api/users/currentuser');

    if (!userLoggedIn.data.currentUser) return;
    yield put(setCurrentUser(userLoggedIn.data.currentUser));
  } catch (err) {
    yield put(setCurrentUser(null));
  }
}

export function* getOtherUser({
  payload: { type, usernameOrId },
}: {
  payload: OtherUserRequest;
}): any {
  try {
    if (type === OtherUserType.OTHER) {
      const { data }: { data: User } = yield axios.get(
        `/api/users/${usernameOrId}`
      );

      yield put(getOtherUserSuccess(data));
    } else if (type === OtherUserType.POST_PAGE_USER) {
      const { data }: { data: User } = yield axios.get(
        `/api/users/id/${usernameOrId}`
      );

      yield put(getOtherUserSuccess(data));
    } else if (type === OtherUserType.FOLLOWERS) {
      const { data }: { data: User } = yield axios.get(
        `/api/users/id/${usernameOrId}`
      );

      yield put(getFollowersSuccess(data));
    } else if (type === OtherUserType.FOLLOWING) {
      const { data }: { data: User } = yield axios.get(
        `/api/users/id/${usernameOrId}`
      );

      yield put(getFollowingSuccess(data));
    } else if (type === OtherUserType.POST_REACTOR) {
      const { data }: { data: User } = yield axios.get(
        `/api/users/id/${usernameOrId}`
      );

      yield put(getPostReactorsSuccess(data));
    } else if (type === OtherUserType.FEED_POST_REACTOR) {
      const { data }: { data: User } = yield axios.get(
        `/api/users/id/${usernameOrId}`
      );

      yield put(getFeedPostReactorsSuccess(data));
    } else if (type === OtherUserType.EXPLORE_POST_MODAL) {
      const { data }: { data: User } = yield axios.get(
        `/api/users/id/${usernameOrId}`
      );

      yield put(getOtherUserSuccess(data));
    } else if (type === OtherUserType.CONVERSATION_USER) {
      const { data: convoUser }: { data: User } = yield axios.get(
        `/api/users/id/${usernameOrId}`
      );

      yield put(getConversationUserSuccess(convoUser));
    } else if (type === OtherUserType.NOTIFICATION_USER) {
      const { data: notificationUser }: { data: User } = yield axios.get(
        `/api/users/id/${usernameOrId}`
      );

      yield put(getNotificationUserSuccess(notificationUser));
    }
  } catch (err) {
    yield put(getOtherUserFailure(err as Error));
  }
}

export function* getUserSuggestions({
  payload: match,
}: {
  payload: string;
}): any {
  try {
    const { data }: { data: User[] } = yield axios.get(
      `/api/users/suggested/${match}`
    );
    yield put(getUserSuggestionsSuccess(data));
  } catch (err) {
    yield put(getUserSuggestionsFailure(err as Error));
  }
}

export function* signOut(): any {
  try {
    yield axios.post('/api/users/signout');
    yield all([put(signOutSuccess()), put(clearPostState())]);
  } catch (err) {
    yield put(signOutFailure(err as Error));
  }
}

export function* changeInfo({
  payload: fieldsToUpdate,
}: {
  payload: FieldsToUpdate;
}): any {
  try {
    const { data } = yield axios.patch('/api/users/updateMe', fieldsToUpdate);

    yield all([put(changeInfoSuccess(data)), put(setCurrentUser(data))]);
  } catch (err) {
    yield put(changeInfoFailure(err as Error));
  }
}

export function* changePassword({
  payload: { passwordCurrent, password, passwordConfirm },
}: {
  payload: ChangePassword;
}): any {
  try {
    const { data } = yield axios.patch('/api/users/updatePassword', {
      passwordCurrent,
      password,
      passwordConfirm,
    });

    yield put(changePasswordSuccess(data));
  } catch (err) {
    yield put(changePasswordFailure(err as Error));
  }
}

export function* forgotPassword({ payload: email }: { payload: string }): any {
  try {
    yield axios.post('/api/users/forgotPassword', { email });

    yield put(forgotPasswordSuccess('Reset token generated!'));
  } catch (err) {
    yield put(forgotPasswordFailure(err as Error));
  }
}

export function* resetPassword({
  payload: { password, passwordConfirm, token },
}: {
  payload: ResetPassword;
}): any {
  try {
    yield axios.patch(`/api/users/resetPassword/${token}`, {
      password,
      passwordConfirm,
    });

    yield put(resetPasswordSuccess('Password reset successfully!'));
  } catch (err) {
    yield put(resetPasswordFailure(err as Error));
  }
}

export function* deleteAccount(): any {
  try {
    yield axios.patch('/api/users/deleteMe');

    yield put(deleteAccountSuccess('Account deleted!'));
  } catch (err) {
    yield put(deleteAccountFailure(err as Error));
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

export function* onGetOtherUserStart(): SagaIterator {
  yield takeEvery<ActionPattern, Saga>(
    UserActions.GET_OTHER_USER_START,
    getOtherUser
  );
}

export function* onGetUserSuggestionsStart(): SagaIterator {
  yield takeLatest<ActionPattern, Saga>(
    UserActions.GET_USER_SUGGESTIONS_START,
    getUserSuggestions
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
    call(onGetOtherUserStart),
    call(onGetUserSuggestionsStart),
    call(onSignOutStart),
    call(onChangeInfoStart),
    call(onChangePasswordStart),
    call(onForgotPasswordStart),
    call(onResetPasswordStart),
    call(onDeleteAccountStart),
  ]);
}
