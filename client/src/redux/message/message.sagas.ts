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
  UpdateUserAuthStatusReq,
} from './message.types';

import {
  findOrCreateUserSuccess,
  findOrCreateUserFailure,
  updateUserAuthStatusSuccess,
  updateUserAuthStatusFailure,
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

export function* updateUserAuthStatus({
  payload: authStatusReq,
}: {
  payload: UpdateUserAuthStatusReq;
}) {
  try {
    const { data: message }: { data: string } = yield axios.put(
      '/api/messages/users',
      authStatusReq
    );

    yield put(updateUserAuthStatusSuccess(message));
  } catch (err) {
    yield put(updateUserAuthStatusFailure(err as MessageError));
  }
}

export function* onFindOrCreateUserStart(): SagaIterator {
  yield takeEvery<ActionPattern, MessageSaga>(
    MessageActions.FIND_OR_CREATE_USER_START,
    findOrCreateUser
  );
}

export function* onUpdateUserAuthStatusStart(): SagaIterator {
  yield takeEvery<ActionPattern, MessageSaga>(
    MessageActions.UPDATE_USER_AUTH_STATUS_START,
    updateUserAuthStatus
  );
}

export function* messageSagas(): SagaIterator {
  yield all([call(onFindOrCreateUserStart), call(onUpdateUserAuthStatusStart)]);
}
