export enum MessageActions {
  UPDATE_USER_AUTH_STATUS_START = 'UPDATE_USER_AUTH_STATUS_START',
  UPDATE_USER_AUTH_STATUS_SUCCESS = 'UPDATE_USER_AUTH_STATUS_SUCCESS',
  UPDATE_USER_AUTH_STATUS_FAILURE = 'UPDATE_USER_AUTH_STATUS_FAILURE',
}

export interface MessageState {
  isAuthenticated: boolean;
  userChatNickname: string;
  conversations: string[];
  messages: string[];
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
