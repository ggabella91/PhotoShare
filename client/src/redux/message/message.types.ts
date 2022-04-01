export enum MessageActions {
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
