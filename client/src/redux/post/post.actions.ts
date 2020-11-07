import {
  CreatePost,
  Post,
  PostError,
  PostActions,
  PostActionTypes,
} from './post.types';

export const createPostStart = (postFields: CreatePost): PostActionTypes => ({
  type: PostActions.CREATE_POST_START,
  payload: postFields,
});

export const createPostSuccess = (post: Post): PostActionTypes => ({
  type: PostActions.CREATE_POST_SUCCESS,
  payload: post,
});

export const createPostFailure = (error: PostError): PostActionTypes => ({
  type: PostActions.CREATE_POST_FAILURE,
  payload: error,
});
