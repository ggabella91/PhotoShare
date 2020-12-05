import { takeLatest, put, all, call } from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';
import { ActionPattern, Saga } from '@redux-saga/types';

import { PostActions } from './post.types';

import {
  createPostSuccess,
  createPostFailure,
  updateProfilePhotoSuccess,
  updateProfilePhotoFailure,
} from './post.actions';

import axios from 'axios';

export function* createPost({
  payload: post,
}: {
  payload: FormData;
}): SagaIterator {
  try {
    // @ts-ignore
    const { data } = yield axios.post('/api/posts', post);

    yield put(createPostSuccess(data));
  } catch (err) {
    yield put(createPostFailure(err));
  }
}

export function* updateProfilePhoto({
  payload: post,
}: {
  payload: FormData;
}): SagaIterator {
  try {
    // @ts-ignore
    const { data } = yield axios.post('/api/profilePhoto', post);

    yield put(updateProfilePhotoSuccess(data));
  } catch (err) {
    yield put(updateProfilePhotoFailure(err));
  }
}

export function* onCreatePostStart(): SagaIterator {
  yield takeLatest<ActionPattern, Saga>(
    PostActions.CREATE_POST_START,
    createPost
  );
}

export function* onUpdateProfilePhotoStart(): SagaIterator {
  yield takeLatest<ActionPattern, Saga>(
    PostActions.UPDATE_PROFILE_PHOTO_START,
    updateProfilePhoto
  );
}

export function* postSagas(): SagaIterator {
  yield all([call(onCreatePostStart), call(onUpdateProfilePhotoStart)]);
}
