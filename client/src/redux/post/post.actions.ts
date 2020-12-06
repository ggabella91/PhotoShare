import { fireEvent } from '@testing-library/react';
import {
  Post,
  PostFileReq,
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
