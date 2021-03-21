export enum PostActions {
  CREATE_POST_START = 'CREATE_POST_START',
  CREATE_POST_SUCCESS = 'CREATE_POST_SUCCESS',
  CREATE_POST_FAILURE = 'CREATE_POST_FAILURE',
  UPDATE_PROFILE_PHOTO_START = 'UPDATE_PROFILE_PHOTO_START',
  UPDATE_PROFILE_PHOTO_SUCCESS = 'UPDATE_PROFILE_PHOTO_SUCCESS',
  UPDATE_PROFILE_PHOTO_FAILURE = 'UPDATE_PROFILE_PHOTO_FAILURE',
  CLEAR_POST_STATUSES = 'CLEAR_POST_STATUSES',
  CLEAR_PROFILE_PHOTO_STATUSES = 'CLEAR_PHOTO_STATUSES',
  GET_POST_DATA_START = 'GET_POST_DATA_START',
  GET_POST_DATA_SUCCESS = 'GET_POST_DATA_SUCCESS',
  ADD_POST_DATA_TO_FEED_ARRAY = 'ADD_POST_DATA_TO_FEED_ARRAY',
  GET_POST_DATA_FAILURE = 'GET_POST_DATA_FAILURE',
  GET_POST_FILE_START = 'GET_POST_FILE_START',
  GET_POST_FILE_SUCCESS = 'GET_POST_FILE_SUCCESS',
  GET_PROFILE_PHOTO_FILE_SUCCESS = 'GET_PROFILE_PHOTO_FILE_SUCCESS',
  GET_POST_FILE_FAILURE = 'GET_POST_FILE_FAILURE',
  ARCHIVE_POST_START = 'ARCHIVE_POST_START',
  ARCHIVE_POST_SUCCESS = 'ARCHIVE_POST_SUCCESS',
  ARCHIVE_POST_FAILURE = 'ARCHIVE_POST_FAILURE',
  CLEAR_ARCHIVE_POST_STATUSES = 'CLEAR_ARCHIVE_POST_STATUSES',
  GET_OTHER_USER_PROFILE_PHOTO_FILE_SUCCESS = 'GET_OTHER_USER_PROFILE_PHOTO_FILE_SUCCESS',
  GET_USER_PHOTO_FOR_ARRAY_SUCCESS = 'GET_USER_PHOTO_FOR_ARRAY_SUCCESS',
  CLEAR_USERS_PHOTO_FILE_ARRAY = 'CLEAR_USERS_PHOTO_FILE_ARRAY',
  CLEAR_POST_FILES = 'CLEAR_POST_FILES',
  CLEAR_POST_STATE = 'CLEAR_POST_STATE',
}

export interface PostError {
  statusCode: number;
  message: string;
}

export interface Post {
  fileName: string;
  caption?: string;
  postLocation?: string;
  createdAt: Date;
  id: string;
  s3Key: string;
  s3ObjectURL: string;
  userId: string;
}

export enum UserType {
  self = 'self',
  other = 'other',
  usersArray = 'usersArray',
}

export enum DataRequestType {
  single = 'single',
  feed = 'feed',
}

export interface PostDataReq {
  userId: string;
  dataReqType: DataRequestType;
}

export interface PostFileReq {
  s3Key: string;
  bucket: string;
  user: UserType;
}

export interface PostFile {
  s3Key: string;
  fileString: string;
}

export interface ArchivePostReq {
  postId: string;
  s3Key: string;
}

export interface PostState {
  postData: Post[] | null;
  postDataFeedArray: Post[][];
  postFiles: PostFile[];
  getPostDataError: PostError | null;
  getPostDataConfirm: string | null;
  getPostFileError: PostError | null;
  getPostFileConfirm: string | null;
  postError: PostError | null;
  postConfirm: string | null;
  profilePhotoKey: string | null;
  profilePhotoFile: string | null;
  profilePhotoError: PostError | null;
  profilePhotoConfirm: string | null;
  archivePostConfirm: string | null;
  archivePostError: PostError | null;
  otherUserProfilePhotoFile: string | null;
  usersProfilePhotoFileArray: PostFile[] | null;
  usersProfilePhotoConfirm: string | null;
}

export interface CreatePostStart {
  type: typeof PostActions.CREATE_POST_START;
  payload: FormData;
}

export interface CreatePostSuccess {
  type: typeof PostActions.CREATE_POST_SUCCESS;
  payload: Post;
}

export interface CreatePostFailure {
  type: typeof PostActions.CREATE_POST_FAILURE;
  payload: PostError;
}

export interface ClearPostStatuses {
  type: typeof PostActions.CLEAR_POST_STATUSES;
  payload: null;
}

export interface UpdateProfilePhotoStart {
  type: typeof PostActions.UPDATE_PROFILE_PHOTO_START;
  payload: FormData;
}

export interface UpdateProfilePhotoSuccess {
  type: typeof PostActions.UPDATE_PROFILE_PHOTO_SUCCESS;
  payload: Post;
}

export interface UpdateProfilePhotoFailure {
  type: typeof PostActions.UPDATE_PROFILE_PHOTO_FAILURE;
  payload: PostError;
}

export interface ClearProfilePhotoStatuses {
  type: typeof PostActions.CLEAR_PROFILE_PHOTO_STATUSES;
  payload: null;
}

export interface GetPostDataStart {
  type: typeof PostActions.GET_POST_DATA_START;
  payload: PostDataReq;
}

export interface GetPostDataSuccess {
  type: typeof PostActions.GET_POST_DATA_SUCCESS;
  payload: Post[];
}

export interface AddPostDataToFeedArray {
  type: typeof PostActions.ADD_POST_DATA_TO_FEED_ARRAY;
  payload: Post[];
}

export interface GetPostDataFailure {
  type: typeof PostActions.GET_POST_DATA_FAILURE;
  payload: PostError;
}

export interface GetPostFileStart {
  type: typeof PostActions.GET_POST_FILE_START;
  payload: PostFileReq;
}

export interface GetPostFileSuccess {
  type: typeof PostActions.GET_POST_FILE_SUCCESS;
  payload: PostFile;
}

export interface GetProfilePhotoFileSuccess {
  type: typeof PostActions.GET_PROFILE_PHOTO_FILE_SUCCESS;
  payload: PostFile;
}

export interface GetPostFileFailure {
  type: typeof PostActions.GET_POST_FILE_FAILURE;
  payload: PostError;
}

export interface ArchivePostStart {
  type: typeof PostActions.ARCHIVE_POST_START;
  payload: ArchivePostReq;
}

export interface ArchivePostSuccess {
  type: typeof PostActions.ARCHIVE_POST_SUCCESS;
  payload: string;
}

export interface ArchivePostFailure {
  type: typeof PostActions.ARCHIVE_POST_FAILURE;
  payload: Error;
}

export interface ClearArchivePostStatuses {
  type: typeof PostActions.CLEAR_ARCHIVE_POST_STATUSES;
  payload: null;
}

export interface GetOtherUserProfilePhotoFileSuccess {
  type: typeof PostActions.GET_OTHER_USER_PROFILE_PHOTO_FILE_SUCCESS;
  payload: string;
}

export interface GetUserPhotoForArraySuccess {
  type: typeof PostActions.GET_USER_PHOTO_FOR_ARRAY_SUCCESS;
  payload: PostFile;
}

export interface ClearUsersPhotoFileArray {
  type: typeof PostActions.CLEAR_USERS_PHOTO_FILE_ARRAY;
  payload: null;
}

export interface ClearPostFiles {
  type: typeof PostActions.CLEAR_POST_FILES;
  payload: null;
}

export interface ClearPostState {
  type: typeof PostActions.CLEAR_POST_STATE;
  payload: null;
}

export type PostActionTypes =
  | CreatePostStart
  | CreatePostSuccess
  | CreatePostFailure
  | ClearPostStatuses
  | UpdateProfilePhotoStart
  | UpdateProfilePhotoSuccess
  | UpdateProfilePhotoFailure
  | ClearProfilePhotoStatuses
  | GetPostDataStart
  | GetPostDataSuccess
  | AddPostDataToFeedArray
  | GetPostDataFailure
  | GetPostFileStart
  | GetPostFileSuccess
  | GetProfilePhotoFileSuccess
  | GetPostFileFailure
  | ArchivePostStart
  | ArchivePostSuccess
  | ArchivePostFailure
  | GetOtherUserProfilePhotoFileSuccess
  | GetUserPhotoForArraySuccess
  | ClearArchivePostStatuses
  | ClearUsersPhotoFileArray
  | ClearPostFiles
  | ClearPostState;
