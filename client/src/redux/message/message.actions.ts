import {
  Message,
  Conversation,
  GetConvoMessagesReq,
  ConvoMessages,
  MessageError,
  FindOrCreateUserReq,
  MessageActions,
  MessageActionTypes,
  MessageUser,
  ConvoIdAndUserData,
  MessageToRemove,
  MessageToPermanentlyRemoveForUser,
  AddUserNicknameMap,
  MessageUsersResponse,
  MessageLastSeen,
  OldestMessageForConvo,
} from './message.types';

export const findOrCreateUserStart = (
  findOrCreateUserReq: FindOrCreateUserReq
): MessageActionTypes => ({
  type: MessageActions.FIND_OR_CREATE_USER_START,
  payload: findOrCreateUserReq,
});

export const findOrCreateUserSuccess = (
  user: MessageUser
): MessageActionTypes => ({
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
  conversations: Conversation | Conversation[]
): MessageActionTypes => ({
  type: MessageActions.ADD_TO_JOINED_CONVERSATIONS_ARRAY,
  payload: conversations,
});

export const getConvoMessagesStart = (
  getConvoMessagesReq: GetConvoMessagesReq
): MessageActionTypes => ({
  type: MessageActions.GET_CONVO_MESSAGES_START,
  payload: getConvoMessagesReq,
});

export const getConvoMessagesSuccess = (
  convoMessages: ConvoMessages
): MessageActionTypes => ({
  type: MessageActions.GET_CONVO_MESSAGES_SUCCESS,
  payload: convoMessages,
});

export const getConvoMessagesFailure = (
  error: MessageError
): MessageActionTypes => ({
  type: MessageActions.GET_CONVO_MESSAGES_FAILURE,
  payload: error,
});

export const addMessageToConversation = (
  message: Message
): MessageActionTypes => ({
  type: MessageActions.ADD_MESSAGE_TO_CONVERSATION,
  payload: message,
});

export const updateMessageLastSeenBy = (
  messageLastSeen: MessageLastSeen
): MessageActionTypes => ({
  type: MessageActions.UPDATE_MESSAGE_LAST_SEEN_BY,
  payload: messageLastSeen,
});

export const updateMessageStatus = (message: Message): MessageActionTypes => ({
  type: MessageActions.UPDATE_MESSAGE_STATUS,
  payload: message,
});

export const addUserToConvoUsersArray = (
  user: Partial<MessageUser>
): MessageActionTypes => ({
  type: MessageActions.ADD_USER_TO_CONVO_USERS_ARRAY,
  payload: user,
});

export const removeMessageFromConversation = (
  messageToRemove: MessageToRemove
): MessageActionTypes => ({
  type: MessageActions.REMOVE_MESSAGE_FROM_CONVERSATION,
  payload: messageToRemove,
});

export const permanentlyRemoveMessageForUser = (
  messageToPermanentlyRemoveForUser: MessageToPermanentlyRemoveForUser
): MessageActionTypes => ({
  type: MessageActions.PERMANENTLY_REMOVE_MESSAGE_FOR_USER,
  payload: messageToPermanentlyRemoveForUser,
});

export const removeUserFromConvoUsersArray = (
  userId: string
): MessageActionTypes => ({
  type: MessageActions.REMOVE_USER_FROM_CONVO_USERS_ARRAY,
  payload: userId,
});

export const resetConvoUsersArray = (): MessageActionTypes => ({
  type: MessageActions.RESET_CONVO_USERS_ARRAY,
});

export const clearJoinedConvosArray = (): MessageActionTypes => ({
  type: MessageActions.CLEAR_JOINED_CONVOS_ARRAY,
});

export const addToConversationToUserDataMap = (
  convoIdAndUserData: ConvoIdAndUserData
): MessageActionTypes => ({
  type: MessageActions.ADD_TO_CONVERSATION_TO_USER_DATA_MAP,
  payload: convoIdAndUserData,
});

export const removeFromConversationToUserDataMap = (
  conversationId: string
): MessageActionTypes => ({
  type: MessageActions.REMOVE_FROM_CONVERSATION_TO_USER_DATA_MAP,
  payload: conversationId,
});

export const addConversationUserNicknamesMap = (
  addUserNicknameMap: AddUserNicknameMap
): MessageActionTypes => ({
  type: MessageActions.ADD_CONVERSATION_USER_NICKNAMES_MAP,
  payload: addUserNicknameMap,
});

export const getConversationUsersStart = (
  conversationId: string
): MessageActionTypes => ({
  type: MessageActions.GET_CONVERSATION_USERS_START,
  payload: conversationId,
});

export const getConversationUsersSuccess = (
  messageUsers: MessageUsersResponse
): MessageActionTypes => ({
  type: MessageActions.GET_CONVERSATION_USERS_SUCCESS,
  payload: messageUsers,
});

export const getConversationUsersFailure = (
  error: MessageError
): MessageActionTypes => ({
  type: MessageActions.GET_CONVERSATION_USERS_FAILURE,
  payload: error,
});

export const setOldestMessageForConversation = (
  oldestMessageForConvo: OldestMessageForConvo
): MessageActionTypes => ({
  type: MessageActions.SET_OLDEST_MESSAGE_FOR_CONVERSATION,
  payload: oldestMessageForConvo,
});

export const setStopFetchingMessagesForConversation = (
  conversationId: string
): MessageActionTypes => ({
  type: MessageActions.SET_STOP_FETCHING_MESSAGES_FOR_CONVERSATION,
  payload: conversationId,
});
