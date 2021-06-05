import { createSelector } from 'reselect';

import { AppState } from '../root-reducer';
import { PostState } from './post.types';

const selectPostState = (state: AppState): PostState => state.post;

export const selectPostData = createSelector(
  [selectPostState],
  (postState: PostState) => postState.postData
);

export const selectPostDataFeedArray = createSelector(
  [selectPostState],
  (postState: PostState) => postState.postDataFeedArray
);

export const selectPostReactionsArray = createSelector(
  [selectPostState],
  (postState: PostState) => postState.postReactionsArray
);

export const selectPostReactionConfirm = createSelector(
  [selectPostState],
  (postState: PostState) => postState.postReactionConfirm
);

export const selectPostReactionError = createSelector(
  [selectPostState],
  (postState: PostState) => postState.postReactionError
);

export const selectGetPostDataError = createSelector(
  [selectPostState],
  (postState: PostState) => postState.getPostDataError
);

export const selectGetPostDataConfirm = createSelector(
  [selectPostState],
  (postState: PostState) => postState.getPostDataConfirm
);

export const selectGetPostFileError = createSelector(
  [selectPostState],
  (postState: PostState) => postState.getPostFileError
);

export const selectGetPostFileConfirm = createSelector(
  [selectPostState],
  (postState: PostState) => postState.getPostFileConfirm
);

export const selectGetPostReactionsError = createSelector(
  [selectPostState],
  (postState: PostState) => postState.getPostReactionsError
);

export const selectGetPostReactionsConfirm = createSelector(
  [selectPostState],
  (postState: PostState) => postState.getPostReactionsConfirm
);

export const selectPostFiles = createSelector(
  [selectPostState],
  (postState: PostState) => postState.postFiles
);

export const selectPostError = createSelector(
  [selectPostState],
  (postState: PostState) => postState.postError
);

export const selectPostConfirm = createSelector(
  [selectPostState],
  (postState: PostState) => postState.postConfirm
);

export const selectProfilePhotoKey = createSelector(
  [selectPostState],
  (postState: PostState) => postState.profilePhotoKey
);

export const selectProfilePhotoFile = createSelector(
  [selectPostState],
  (postState: PostState) => postState.profilePhotoFile
);

export const selectOtherUserProfilePhotoFile = createSelector(
  [selectPostState],
  (postState: PostState) => postState.otherUserProfilePhotoFile
);

export const selectFollowPhotoFileArray = createSelector(
  [selectPostState],
  (postState: PostState) => postState.followPhotoFileArray
);

export const selectSuggestionPhotoFileArray = createSelector(
  [selectPostState],
  (postState: PostState) => postState.suggestionPhotoFileArray
);

export const selectReactorPhotoFileArray = createSelector(
  [selectPostState],
  (postState: PostState) => postState.reactorPhotoFileArray
);

export const selectUsersProfilePhotoConfirm = createSelector(
  [selectPostState],
  (postState: PostState) => postState.usersProfilePhotoConfirm
);

export const selectUpdateProfilePhotoError = createSelector(
  [selectPostState],
  (postState: PostState) => postState.profilePhotoError
);

export const selectUpdateProfilePhotoConfirm = createSelector(
  [selectPostState],
  (postState: PostState) => postState.profilePhotoConfirm
);

export const selectArchivePostError = createSelector(
  [selectPostState],
  (postState: PostState) => postState.archivePostError
);

export const selectArchivePostConfirm = createSelector(
  [selectPostState],
  (postState: PostState) => postState.archivePostConfirm
);

export const selectDeleteReactionConfirm = createSelector(
  [selectPostState],
  (postState: PostState) => postState.deleteReactionConfirm
);

export const selectDeleteReactionError = createSelector(
  [selectPostState],
  (postState: PostState) => postState.deleteReactionError
);

export const selectCommentToDelete = createSelector(
  [selectPostState],
  (postState: PostState) => postState.commentToDelete
);

export const selectShowCommentOptionsModal = createSelector(
  [selectPostState],
  (postState: PostState) => postState.showCommentOptionsModal
);

export const selectIsLoadingPostData = createSelector(
  [selectPostState],
  (postState: PostState) => postState.isLoadingPostData
);

export const selectPostMetaDataForUser = createSelector(
  [selectPostState],
  (postState: PostState) => postState.postMetaDataForUser
);

export const selectPostLikingUsersArray = createSelector(
  [selectPostState],
  (postState: PostState) => postState.postLikingUsersArray
);
