export enum PostActions {
  CREATE_POST_START = 'CREATE_POST_START',
  CREATE_POST_SUCCESS = 'CREATE_POST_SUCCESS',
  CREATE_POST_FAILURE = 'CREATE_POST_FAILURE',
  UPDATE_PROFILE_PHOTO_START = 'UPDATE_PROFILE_PHOTO_START',
  UPDATE_PROFILE_PHOTO_SUCCESS = 'UPDATE_PROFILE_PHOTO_SUCCESS',
  UPDATE_PROFILE_PHOTO_FAILURE = 'UPDATE_PROFILE_PHOTO_FAILURE',
  GET_POST_DATA_START = 'GET_POST_DATA_START',
  GET_POST_DATA_SUCCESS = 'GET_POST_DATA_SUCCESS',
  GET_POST_DATA_FAILURE = 'GET_POST_DATA_FAILURE',
  GET_POST_FILE_START = 'GET_POST_FILE_START',
  GET_POST_FILE_SUCCESS = 'GET_POST_FILE_SUCCESS',
  GET_PROFILE_PHOTO_FILE_SUCCESS = 'GET_PROFILE_PHOTO_FILE_SUCCESS',
  GET_POST_FILE_FAILURE = 'GET_POST_FILE_FAILURE',
}

export interface PostError {
  statusCode: number;
  message: string;
}

export interface Post {
  fileName: string;
  caption?: string;
  createdAt: Date;
  id: string;
  s3Key: string;
  s3ObjectURL: string;
  userId: string;
}

export interface PostFileReq {
  s3Key: string;
  bucket: string;
}

export interface PostFile {
  s3Key: string;
  fileString: string;
}

export interface PostState {
  postData: Post[] | null;
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

export interface GetPostDataStart {
  type: typeof PostActions.GET_POST_DATA_START;
  payload: null;
}

export interface GetPostDataSuccess {
  type: typeof PostActions.GET_POST_DATA_SUCCESS;
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

export type PostActionTypes =
  | CreatePostStart
  | CreatePostSuccess
  | CreatePostFailure
  | UpdateProfilePhotoStart
  | UpdateProfilePhotoSuccess
  | UpdateProfilePhotoFailure
  | GetPostDataStart
  | GetPostDataSuccess
  | GetPostDataFailure
  | GetPostFileStart
  | GetPostFileSuccess
  | GetProfilePhotoFileSuccess
  | GetPostFileFailure;
