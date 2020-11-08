import { Post, PostError, PostActions, PostActionTypes } from './post.types';

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
