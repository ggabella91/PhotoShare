import { createSelector } from 'reselect';

import { AppState } from '../root-reducer';
import { FollowerState } from './follower.types';

const selectFollowerState = (state: AppState): FollowerState => state.follower;

export const selectFollowers = createSelector(
  [selectFollowerState],
  (followerState: FollowerState) => followerState.followers
);

export const selectCurrentUserUsersFollowing = createSelector(
  [selectFollowerState],
  (followerState: FollowerState) => followerState.currentUserUsersFollowing
);

export const selectOtherUserUsersFollowing = createSelector(
  [selectFollowerState],
  (followerState: FollowerState) => followerState.otherUserUsersFollowing
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
