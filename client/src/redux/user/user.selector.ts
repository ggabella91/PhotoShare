import { createSelector } from 'reselect';

import { UserState } from './user.reducer';

const selectUser = (state: any) => state.user;

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
