import { createSelector } from 'reselect';

import { AppState } from '../root-reducer';
import { FollowerState } from './follower.types';

const selectFollowerState = (state: AppState): FollowerState => state.follower;

export const selectFollowers = createSelector(
  [selectFollowerState],
  (followerState: FollowerState) => followerState.followers
);

export const selectUsersFollowing = createSelector(
  [selectFollowerState],
  (followerState: FollowerState) => followerState.usersFollowing
);

export const selectFollowConfirm = createSelector(
  [selectFollowerState],
  (followerState: FollowerState) => followerState.followConfirm
);

export const selectFollowError = createSelector(
  [selectFollowerState],
  (followerState: FollowerState) => followerState.followError
);

export const selectGetFollowersConfirm = createSelector(
  [selectFollowerState],
  (followerState: FollowerState) => followerState.getFollowersConfirm
);

export const selectGetFollowersError = createSelector(
  [selectFollowerState],
  (followerState: FollowerState) => followerState.getFollowersError
);

export const selectGetUsersFollowingConfirm = createSelector(
  [selectFollowerState],
  (followerState: FollowerState) => followerState.getUsersFollowingConfirm
);

export const selectGetUsersFollowingError = createSelector(
  [selectFollowerState],
  (followerState: FollowerState) => followerState.getUsersFollowingError
);
