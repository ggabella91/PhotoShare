import {
  Message,
  MessageError,
  FindOrCreateUserReq,
  MessageActions,
  MessageActionTypes,
  UpdateUserAuthStatusReq,
  User,
} from './message.types';

export const findOrCreateUserStart = (
  findOrCreateUserReq: FindOrCreateUserReq
): MessageActionTypes => ({
  type: MessageActions.FIND_OR_CREATE_USER_START,
  payload: findOrCreateUserReq,
});

export const findOrCreateUserSuccess = (user: User): MessageActionTypes => ({
  type: MessageActions.FIND_OR_CREATE_USER_SUCCESS,
  payload: user,
});

export const findOrCreateUserFailure = (
  error: MessageError
): MessageActionTypes => ({
  type: MessageActions.FIND_OR_CREATE_USER_FAILURE,
  payload: error,
});

export const updateUserAuthStatusStart = (
  authStatusReq: UpdateUserAuthStatusReq
): MessageActionTypes => ({
  type: MessageActions.UPDATE_USER_AUTH_STATUS_START,
  payload: authStatusReq,
});

export const updateUserAuthStatusSuccess = (
  message: string
): MessageActionTypes => ({
  type: MessageActions.UPDATE_USER_AUTH_STATUS_SUCCESS,
  payload: message,
});

export const updateUserAuthStatusFailure = (
  error: MessageError
): MessageActionTypes => ({
  type: MessageActions.UPDATE_USER_AUTH_STATUS_FAILURE,
  payload: error,
});
