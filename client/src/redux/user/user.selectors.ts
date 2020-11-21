import { createSelector } from 'reselect';

import { AppState } from '../root-reducer';
import { UserState } from './user.types';

const selectUser = (state: AppState): UserState => state.user;

export const selectCurrentUser = createSelector(
  [selectUser],
  (user: UserState) => user.currentUser
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

export const selectForgotOrResetError = createSelector(
  [selectUser],
  (user: UserState) => user.forgotOrResetError
);

export const selectForgotOrResetConfirm = createSelector(
  [selectUser],
  (user: UserState) => user.forgotOrResetConfirm
);
