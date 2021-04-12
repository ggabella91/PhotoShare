import { takeLatest, takeEvery, put, all, call } from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';
import { ActionPattern, Saga } from '@redux-saga/types';

import {
  Post,
  Reaction,
  ReactionReq,
  DataRequestType,
  PostDataReq,
  PostFileReq,
  ArchivePostReq,
  PostActions,
  UserType,
} from './post.types';

import {
  createPostSuccess,
  createPostFailure,
  createPostReactionSuccess,
  createPostReactionFailure,
  updateProfilePhotoSuccess,
  updateProfilePhotoFailure,
  getPostDataSuccess,
  addPostDataToFeedArray,
  getPostDataFailure,
  getPostReactionsSuccess,
  getPostReactionsFailure,
  getPostFileSuccess,
  getProfilePhotoFileSuccess,
  getPostFileFailure,
  archivePostSuccess,
  archivePostFailure,
  getOtherUserProfilePhotoFileSuccess,
  getUserPhotoForFollowArraySuccess,
  getUserPhotoForSuggestionArraySuccess,
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

export function* createPostReaction({
  payload: reactionReq,
}: {
  payload: ReactionReq;
}): any {
  try {
    const { data } = yield axios.post('/api/posts/reaction', reactionReq);

    yield put(createPostReactionSuccess(data));
  } catch (err) {
    yield put(createPostReactionFailure(err));
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

export function* getPostData({
  payload: { userId, dataReqType },
}: {
  payload: PostDataReq;
}): any {
  try {
    const { data }: { data: Post[] } = yield axios.post('/api/posts/data', {
      userId,
    });

    if (dataReqType === DataRequestType.single) {
      yield put(getPostDataSuccess(data));
    } else if (dataReqType === DataRequestType.feed) {
      yield put(addPostDataToFeedArray(data));
    }
  } catch (err) {
    yield put(getPostDataFailure(err));
  }
}

export function* getPostReactions({
  payload: postId,
}: {
  payload: string;
}): any {
  try {
    const { data } = yield axios.post('/api/posts/reaction', { postId });

    yield put(getPostReactionsSuccess(data));
  } catch (err) {
    yield put(getPostReactionsFailure(err));
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
      } else if (user === UserType.followArray) {
        yield put(
          getUserPhotoForFollowArraySuccess({ s3Key, fileString: data })
        );
      } else if (user === UserType.suggestionArray) {
        yield put(
          getUserPhotoForSuggestionArraySuccess({ s3Key, fileString: data })
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

export function* onCreatePostReactionStart(): SagaIterator {
  yield takeLatest<ActionPattern, Saga>(
    PostActions.CREATE_POST_REACTION_START,
    createPostReaction
  );
}

export function* onUpdateProfilePhotoStart(): SagaIterator {
  yield takeLatest<ActionPattern, Saga>(
    PostActions.UPDATE_PROFILE_PHOTO_START,
    updateProfilePhoto
  );
}

export function* onGetPostDataStart(): SagaIterator {
  yield takeEvery<ActionPattern, Saga>(
    PostActions.GET_POST_DATA_START,
    getPostData
  );
}

export function* onGetPostReactionsStart(): SagaIterator {
  yield takeLatest<ActionPattern, Saga>(
    PostActions.GET_POST_REACTIONS_START,
    getPostReactions
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
    call(onCreatePostReactionStart),
    call(onUpdateProfilePhotoStart),
    call(onGetPostDataStart),
    call(onGetPostReactionsStart),
    call(onGetPostFileStart),
    call(onArchivePostStart),
  ]);
}
