import { createSelector } from 'reselect';

import { AppState } from '../root-reducer';
import { MessageState, ConvoMessages } from './message.types';

const selectMessageState = (state: AppState): MessageState => state.message;

export const selectMessageUser = createSelector(
  [selectMessageState],
  (messageState: MessageState) => messageState.user
);

export const selectRemoveUserSessionCookieConfirm = createSelector(
  [selectMessageState],
  (messageState: MessageState) => messageState.removeUserSessionCookieConfirm
);

export const selectJoinedConversations = createSelector(
  [selectMessageUser],
  (user) => user?.joinedConversations || null
);

export const selectUsersArrayForNewConvoReq = createSelector(
  [selectMessageState],
  (messageState: MessageState) => messageState.usersArrayForNewConvoReq
);

export const selectConversationMessages = createSelector(
  [selectMessageState],
  (messageState: MessageState) => messageState.messages as ConvoMessages[]
);

export const selectIsLoadingMessages = createSelector(
  [selectMessageState],
  (messageState: MessageState) => messageState.isLoadingMessages
);

export const selectConversationToUserDataMap = createSelector(
  [selectMessageState],
  (messageState: MessageState) => messageState.conversationToUserDataMap
);

export const selectConversationUserNicknamesMaps = createSelector(
  [selectMessageState],
  (messageState: MessageState) => messageState.conversationUserNicknamesMaps
);

export const selectConversationMessageUsersMap = createSelector(
  [selectMessageState],
  (messageState: MessageState) => messageState.conversationMessageUsersMap
);

export const selectOldestMessageToConvoMap = createSelector(
  [selectMessageState],
  (messageState: MessageState) => messageState.oldestMessageToConvoMap
);

export const selectStopFetchingMessageForConvoMap = createSelector(
  [selectMessageState],
  (messageState: MessageState) => messageState.stopFetchingMessagesForConvoMap
);
