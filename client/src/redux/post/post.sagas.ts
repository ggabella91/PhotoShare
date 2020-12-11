import { takeLatest, put, all, call } from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';
import { ActionPattern, Saga } from '@redux-saga/types';

import { PostFileReq, PostFile, PostActions } from './post.types';

import {
  createPostSuccess,
  createPostFailure,
  updateProfilePhotoSuccess,
  updateProfilePhotoFailure,
  getPostDataSuccess,
  getPostDataFailure,
  getPostFileSuccess,
  getProfilePhotoFileSuccess,
  getPostFileFailure,
} from './post.actions';

import axios from 'axios';

export function* createPost({
  payload: post,
}: {
  payload: FormData;
}): SagaIterator {
  try {
    // @ts-ignore
    const { data } = yield axios.post('/api/posts/new', post);

    yield put(createPostSuccess(data));
  } catch (err) {
    yield put(createPostFailure(err));
  }
}

export function* updateProfilePhoto({
  payload: photo,
}: {
  payload: FormData;
}): SagaIterator {
  try {
    // @ts-ignore
    const { data } = yield axios.post('/api/posts/profilePhoto', photo);

    yield put(updateProfilePhotoSuccess(data));
  } catch (err) {
    yield put(updateProfilePhotoFailure(err));
  }
}

export function* getPostData(): SagaIterator {
  try {
    // @ts-ignore
    const { data } = yield axios.get('/api/posts/data');

    yield put(getPostDataSuccess(data));
  } catch (err) {
    yield put(getPostDataFailure(err));
  }
}

export function* getPostFile({
  payload: { s3Key, bucket },
}: {
  payload: PostFileReq;
}): SagaIterator {
  try {
    // @ts-ignore
    const { data } = yield axios.post('/api/posts/files', { s3Key, bucket });

    if (bucket === 'photo-share-app') {
      yield put(getPostFileSuccess({ s3Key, fileString: data }));
    } else if (bucket === 'photo-share-app-profile-photos') {
      yield put(getProfilePhotoFileSuccess(data));
    }
  } catch (err) {
    yield put(getPostFileFailure(err));
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

export function* onGetPostDataStart(): SagaIterator {
  yield takeLatest<ActionPattern, Saga>(
    PostActions.GET_POST_DATA_START,
    getPostData
  );
}

export function* onGetPostFileStart(): SagaIterator {
  yield takeLatest<ActionPattern, Saga>(
    PostActions.GET_POST_FILE_START,
    getPostFile
  );
}

export function* postSagas(): SagaIterator {
  yield all([
    call(onCreatePostStart),
    call(onUpdateProfilePhotoStart),
    call(onGetPostDataStart),
    call(onGetPostFileStart),
  ]);
}
