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
  UPDATE_MESSAGE_LAST_SEEN_BY = 'UPDATE_MESSAGE_LAST_SEEN_BY',
  UPDATE_MESSAGE_STATUS = 'UPDATE_MESSAGE_STATUS',
  ADD_USER_TO_CONVO_USERS_ARRAY = 'ADD_USER_TO_CONVO_USERS_ARRAY',
  REMOVE_MESSAGE_FROM_CONVERSATION = 'REMOVE_MESSAGE_FROM_CONVERSATION',
  PERMANENTLY_REMOVE_MESSAGE_FOR_USER = 'PERMANENTLY_REMOVE_MESSAGE_FOR_USER',
  REMOVE_USER_FROM_CONVO_USERS_ARRAY = 'REMOVE_USER_FROM_CONVO_USERS_ARRAY',
  RESET_CONVO_USERS_ARRAY = 'RESET_CONVO_USERS_ARRAY',
  CLEAR_JOINED_CONVOS_ARRAY = 'CLEAR_JOINED_CONVOS_ARRAY',
  ADD_TO_CONVERSATION_TO_USER_DATA_MAP = 'ADD_TO_CONVERSATION_TO_USER_DATA_MAP',
  REMOVE_FROM_CONVERSATION_TO_USER_DATA_MAP = 'REMOVE_FROM_CONVERSATION_TO_USER_DATA_MAP',
  ADD_CONVERSATION_USER_NICKNAMES_MAP = 'ADD_CONVERSATION_USER_NICKNAMES_MAP',
  GET_CONVERSATION_USERS_START = 'GET_CONVERSATION_USERS_START',
  GET_CONVERSATION_USERS_SUCCESS = 'GET_CONVERSATION_USERS_SUCCESS',
  GET_CONVERSATION_USERS_FAILURE = 'GET_CONVERSATION_USERS_FAILURE',

  // Add / update which page should be fetched next for a given
  // conversation
  SET_OLDEST_MESSAGE_FOR_CONVERSATION = 'SET_OLDEST_MESSAGE_FOR_CONVERSATION',
  SET_STOP_FETCHING_MESSAGES_FOR_CONVERSATION = 'SET_STOP_FETCHING_MESSAGES_FOR_CONVERSATION',
}

export interface MessageState {
  user: MessageUser | null;
  messages: ConvoMessages[];
  isLoadingMessages: boolean;
  findOrCreateUserError: MessageError | null;
  removeUserSessionCookieConfirm: string | null;
  removeUserSessionCookieError: MessageError | null;
  usersArrayForNewConvoReq: Partial<MessageUser>[];
  conversationToUserDataMap: Record<string, UserInfoMap>;
  conversationUserNicknamesMaps: Record<string, Record<string, string>>;
  conversationMessageUsersMap: Record<string, MessageUser[]>;
  oldestMessageToConvoMap: Record<string, string>;
  stopFetchingMessagesForConvoMap: Record<string, boolean>;
}

export interface GetConvoMessagesReq {
  conversationId: string;
  limit?: number;
  beforeMessageId: string;
  getTotal?: boolean;
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
  status: 'sending' | 'sent' | 'delivered' | 'error';
  usersForWhomMessageWasLastOneSeen: MessageSeenBy[];
  hasBeenViewedByOtherUsers: boolean;
}

export interface MessageLastSeen {
  message: Message;
  viewedBy: string;
}

export interface MessageSeenBy {
  userId: string;
  seenTime: string;
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
  isOnline: boolean;
  lastActiveTime: string;
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
  conversationImageS3Key: string;
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

export interface MessageUsersResponse {
  conversationId: string;
  messageUsers: MessageUser[];
}

export interface AddUserNicknameMap {
  conversationId: string;
  userNicknameMap: Record<string, string>;
}

export interface OldestMessageForConvo {
  conversationId: string;
  oldestMessageId: string;
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

export interface UpdateMessageLastSeenBy {
  type: typeof MessageActions.UPDATE_MESSAGE_LAST_SEEN_BY;
  payload: MessageLastSeen;
}

export interface UpdateMessageStatus {
  type: typeof MessageActions.UPDATE_MESSAGE_STATUS;
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

export interface RemoveFromConversationToUserDataMap {
  type: typeof MessageActions.REMOVE_FROM_CONVERSATION_TO_USER_DATA_MAP;
  payload: string;
}

export interface AddConversationUserNicknamesMap {
  type: typeof MessageActions.ADD_CONVERSATION_USER_NICKNAMES_MAP;
  payload: AddUserNicknameMap;
}

export interface GetConversationUsersStart {
  type: typeof MessageActions.GET_CONVERSATION_USERS_START;
  payload: string;
}

export interface GetConversationUsersSuccess {
  type: typeof MessageActions.GET_CONVERSATION_USERS_SUCCESS;
  payload: MessageUsersResponse;
}

export interface GetConversationUsersFailure {
  type: typeof MessageActions.GET_CONVERSATION_USERS_FAILURE;
  payload: MessageError;
}

export interface SetOldestMessageForConversation {
  type: typeof MessageActions.SET_OLDEST_MESSAGE_FOR_CONVERSATION;
  payload: OldestMessageForConvo;
}

export interface SetStopFetchingMessagesForConversation {
  type: typeof MessageActions.SET_STOP_FETCHING_MESSAGES_FOR_CONVERSATION;
  payload: string;
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
  | UpdateMessageLastSeenBy
  | UpdateMessageStatus
  | AddUserToConvoUsersArray
  | RemoveMessageFromConversation
  | PermanentlyRemoveMessageForUser
  | RemoveUserFromConvoUsersArray
  | ResetConvoUsersArray
  | ClearJoinedConvosArray
  | AddToConversationToUserDataMap
  | RemoveFromConversationToUserDataMap
  | AddConversationUserNicknamesMap
  | GetConversationUsersStart
  | GetConversationUsersSuccess
  | GetConversationUsersFailure
  | SetOldestMessageForConversation
  | SetStopFetchingMessagesForConversation;
