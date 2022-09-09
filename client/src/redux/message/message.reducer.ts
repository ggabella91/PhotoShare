import { Map } from 'immutable';
import { UserInfoMap } from '../../components/conversation/conversation.component';
import {
  MessageState,
  MessageActions,
  MessageActionTypes,
} from './message.types';

import {
  updateJoinedConversationsArray,
  addConvoMessages,
  addMessage,
  removeUserFromArray,
  updateAndSortJoinedConversationsArray,
  markMessageRemoved,
  markMessagePermanentlyRemovedForUser,
} from './message.utils';

const INITIAL_STATE: MessageState = {
  user: null,
  messages: [],
  isLoadingMessages: false,
  findOrCreateUserError: null,
  removeUserSessionCookieConfirm: null,
  removeUserSessionCookieError: null,
  usersArrayForNewConvoReq: [],
  conversationToUserDataMap: Map<string, UserInfoMap>(),
  conversationUserNicknamesMaps: {},
};

const messageReducer = (
  state = INITIAL_STATE,
  action: MessageActionTypes
): MessageState => {
  switch (action.type) {
    case MessageActions.GET_CONVO_MESSAGES_START:
      return {
        ...state,
        isLoadingMessages: true,
      };
    case MessageActions.FIND_OR_CREATE_USER_SUCCESS:
      return {
        ...state,
        user: action.payload,
        findOrCreateUserError: null,
      };
    case MessageActions.REMOVE_USER_SESSION_COOKIE_SUCCESS:
      return {
        ...state,
        removeUserSessionCookieConfirm: action.payload,
        removeUserSessionCookieError: null,
      };
    case MessageActions.ADD_TO_JOINED_CONVERSATIONS_ARRAY:
      return {
        ...state,
        user: state.user
          ? {
              ...state.user,
              joinedConversations: updateJoinedConversationsArray(
                state.user?.joinedConversations,
                action.payload
              ),
            }
          : null,
      };
    case MessageActions.GET_CONVO_MESSAGES_SUCCESS:
      return {
        ...state,
        messages: addConvoMessages(state.messages, action.payload),
        isLoadingMessages: false,
      };
    case MessageActions.ADD_MESSAGE_TO_CONVERSATION:
      return {
        ...state,
        messages: addMessage(state.messages, action.payload),
        user: state.user
          ? {
              ...state.user,
              joinedConversations: updateAndSortJoinedConversationsArray(
                state.user?.joinedConversations,
                {
                  conversationId: action.payload.conversationId,
                  messageCreatedTime: action.payload.created,
                }
              ),
            }
          : null,
      };
    case MessageActions.ADD_USER_TO_CONVO_USERS_ARRAY:
      return {
        ...state,
        usersArrayForNewConvoReq: [
          ...state.usersArrayForNewConvoReq,
          action.payload,
        ],
      };
    case MessageActions.REMOVE_MESSAGE_FROM_CONVERSATION:
      return {
        ...state,
        messages: markMessageRemoved(state.messages, action.payload),
      };
    case MessageActions.PERMANENTLY_REMOVE_MESSAGE_FOR_USER:
      return {
        ...state,
        messages: markMessagePermanentlyRemovedForUser(
          state.messages,
          action.payload
        ),
      };
    case MessageActions.REMOVE_USER_FROM_CONVO_USERS_ARRAY:
      return {
        ...state,
        usersArrayForNewConvoReq: removeUserFromArray(
          state.usersArrayForNewConvoReq,
          action.payload
        ),
      };
    case MessageActions.ADD_TO_CONVERSATION_TO_USER_DATA_MAP:
      return {
        ...state,
        conversationToUserDataMap: state.conversationToUserDataMap.set(
          action.payload.conversationId,
          action.payload.userData
        ),
      };
    case MessageActions.ADD_CONVERSATION_USER_NICKNAMES_MAP:
      return {
        ...state,
        conversationUserNicknamesMaps: {
          ...state.conversationUserNicknamesMaps,
          [action.payload.conversationId]: action.payload.userNicknameMap,
        },
      };
    case MessageActions.RESET_CONVO_USERS_ARRAY:
      return {
        ...state,
        usersArrayForNewConvoReq: [],
      };
    case MessageActions.CLEAR_JOINED_CONVOS_ARRAY:
      return {
        ...state,
        user: state.user ? { ...state.user, joinedConversations: [] } : null,
      };
    case MessageActions.FIND_OR_CREATE_USER_FAILURE:
      return {
        ...state,
        findOrCreateUserError: action.payload,
      };
    case MessageActions.REMOVE_USER_SESSION_COOKIE_FAILURE:
      return {
        ...state,
        removeUserSessionCookieError: action.payload,
        removeUserSessionCookieConfirm: null,
      };
    case MessageActions.GET_CONVO_MESSAGES_FAILURE:
      return {
        ...state,
        isLoadingMessages: false,
      };
    default:
      return state;
  }
};

export default messageReducer;
