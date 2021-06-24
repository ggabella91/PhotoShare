import { UserInfoAndOtherData } from '../../components/user-info/user-info.component';
import { PostModalDataToFeed } from '../../components/feed-post-container/feed-post-container.component';

import {
  Post,
  PostDataReq,
  PostFileReq,
  Reaction,
  ReactionReq,
  ArchivePostReq,
  DeleteReactionReq,
  PostFile,
  PostError,
  PostActions,
  PostActionTypes,
  PostMetaData,
} from './post.types';

export const createPostStart = (post: FormData): PostActionTypes => ({
  type: PostActions.CREATE_POST_START,
  payload: post,
});

export const createPostSuccess = (post: Post): PostActionTypes => ({
  type: PostActions.CREATE_POST_SUCCESS,
  payload: post,
});

export const createPostFailure = (error: PostError): PostActionTypes => ({
  type: PostActions.CREATE_POST_FAILURE,
  payload: error,
});

export const createPostReactionStart = (
  reactionReq: ReactionReq
): PostActionTypes => ({
  type: PostActions.CREATE_POST_REACTION_START,
  payload: reactionReq,
});

export const createPostReactionSuccess = (
  reaction: Reaction
): PostActionTypes => ({
  type: PostActions.CREATE_POST_REACTION_SUCCESS,
  payload: reaction,
});

export const createPostReactionFailure = (
  error: PostError
): PostActionTypes => ({
  type: PostActions.CREATE_POST_REACTION_FAILURE,
  payload: error,
});

export const getPostReactionsStart = (postId: string): PostActionTypes => ({
  type: PostActions.GET_POST_REACTIONS_START,
  payload: postId,
});

export const getPostReactionsSuccess = (
  reactions: Reaction[]
): PostActionTypes => ({
  type: PostActions.GET_POST_REACTIONS_SUCCESS,
  payload: reactions,
});

export const getPostReactionsFailure = (error: PostError): PostActionTypes => ({
  type: PostActions.GET_POST_REACTIONS_FAILURE,
  payload: error,
});

export const clearPostStatuses = (): PostActionTypes => ({
  type: PostActions.CLEAR_POST_STATUSES,
  payload: null,
});

export const updateProfilePhotoStart = (photo: FormData): PostActionTypes => ({
  type: PostActions.UPDATE_PROFILE_PHOTO_START,
  payload: photo,
});

export const updateProfilePhotoSuccess = (photo: Post): PostActionTypes => ({
  type: PostActions.UPDATE_PROFILE_PHOTO_SUCCESS,
  payload: photo,
});

export const updateProfilePhotoFailure = (
  error: PostError
): PostActionTypes => ({
  type: PostActions.UPDATE_PROFILE_PHOTO_FAILURE,
  payload: error,
});

export const clearProfilePhotoStatuses = (): PostActionTypes => ({
  type: PostActions.CLEAR_PROFILE_PHOTO_STATUSES,
  payload: null,
});

export const getPostDataStart = (
  postDataReq: PostDataReq
): PostActionTypes => ({
  type: PostActions.GET_POST_DATA_START,
  payload: postDataReq,
});

export const getPostDataSuccess = (postDataArray: Post[]): PostActionTypes => ({
  type: PostActions.GET_POST_DATA_SUCCESS,
  payload: postDataArray,
});

export const addPostDataToFeedArray = (
  postDataArray: Post[]
): PostActionTypes => ({
  type: PostActions.ADD_POST_DATA_TO_FEED_ARRAY,
  payload: postDataArray,
});

export const getPostDataFailure = (error: PostError): PostActionTypes => ({
  type: PostActions.GET_POST_DATA_FAILURE,
  payload: error,
});

export const getPostFileStart = (fileReq: PostFileReq): PostActionTypes => ({
  type: PostActions.GET_POST_FILE_START,
  payload: fileReq,
});

export const getPostFileSuccess = (file: PostFile): PostActionTypes => ({
  type: PostActions.GET_POST_FILE_SUCCESS,
  payload: file,
});

export const getPostFileFailure = (error: PostError): PostActionTypes => ({
  type: PostActions.GET_POST_FILE_FAILURE,
  payload: error,
});

export const getProfilePhotoFileSuccess = (
  file: PostFile
): PostActionTypes => ({
  type: PostActions.GET_PROFILE_PHOTO_FILE_SUCCESS,
  payload: file,
});

export const archivePostStart = (
  archiveReq: ArchivePostReq
): PostActionTypes => ({
  type: PostActions.ARCHIVE_POST_START,
  payload: archiveReq,
});

export const archivePostSuccess = (message: string): PostActionTypes => ({
  type: PostActions.ARCHIVE_POST_SUCCESS,
  payload: message,
});

export const archivePostFailure = (error: Error): PostActionTypes => ({
  type: PostActions.ARCHIVE_POST_FAILURE,
  payload: error,
});

export const deleteReactionStart = (
  deleteReactionReq: DeleteReactionReq
): PostActionTypes => ({
  type: PostActions.DELETE_REACTION_START,
  payload: deleteReactionReq,
});

export const deleteReactionSuccess = (message: string): PostActionTypes => ({
  type: PostActions.DELETE_REACTION_SUCCESS,
  payload: message,
});

export const deleteReactionFailure = (error: PostError): PostActionTypes => ({
  type: PostActions.DELETE_REACTION_FAILURE,
  payload: error,
});

export const getOtherUserProfilePhotoFileSuccess = (
  file: string
): PostActionTypes => ({
  type: PostActions.GET_OTHER_USER_PROFILE_PHOTO_FILE_SUCCESS,
  payload: file,
});

export const getUserPhotoForFollowArraySuccess = (
  postFile: PostFile
): PostActionTypes => ({
  type: PostActions.GET_USER_PHOTO_FOR_FOLLOW_ARRAY_SUCCESS,
  payload: postFile,
});

export const getUserPhotoForSuggestionArraySuccess = (
  postFile: PostFile
): PostActionTypes => ({
  type: PostActions.GET_USER_PHOTO_FOR_SUGGESTION_ARRAY_SUCCESS,
  payload: postFile,
});

export const getUserPhotoForReactorArraySuccess = (
  postFile: PostFile
): PostActionTypes => ({
  type: PostActions.GET_USER_PHOTO_FOR_REACTOR_ARRAY_SUCCESS,
  payload: postFile,
});

export const clearArchivePostStatuses = (): PostActionTypes => ({
  type: PostActions.CLEAR_ARCHIVE_POST_STATUSES,
  payload: null,
});

export const clearFollowPhotoFileArray = (): PostActionTypes => ({
  type: PostActions.CLEAR_FOLLOW_PHOTO_FILE_ARRAY,
  payload: null,
});

export const clearSuggestionPhotoFileArray = (): PostActionTypes => ({
  type: PostActions.CLEAR_SUGGESTION_PHOTO_FILE_ARRAY,
  payload: null,
});

export const clearPostFilesAndData = (): PostActionTypes => ({
  type: PostActions.CLEAR_POST_FILES_AND_DATA,
  payload: null,
});

export const clearPostState = (): PostActionTypes => ({
  type: PostActions.CLEAR_POST_STATE,
  payload: null,
});

export const setCommentToDelete = (
  deleteReactionReq: DeleteReactionReq
): PostActionTypes => ({
  type: PostActions.SET_COMMENT_TO_DELETE,
  payload: deleteReactionReq,
});

export const setShowCommentOptionsModal = (
  showCommentOptionsModal: boolean
): PostActionTypes => ({
  type: PostActions.SET_SHOW_COMMENT_OPTIONS_MODAL,
  payload: showCommentOptionsModal,
});

export const clearPostReactions = (): PostActionTypes => ({
  type: PostActions.CLEAR_POST_REACTIONS,
  payload: null,
});

export const setPostMetaDataForUser = (
  postMetaData: PostMetaData
): PostActionTypes => ({
  type: PostActions.SET_POST_META_DATA_FOR_USER,
  payload: postMetaData,
});

export const setPostLikingUsersArray = (
  postLikingUsersArray: UserInfoAndOtherData[]
): PostActionTypes => ({
  type: PostActions.SET_POST_LIKING_USERS_ARRAY,
  payload: postLikingUsersArray,
});

export const setShowPostLikingUsersModal = (
  showPostLikingUsersModal: boolean
): PostActionTypes => ({
  type: PostActions.SET_SHOW_POST_LIKING_USERS_MODAL,
  payload: showPostLikingUsersModal,
});

export const setFeedPagePostModalData = (
  postModalDataToFeed: PostModalDataToFeed
): PostActionTypes => ({
  type: PostActions.SET_FEED_PAGE_POST_MODAL_DATA,
  payload: postModalDataToFeed,
});

export const setFeedPagePostModalShow = (
  postModalDataShow: boolean
): PostActionTypes => ({
  type: PostActions.SET_FEED_PAGE_POST_MODAL_SHOW,
  payload: postModalDataShow,
});

export const setFeedPagePostOptionsModalShow = (
  postOptionsModalDataShow: boolean
): PostActionTypes => ({
  type: PostActions.SET_FEED_PAGE_POST_OPTIONS_MODAL_SHOW,
  payload: postOptionsModalDataShow,
});

export const setClearFeedPagePostModalState = (
  clearFeedPagePostModalState: boolean
): PostActionTypes => ({
  type: PostActions.SET_CLEAR_FEED_PAGE_POST_MODAL_STATE,
  payload: clearFeedPagePostModalState,
});

// Actions for feed-post-container

export const getFeedPostFileSuccess = (file: PostFile): PostActionTypes => ({
  type: PostActions.GET_FEED_POST_FILE_SUCCESS,
  payload: file,
});

export const getFeedPostReactionsSuccess = (
  reactions: Reaction[]
): PostActionTypes => ({
  type: PostActions.GET_FEED_POST_REACTIONS_SUCCESS,
  payload: reactions,
});

export const getUserPhotoForFeedReactorArraySuccess = (
  postFile: PostFile
): PostActionTypes => ({
  type: PostActions.GET_USER_PHOTO_FOR_FEED_REACTOR_ARRAY_SUCCESS,
  payload: postFile,
});
