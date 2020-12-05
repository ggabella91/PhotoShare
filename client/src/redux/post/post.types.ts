export enum PostActions {
  CREATE_POST_START = 'CREATE_POST_START',
  CREATE_POST_SUCCESS = 'CREATE_POST_SUCCESS',
  CREATE_POST_FAILURE = 'CREATE_POST_FAILURE',
  UPDATE_PROFILE_PHOTO_START = 'UPDATE_PROFILE_PHOTO_START',
  UPDATE_PROFILE_PHOTO_SUCCESS = 'UPDATE_PROFILE_PHOTO_SUCCESS',
  UPDATE_PROFILE_PHOTO_FAILURE = 'UPDATE_PROFILE_PHOTO_FAILURE',
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

export interface PostState {
  posts: Post[] | null;
  postError: PostError | null;
  postConfirm: string | null;
  profilePhoto: Post | null;
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

export type PostActionTypes =
  | CreatePostStart
  | CreatePostSuccess
  | CreatePostFailure
  | UpdateProfilePhotoStart
  | UpdateProfilePhotoSuccess
  | UpdateProfilePhotoFailure;
