import { takeLatest, put, all, call } from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';
import { ActionPattern, Saga } from '@redux-saga/types';

import { CreatePost, Post, PostError, PostActions } from './post.types';

import { createPostSuccess, createPostFailure } from './post.actions';

import axios from 'axios';

export function* createPost({
  payload: post,
}: {
  payload: CreatePost;
}): SagaIterator {
  try {
    // @ts-ignore
    const { data } = yield axios.post('/api/users/signup', {
      post,
    });

    yield put(createPostSuccess(data));
  } catch (err) {
    yield put(createPostFailure(err));
  }
}

export function* onCreatePostStart(): SagaIterator {
  yield takeLatest<ActionPattern, Saga>(
    PostActions.CREATE_POST_START,
    createPost
  );
}

export function* postSagas(): SagaIterator {
  yield all([call(onCreatePostStart)]);
}
