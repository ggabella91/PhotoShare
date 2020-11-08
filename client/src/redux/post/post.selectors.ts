import { createSelector } from 'reselect';

import { AppState } from '../root-reducer';
import { PostState } from './post.types';

const selectPostState = (state: AppState): PostState => state.post;

export const selectPosts = createSelector(
  [selectPostState],
  (postState: PostState) => postState.posts
);

export const selectPostError = createSelector(
  [selectPostState],
  (postState: PostState) => postState.postError
);

export const selectPostConfirm = createSelector(
  [selectPostState],
  (postState: PostState) => postState.postConfirm
);
