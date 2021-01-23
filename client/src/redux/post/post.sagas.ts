import { takeLatest, takeEvery, put, all, call } from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';
import { ActionPattern, Saga } from '@redux-saga/types';

import {
  Post,
  PostFileReq,
  ArchivePostReq,
  PostActions,
  UserType,
} from './post.types';

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
  getOtherUserProfilePhotoFileSuccess,
  getUserSuggestionProfilePhotoFileSuccess,
} from './post.actions';

import axios from 'axios';

export function* createPost({ payload: post }: { payload: FormData }): any {
  try {
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
}): any {
  try {
    const { data } = yield axios.post('/api/posts/profilePhoto', photo);

    yield put(updateProfilePhotoSuccess(data));
  } catch (err) {
    yield put(updateProfilePhotoFailure(err));
  }
}

export function* getPostData({ payload: userId }: { payload: string }): any {
  try {
    const { data }: { data: Post[] } = yield axios.post('/api/posts/data', {
      userId,
    });

    yield put(getPostDataSuccess(data));
  } catch (err) {
    yield put(getPostDataFailure(err));
  }
}

export function* getPostFile({
  payload: { s3Key, bucket, user },
}: {
  payload: PostFileReq;
}): any {
  try {
    const { data } = yield axios.post('/api/posts/files', {
      s3Key,
      bucket,
    });

    if (bucket === 'photo-share-app' || bucket === 'photo-share-app-dev') {
      yield put(getPostFileSuccess({ s3Key, fileString: data }));
    } else if (
      bucket === 'photo-share-app-profile-photos' ||
      bucket === 'photo-share-app-profile-photos-dev'
    ) {
      if (user === UserType.self) {
        yield put(getProfilePhotoFileSuccess(data));
      } else if (user === UserType.other) {
        yield put(getOtherUserProfilePhotoFileSuccess(data));
      } else if (user === UserType.searchSuggestion) {
        yield put(
          getUserSuggestionProfilePhotoFileSuccess({ s3Key, fileString: data })
        );
      }
    }
  } catch (err) {
    yield put(getPostFileFailure(err));
  }
}

export function* archivePost({
  payload: { postId, s3Key },
}: {
  payload: ArchivePostReq;
}): any {
  try {
    const { data } = yield axios.delete<string>(`/api/posts/${postId}`, {
      data: {
        s3Key,
      },
    });

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
