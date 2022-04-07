export enum MessageActions {
  FIND_OR_CREATE_USER_START = 'FIND_OR_CREATE_USER_START',
  FIND_OR_CREATE_USER_SUCCESS = 'FIND_OR_CREATE_USER_SUCCESS',
  FIND_OR_CREATE_USER_FAILURE = 'FIND_OR_CREATE_USER_FAILURE',
  UPDATE_USER_AUTH_STATUS_START = 'UPDATE_USER_AUTH_STATUS_START',
  UPDATE_USER_AUTH_STATUS_SUCCESS = 'UPDATE_USER_AUTH_STATUS_SUCCESS',
  UPDATE_USER_AUTH_STATUS_FAILURE = 'UPDATE_USER_AUTH_STATUS_FAILURE',
}

export interface MessageState {
  isAuthenticated: boolean;
  userChatNickname: string;
  conversations: string[];
  messages: ConvoMessages[];
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

export interface UpdateUserAuthStatusReq {
  userId: string;
  isAuthenticated: boolean;
}

export interface FindOrCreateUserReq {
  userId: string;
  nickname: string;
}

export interface FindOrCreateUserStart {
  type: typeof MessageActions.FIND_OR_CREATE_USER_START;
  payload: FindOrCreateUserReq;
}

export interface FindOrCreateUserSuccess {
  type: typeof MessageActions.FIND_OR_CREATE_USER_SUCCESS;
  payload: string;
}

export interface FindOrCreateUserFailure {
  type: typeof MessageActions.FIND_OR_CREATE_USER_FAILURE;
  payload: MessageError;
}

export interface UpdateUserAuthStatusStart {
  type: typeof MessageActions.UPDATE_USER_AUTH_STATUS_START;
  payload: UpdateUserAuthStatusReq;
}

export interface UpdateUserAuthStatusSuccess {
  type: typeof MessageActions.UPDATE_USER_AUTH_STATUS_SUCCESS;
  payload: string;
}

export interface UpdateUserAuthStatusFailure {
  type: typeof MessageActions.UPDATE_USER_AUTH_STATUS_FAILURE;
  payload: MessageError;
}

export type MessageActionTypes =
  | UpdateUserAuthStatusStart
  | UpdateUserAuthStatusSuccess
  | UpdateUserAuthStatusFailure;
