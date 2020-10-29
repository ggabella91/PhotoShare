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
