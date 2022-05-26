import { createSelector } from 'reselect';

import { AppState } from '../root-reducer';
import { MessageState } from './message.types';

const selectMessageState = (state: AppState): MessageState => state.message;

export const selectMessageUser = createSelector(
  [selectMessageState],
  (messageState: MessageState) => messageState.user
);

export const selectRemoveUserSessionCookieConfirm = createSelector(
  [selectMessageState],
  (messageState: MessageState) => messageState.removeUserSessionCookieConfirm
);

export const selectJoinedCoversations = createSelector(
  [selectMessageUser],
  (user) => user?.joinedConversations || null
);

export const selectUsersArrayForNewConvoReq = createSelector(
  [selectMessageState],
  (messageState: MessageState) => messageState.usersArrayForNewConvoReq
);
