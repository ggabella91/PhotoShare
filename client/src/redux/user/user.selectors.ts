import { createSelector } from 'reselect';

import { AppState } from '../root-reducer';
import { UserState } from './user.types';

const selectUser = (state: AppState): UserState => state.user;

export const selectCurrentUser = createSelector(
  [selectUser],
  (user: UserState) => user.currentUser
);

export const selectOtherUser = createSelector(
  [selectUser],
  (user: UserState) => user.otherUser
);

export const selectFollowers = createSelector(
  [selectUser],
  (user: UserState) => user.followers
);

export const selectFollowing = createSelector(
  [selectUser],
  (user: UserState) => user.following
);

export const selectOtherUserError = createSelector(
  [selectUser],
  (user: UserState) => user.otherUserError
);

export const selectUserSuggestions = createSelector(
  [selectUser],
  (user: UserState) => user.userSuggestions
);

export const selectUserSuggestionsConfirm = createSelector(
  [selectUser],
  (user: UserState) => user.userSuggestionsConfirm
);

export const selectUserSuggestionsError = createSelector(
  [selectUser],
  (user: UserState) => user.userSuggestionsError
);

export const selectUserSignUpError = createSelector(
  [selectUser],
  (user: UserState) => user.signUpError
);

export const selectUserSignInOrOutError = createSelector(
  [selectUser],
  (user: UserState) => user.signInOrOutError
);

export const selectChangeInfoConfirm = createSelector(
  [selectUser],
  (user: UserState) => user.changeInfoConfirm
);

export const selectChangeInfoError = createSelector(
  [selectUser],
  (user: UserState) => user.changeInfoError
);

export const selectChangePasswordConfirm = createSelector(
  [selectUser],
  (user: UserState) => user.changePasswordConfirm
);

export const selectChangePasswordError = createSelector(
  [selectUser],
  (user: UserState) => user.changePasswordError
);

export const selectForgotError = createSelector(
  [selectUser],
  (user: UserState) => user.forgotError
);

export const selectForgotConfirm = createSelector(
  [selectUser],
  (user: UserState) => user.forgotConfirm
);

export const selectResetError = createSelector(
  [selectUser],
  (user: UserState) => user.resetError
);

export const selectResetConfirm = createSelector(
  [selectUser],
  (user: UserState) => user.resetConfirm
);
