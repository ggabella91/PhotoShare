import {
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
  GetConvoMessagesReq,
  MessageError,
  MessageActions,
  MessageActionTypes,
  FindOrCreateUserReq,
  MessageUser,
} from './message.types';

import {
  findOrCreateUserSuccess,
  findOrCreateUserFailure,
  removeUserSessionCookieSuccess,
  removeUserSessionCookieFailure,
  getConvoMessagesSuccess,
  getConvoMessagesFailure,
  getConversationUsersFailure,
  getConversationUsersSuccess,
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
    const { data: user }: { data: MessageUser } = yield axios.post(
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

export function* getConvoMessages({
  payload: { conversationId, limit, pageToShow },
}: {
  payload: GetConvoMessagesReq;
}) {
  try {
    const {
      data: { messages, queryLength },
    }: { data: { messages: Message[]; queryLength: number } } = yield axios.get(
      `/api/messages/conversation/${conversationId}${
        limit ? `?limit=${limit}&offset=${pageToShow}` : ''
      }`
    );

    yield put(
      getConvoMessagesSuccess({
        conversationId,
        messages,
        ...(queryLength && { queryLength }),
      })
    );
  } catch (err) {
    yield put(getConvoMessagesFailure(err as MessageError));
  }
}

export function* getConversationUsers({
  payload: conversationId,
}: {
  payload: string;
}) {
  try {
    const { data: messageUsers }: { data: MessageUser[] } = yield axios.get(
      `/api/messages/conversation/users/${conversationId}`
    );

    yield put(getConversationUsersSuccess({ conversationId, messageUsers }));
  } catch (err) {
    yield put(getConversationUsersFailure(err as MessageError));
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

export function* onGetConvoMessagesStart(): SagaIterator {
  yield takeEvery<ActionPattern, MessageSaga>(
    MessageActions.GET_CONVO_MESSAGES_START,
    getConvoMessages
  );
}

export function* onGetConversationUsersStart(): SagaIterator {
  yield takeEvery<ActionPattern, MessageSaga>(
    MessageActions.GET_CONVERSATION_USERS_START,
    getConversationUsers
  );
}

export function* messageSagas(): SagaIterator {
  yield all([
    call(onFindOrCreateUserStart),
    call(onRemoveUserSessionCookieStart),
    call(onGetConvoMessagesStart),
    call(onGetConversationUsersStart),
  ]);
}
