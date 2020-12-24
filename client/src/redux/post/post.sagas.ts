import {
  takeLatest,
  takeEvery,
  put,
  all,
  call,
  StrictEffect,
} from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';
import { ActionPattern, Saga } from '@redux-saga/types';

import { PostFileReq, PostActions } from './post.types';

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
  archivePostSuccess,
  archivePostFailure,
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

    yield put(getPostDataSuccess(data.posts));
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

    if (bucket === 'photo-share-app' || bucket === 'photo-share-app-dev') {
      yield put(getPostFileSuccess({ s3Key, fileString: data }));
    } else if (
      bucket === 'photo-share-app-profile-photos' ||
      bucket === 'photo-share-app-profile-photos-dev'
    ) {
      yield put(getProfilePhotoFileSuccess(data));
    }
  } catch (err) {
    yield put(getPostFileFailure(err));
  }
}

export function* archivePost({
  payload: postId,
}: {
  payload: string;
}): SagaIterator {
  try {
    // @ts-ignore
    const { data } = yield axios.delete(`/api/posts/${postId}`);

    yield put(archivePostSuccess(data.message));
  } catch (err) {
    yield put(archivePostFailure(err));
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
  yield takeEvery<ActionPattern, Saga>(
    PostActions.GET_POST_FILE_START,
    getPostFile
  );
}

export function* onArchivePostStart(): SagaIterator {
  yield takeLatest<ActionPattern, Saga>(
    PostActions.ARCHIVE_POST_START,
    archivePost
  );
}

export function* postSagas(): SagaIterator {
  yield all([
    call(onCreatePostStart),
    call(onUpdateProfilePhotoStart),
    call(onGetPostDataStart),
    call(onGetPostFileStart),
    call(onArchivePostStart),
  ]);
}
