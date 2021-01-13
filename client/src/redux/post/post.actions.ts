import {
  Post,
  PostFileReq,
  ArchivePostReq,
  PostFile,
  PostError,
  PostActions,
  PostActionTypes,
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

export const getPostDataStart = (): PostActionTypes => ({
  type: PostActions.GET_POST_DATA_START,
  payload: null,
});

export const getPostDataSuccess = (postDataArray: Post[]): PostActionTypes => ({
  type: PostActions.GET_POST_DATA_SUCCESS,
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

export const archivePostStart = (archiveReq: ArchivePostReq) => ({
  type: PostActions.ARCHIVE_POST_START,
  payload: archiveReq,
});

export const archivePostSuccess = (message: string) => ({
  type: PostActions.ARCHIVE_POST_SUCCESS,
  payload: message,
});

export const archivePostFailure = (error: Error) => ({
  type: PostActions.ARCHIVE_POST_FAILURE,
  payload: error,
});

export const getOtherUserProfilePhotoFileSuccess = (file: string) => ({
  type: PostActions.GET_OTHER_USER_PROFILE_PHOTO_FILE_SUCCESS,
  payload: file,
});
