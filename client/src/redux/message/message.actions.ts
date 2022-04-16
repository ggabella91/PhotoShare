import {
  Message,
  ConvoMessages,
  MessageError,
  FindOrCreateUserReq,
  MessageActions,
  MessageActionTypes,
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

export const removeUserSessionCookieStart = (
  userId: string
): MessageActionTypes => ({
  type: MessageActions.REMOVE_USER_SESSION_COOKIE_START,
  payload: userId,
});

export const removeUserSessionCookieSuccess = (
  message: string
): MessageActionTypes => ({
  type: MessageActions.REMOVE_USER_SESSION_COOKIE_SUCCESS,
  payload: message,
});

export const removeUserSessionCookieFailure = (
  error: MessageError
): MessageActionTypes => ({
  type: MessageActions.REMOVE_USER_SESSION_COOKIE_FAILURE,
  payload: error,
});

export const addToJoinedConversationsArray = (
  conversations: string | string[]
): MessageActionTypes => ({
  type: MessageActions.ADD_TO_JOINED_CONVERSATIONS_ARRAY,
  payload: conversations,
});

export const addToConvoMessagesArray = (
  convoMessages: ConvoMessages
): MessageActionTypes => ({
  type: MessageActions.ADD_TO_CONVO_MESSAGES_ARRAY,
  payload: convoMessages,
});

export const addMessageToConversation = (
  message: Message
): MessageActionTypes => ({
  type: MessageActions.ADD_MESSAGE_TO_CONVERSATION,
  payload: message,
});