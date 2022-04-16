import {
  takeLatest,
  takeEvery,
  put,
  all,
  call,
  PutEffect,
  AllEffect,
} from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';
import { ActionPattern } from '@redux-saga/types';

import {
  Message,
  MessageError,
  MessageActions,
  MessageActionTypes,
  FindOrCreateUserReq,
  User,
} from './message.types';

import {
  findOrCreateUserSuccess,
  findOrCreateUserFailure,
  removeUserSessionCookieSuccess,
  removeUserSessionCookieFailure,
} from './message.actions';

import axios, { AxiosResponse } from 'axios';

type MessageSaga<Args extends any[] = any[]> = (...args: Args) => Generator<
  | Promise<AxiosResponse<any>>
  | PutEffect<MessageActionTypes>
  | AllEffect<PutEffect<MessageActionTypes>>,
  void,
  {
    data: any;
  }
>;

export function* findOrCreateUser({
  payload: findOrCreateUserReq,
}: {
  payload: FindOrCreateUserReq;
}) {
  try {
    const { data: user }: { data: User } = yield axios.post(
      '/api/messages/users',
      findOrCreateUserReq
    );

    yield put(findOrCreateUserSuccess(user));
  } catch (err) {
    yield put(findOrCreateUserFailure(err as MessageError));
  }
}

export function* removeUserSessionCookie({
  payload: userId,
}: {
  payload: string;
}) {
  try {
    const { data: message }: { data: string } = yield axios.put(
      '/api/messages/users',
      userId
    );

    yield put(removeUserSessionCookieSuccess(message));
  } catch (err) {
    yield put(removeUserSessionCookieFailure(err as MessageError));
  }
}

export function* onFindOrCreateUserStart(): SagaIterator {
  yield takeEvery<ActionPattern, MessageSaga>(
    MessageActions.FIND_OR_CREATE_USER_START,
    findOrCreateUser
  );
}

export function* onRemoveUserSessionCookieStart(): SagaIterator {
  yield takeEvery<ActionPattern, MessageSaga>(
    MessageActions.REMOVE_USER_SESSION_COOKIE_START,
    removeUserSessionCookie
  );
}

export function* messageSagas(): SagaIterator {
  yield all([
    call(onFindOrCreateUserStart),
    call(onRemoveUserSessionCookieStart),
  ]);
}