export enum MessageActions {
  FIND_OR_CREATE_USER_START = 'FIND_OR_CREATE_USER_START',
  FIND_OR_CREATE_USER_SUCCESS = 'FIND_OR_CREATE_USER_SUCCESS',
  FIND_OR_CREATE_USER_FAILURE = 'FIND_OR_CREATE_USER_FAILURE',
  REMOVE_USER_SESSION_COOKIE_START = 'REMOVE_USER_SESSION_COOKIE_START',
  REMOVE_USER_SESSION_COOKIE_SUCCESS = 'REMOVE_USER_SESSION_COOKIE_SUCCESS',
  REMOVE_USER_SESSION_COOKIE_FAILURE = 'REMOVE_USER_SESSION_COOKIE_FAILURE',
}

export interface MessageState {
  user: User | null;
  messages: ConvoMessages[];
  findOrCreateUserError: MessageError | null;
  removeUserSessionCookieConfirm: string | null;
  removeUserSessionCookieError: MessageError | null;
}

export interface ConvoMessages {
  converationId: string;
  messages: Message[];
}

export interface Message {
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

export type MessageActionTypes =
  | FindOrCreateUserStart
  | FindOrCreateUserSuccess
  | FindOrCreateUserFailure
  | RemoveUserSessionCookieStart
  | RemoveUserSessionCookieSuccess
  | RemoveUserSessionCookieFailure;
