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
  ADD_USER_TO_CONVO_USERS_ARRAY = 'ADD_USER_TO_CONVO_USERS_ARRAY',
  REMOVE_USER_FROM_CONVO_USERS_ARRAY = 'REMOVE_USER_FROM_CONVO_USERS_ARRAY',
  RESET_CONVO_USERS_ARRAY = 'RESET_CONVO_USERS_ARRAY',
}

export interface MessageState {
  user: MessageUser | null;
  messages: ConvoMessages[];
  findOrCreateUserError: MessageError | null;
  removeUserSessionCookieConfirm: string | null;
  removeUserSessionCookieError: MessageError | null;
  usersArrayForNewConvoReq: Partial<MessageUser>[];
}

export interface GetConvoMessagesReq {
  conversationId: string;
  limit: number;
  pageToShow: number;
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

export interface MessageUser {
  id: string;
  userId: string;
  name: string;
  username: string;
  joinedConversations: Conversation[];
  sessionCookie: Record<string, any>;
  isAuthenticated: boolean;
  photoS3Key?: string;
}

export interface Conversation {
  id: string;
  name: string;
  connectedUsers: MessageUser[];
  avatarS3Key?: string;
}

export interface FindOrCreateUserReq {
  userId: string;
  name: string;
  username: string;
  photoS3Key?: string;
}

export interface FindOrCreateUserStart {
  type: typeof MessageActions.FIND_OR_CREATE_USER_START;
  payload: FindOrCreateUserReq;
}

export interface FindOrCreateUserSuccess {
  type: typeof MessageActions.FIND_OR_CREATE_USER_SUCCESS;
  payload: MessageUser;
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
  payload: Conversation | Conversation[];
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

export interface AddUserToConvoUsersArray {
  type: typeof MessageActions.ADD_USER_TO_CONVO_USERS_ARRAY;
  payload: Partial<MessageUser>;
}

export interface RemoveUserFromConvoUsersArray {
  type: typeof MessageActions.REMOVE_USER_FROM_CONVO_USERS_ARRAY;
  payload: string;
}

export interface ResetConvoUsersArray {
  type: typeof MessageActions.RESET_CONVO_USERS_ARRAY;
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
  | AddMessageToConversation
  | AddUserToConvoUsersArray
  | RemoveUserFromConvoUsersArray
  | ResetConvoUsersArray;
