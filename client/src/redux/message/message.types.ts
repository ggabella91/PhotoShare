import { Map } from 'immutable';
import { UserInfoMap } from '../../components/conversation/conversation.component';

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
  REMOVE_MESSAGE_FROM_CONVERSATION = 'REMOVE_MESSAGE_FROM_CONVERSATION',
  PERMANENTLY_REMOVE_MESSAGE_FOR_USER = 'PERMANENTLY_REMOVE_MESSAGE_FOR_USER',
  REMOVE_USER_FROM_CONVO_USERS_ARRAY = 'REMOVE_USER_FROM_CONVO_USERS_ARRAY',
  RESET_CONVO_USERS_ARRAY = 'RESET_CONVO_USERS_ARRAY',
  CLEAR_JOINED_CONVOS_ARRAY = 'CLEAR_JOINED_CONVOS_ARRAY',
  ADD_TO_CONVERSATION_TO_USER_DATA_MAP = 'ADD_TO_CONVERSATION_TO_USER_DATA_MAP',
  ADD_CONVERSATION_USER_NICKNAMES_MAP = 'ADD_CONVERSATION_USER_NICKNAMES_MAP',
}

export interface MessageState {
  user: MessageUser | null;
  messages: ConvoMessages[];
  isLoadingMessages: boolean;
  findOrCreateUserError: MessageError | null;
  removeUserSessionCookieConfirm: string | null;
  removeUserSessionCookieError: MessageError | null;
  usersArrayForNewConvoReq: Partial<MessageUser>[];
  conversationToUserDataMap: Map<string, UserInfoMap>;
  conversationUserNicknamesMaps: Record<string, Record<string, string>>;
}

export interface GetConvoMessagesReq {
  conversationId: string;
  limit?: number;
  pageToShow?: number;
}

export interface ConvoMessages {
  conversationId: string;
  messages: Message[];
  queryLength?: number;
}

export interface Message {
  id: string;
  ownerId: string;
  text: string;
  conversationId: string;
  created: string;
  hidden?: boolean;
  messageHiddenTime: string;
  usersMessageIsRemovedFor: string[];
  isReply?: boolean;
  messageReplyingToId?: string;
  messageReplyingToOwnerId?: string;
  messageReplyingToOwnerName?: string;
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

export interface Nickname {
  userId: string;
  nickname: string;
}

export interface Conversation {
  id: string;
  name: string;
  connectedUsers: string[];
  avatarS3Keys: string[];
  connectedUserNames: string[];
  lastMessageTime: number;
  adminUsers: string[];
  historicalUsers: string[];
  userNicknames: Nickname[];
}

export interface FindOrCreateUserReq {
  userId: string;
  name: string;
  username: string;
  photoS3Key?: string;
}

export interface MessageToRemove {
  conversationId: string;
  messageId: string;
}

export interface MessageToPermanentlyRemoveForUser {
  conversationId: string;
  messageId: string;
  userId: string;
}

export interface AddUserNicknameMap {
  conversationId: string;
  userNicknameMap: Record<string, string>;
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

export interface RemoveMessageFromConversation {
  type: typeof MessageActions.REMOVE_MESSAGE_FROM_CONVERSATION;
  payload: MessageToRemove;
}

export interface PermanentlyRemoveMessageForUser {
  type: typeof MessageActions.PERMANENTLY_REMOVE_MESSAGE_FOR_USER;
  payload: MessageToPermanentlyRemoveForUser;
}

export interface RemoveUserFromConvoUsersArray {
  type: typeof MessageActions.REMOVE_USER_FROM_CONVO_USERS_ARRAY;
  payload: string;
}

export interface ResetConvoUsersArray {
  type: typeof MessageActions.RESET_CONVO_USERS_ARRAY;
}

export interface ClearJoinedConvosArray {
  type: typeof MessageActions.CLEAR_JOINED_CONVOS_ARRAY;
}

export interface ConvoIdAndUserData {
  conversationId: string;
  userData: UserInfoMap;
}
export interface AddToConversationToUserDataMap {
  type: typeof MessageActions.ADD_TO_CONVERSATION_TO_USER_DATA_MAP;
  payload: ConvoIdAndUserData;
}

export interface AddConversationUserNicknamesMap {
  type: typeof MessageActions.ADD_CONVERSATION_USER_NICKNAMES_MAP;
  payload: AddUserNicknameMap;
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
  | RemoveMessageFromConversation
  | PermanentlyRemoveMessageForUser
  | RemoveUserFromConvoUsersArray
  | ResetConvoUsersArray
  | ClearJoinedConvosArray
  | AddToConversationToUserDataMap
  | AddConversationUserNicknamesMap;
