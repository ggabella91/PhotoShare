export enum MessageActions {
  FIND_OR_CREATE_USER_START = 'FIND_OR_CREATE_USER_START',
  FIND_OR_CREATE_USER_SUCCESS = 'FIND_OR_CREATE_USER_SUCCESS',
  FIND_OR_CREATE_USER_FAILURE = 'FIND_OR_CREATE_USER_FAILURE',
  REMOVE_USER_SESSION_COOKIE_START = 'REMOVE_USER_SESSION_COOKIE_START',
  REMOVE_USER_SESSION_COOKIE_SUCCESS = 'REMOVE_USER_SESSION_COOKIE_SUCCESS',
  REMOVE_USER_SESSION_COOKIE_FAILURE = 'REMOVE_USER_SESSION_COOKIE_FAILURE',
  ADD_TO_JOINED_CONVERSATIONS_ARRAY = 'ADD_TO_JOINED_CONVERSATIONS_ARRAY',
  GET_CONVO_MESSAGES_START = 'GET_CONVO_MESSAGES_START',
  GET_CONVO_MESSAGES_SUCCESS = 'GET_CONVO_MESSAGES_SUCCESS',
  GET_CONVO_MESSAGES_FAILURE = 'GET_CONVO_MESSAGES_FAILURE',
  ADD_MESSAGE_TO_CONVERSATION = 'ADD_MESSAGE_TO_CONVERSATION',
}

export interface MessageState {
  user: User | null;
  messages: ConvoMessages[];
  findOrCreateUserError: MessageError | null;
  removeUserSessionCookieConfirm: string | null;
  removeUserSessionCookieError: MessageError | null;
}

export interface GetConvoMessagesReq {
  conversationId: string;
  limit: number;
  offset: number;
}

export interface ConvoMessages {
  conversationId: string;
  messages: Message[];
}

export interface Message {
  id: string;
  userId: string;
  text: string;
  conversationId: string;
}

export interface MessageError {
  statusCode: number;
  message: string;
}

export interface User {
  id: string;
  userId: string;
  name: string;
  joinedConversations: string[];
  sessionCookie: Record<string, any>;
  isAuthenticated: boolean;
}

export interface Conversation {
  name: string;
  messages: Message[];
  connectedUser: User[];
}

export interface FindOrCreateUserReq {
  userId: string;
  name: string;
}

export interface FindOrCreateUserStart {
  type: typeof MessageActions.FIND_OR_CREATE_USER_START;
  payload: FindOrCreateUserReq;
}

export interface FindOrCreateUserSuccess {
  type: typeof MessageActions.FIND_OR_CREATE_USER_SUCCESS;
  payload: User;
}

export interface FindOrCreateUserFailure {
  type: typeof MessageActions.FIND_OR_CREATE_USER_FAILURE;
  payload: MessageError;
}

export interface RemoveUserSessionCookieStart {
  type: typeof MessageActions.REMOVE_USER_SESSION_COOKIE_START;
  payload: string;
}

export interface RemoveUserSessionCookieSuccess {
  type: typeof MessageActions.REMOVE_USER_SESSION_COOKIE_SUCCESS;
  payload: string;
}

export interface RemoveUserSessionCookieFailure {
  type: typeof MessageActions.REMOVE_USER_SESSION_COOKIE_FAILURE;
  payload: MessageError;
}

export interface AddToJoinedConversationsArray {
  type: typeof MessageActions.ADD_TO_JOINED_CONVERSATIONS_ARRAY;
  payload: string | string[];
}

export interface GetConvoMessagesStart {
  type: typeof MessageActions.GET_CONVO_MESSAGES_START;
  payload: GetConvoMessagesReq;
}

export interface GetConvoMessagesSuccess {
  type: typeof MessageActions.GET_CONVO_MESSAGES_SUCCESS;
  payload: ConvoMessages;
}

export interface GetConvoMessagesFailure {
  type: typeof MessageActions.GET_CONVO_MESSAGES_FAILURE;
  payload: MessageError;
}

export interface AddMessageToConversation {
  type: typeof MessageActions.ADD_MESSAGE_TO_CONVERSATION;
  payload: Message;
}

export type MessageActionTypes =
  | FindOrCreateUserStart
  | FindOrCreateUserSuccess
  | FindOrCreateUserFailure
  | RemoveUserSessionCookieStart
  | RemoveUserSessionCookieSuccess
  | RemoveUserSessionCookieFailure
  | AddToJoinedConversationsArray
  | GetConvoMessagesStart
  | GetConvoMessagesSuccess
  | GetConvoMessagesFailure
  | AddMessageToConversation;
