import {
  takeLatest,
  takeEvery,
  put,
  all,
  call,
  PutEffect,
  AllEffect,
} from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';
import { ActionPattern } from '@redux-saga/types';

import {
  Post,
  ReactionReq,
  ReactionRequestType,
  GetPostReactionsReq,
  DataRequestType,
  FileRequestType,
  PostDataReq,
  PostFileReq,
  ArchivePostReq,
  DeleteReactionReq,
  PostActions,
  UserType,
  EditPostDetailsReq,
  Reaction,
  SinglePostDataReq,
  PostError,
  PostsWithHashtagReq,
  Location,
  PostActionTypes,
} from './post.types';

import {
  createPostSuccess,
  createPostFailure,
  createPostReactionSuccess,
  createPostReactionFailure,
  updateProfilePhotoSuccess,
  updateProfilePhotoFailure,
  addToPostDataArray,
  addPostDataToFeedArray,
  getPostDataFailure,
  getPostReactionsSuccess,
  getFeedPostReactionsSuccess,
  getPostReactionsFailure,
  getPostFileSuccess,
  getProfilePhotoFileSuccess,
  getPostFileFailure,
  archivePostSuccess,
  archivePostFailure,
  deleteReactionSuccess,
  deleteReactionFailure,
  getOtherUserProfilePhotoFileSuccess,
  getUserPhotoForFollowArraySuccess,
  getUserPhotoForSuggestionArraySuccess,
  getUserPhotoForReactorArraySuccess,
  setPostMetaDataForUser,
  getFeedPostFileSuccess,
  getUserPhotoForFeedReactorArraySuccess,
  editPostDetailsSuccess,
  editPostDetailsFailure,
  getSinglePostDataSuccess,
  getSinglePostDataFailure,
  setPostMetaDataForHashtag,
  getLocationsSuggestionsSuccess,
  getLocationsSuggestionsFailure,
  getMapBoxAccessTokenSuccess,
  getMapBoxAccessTokenFailure,
} from './post.actions';

import axios, { AxiosResponse } from 'axios';

type PostSaga<Args extends any[] = any[]> = (...args: Args) => Generator<
  | Promise<AxiosResponse<any>>
  | PutEffect<PostActionTypes>
  | AllEffect<PutEffect<PostActionTypes>>,
  void,
  {
    data: any;
  }
>;

export function* createPost({ payload: post }: { payload: FormData }) {
  try {
    const { data } = yield axios.post('/api/posts/new', post);

    yield put(createPostSuccess(data));
  } catch (err) {
    yield put(createPostFailure(err as PostError));
  }
}

export function* createPostReaction({
  payload: reactionReq,
}: {
  payload: ReactionReq;
}) {
  try {
    const { data }: { data: Reaction } = yield axios.post(
      '/api/reactions/new',
      reactionReq
    );

    yield put(
      createPostReactionSuccess({
        reactionId: data.id,
        likedPost: data.likedPost,
        message: '',
        postId: data.postId,
      })
    );
  } catch (err) {
    yield put(createPostReactionFailure(err as PostError));
  }
}

export function* updateProfilePhoto({ payload: photo }: { payload: FormData }) {
  try {
    const { data } = yield axios.post('/api/posts/profilePhoto', photo);

    yield put(updateProfilePhotoSuccess(data));
  } catch (err) {
    yield put(updateProfilePhotoFailure(err as PostError));
  }
}

export function* getPostData({
  payload: { userId, dataReqType, pageToShow, limit },
}: {
  payload: PostDataReq;
}) {
  try {
    const { data }: { data: { posts: Post[]; queryLength?: number } } =
      yield axios.get(
        `/api/posts/data?userId=${userId}&pageToShow=${pageToShow}&limit=${limit}`
      );

    if (dataReqType === DataRequestType.single) {
      if (data.queryLength) {
        yield all([
          put(addToPostDataArray(data.posts)),
          put(
            setPostMetaDataForUser({
              queryLength: data.queryLength,
              userId: data.posts[0].userId,
            })
          ),
        ]);
      } else {
        yield put(addToPostDataArray(data.posts));
      }
    } else if (dataReqType === DataRequestType.feed) {
      if (data.queryLength) {
        yield all([
          put(addPostDataToFeedArray(data.posts)),
          put(
            setPostMetaDataForUser({
              queryLength: data.queryLength,
              userId: data.posts[0].userId,
            })
          ),
        ]);
      } else {
        yield put(addPostDataToFeedArray(data.posts));
      }
    }
  } catch (err) {
    yield put(getPostDataFailure(err as PostError));
  }
}

export function* getPostsWithHashtag({
  payload: { hashtag, pageToShow, limit },
}: {
  payload: PostsWithHashtagReq;
}) {
  try {
    const {
      data,
    }: { data: { postsWithHashtag: Post[]; queryLength?: number } } =
      yield axios.get(
        `/api/posts/hashtags/${hashtag}?pageToShow=${pageToShow}&limit=${limit}`
      );

    if (data.queryLength) {
      yield all([
        put(addToPostDataArray(data.postsWithHashtag)),
        put(
          setPostMetaDataForHashtag({
            queryLength: data.queryLength,
            hashtag,
          })
        ),
      ]);
    } else {
      yield put(addToPostDataArray(data.postsWithHashtag));
    }
  } catch (err) {
    yield put(getPostDataFailure(err as PostError));
  }
}

export function* getPostReactions({
  payload: { postId, reactionReqType },
}: {
  payload: GetPostReactionsReq;
}) {
  try {
    const { data } = yield axios.get(`/api/reactions/${postId}`);

    if (reactionReqType === ReactionRequestType.singlePost) {
      yield put(getPostReactionsSuccess(data));
    } else if (reactionReqType === ReactionRequestType.feedPost) {
      yield put(getFeedPostReactionsSuccess(data));
    }
  } catch (err) {
    yield put(getPostReactionsFailure(err as PostError));
  }
}

export function* getPostFile({
  payload: { s3Key, bucket, user, fileRequestType },
}: {
  payload: PostFileReq;
}) {
  try {
    const { data } = yield axios.get(
      `/api/posts/files?s3Key=${s3Key}&bucket=${bucket}`
    );

    if (bucket === 'photo-share-app' || bucket === 'photo-share-app-dev') {
      if (fileRequestType === FileRequestType.singlePost) {
        yield put(getPostFileSuccess({ s3Key, fileString: data }));
      } else if (fileRequestType === FileRequestType.feedPost) {
        yield put(getFeedPostFileSuccess({ s3Key, fileString: data }));
      }
    } else if (
      bucket === 'photo-share-app-profile-photos' ||
      bucket === 'photo-share-app-profile-photos-dev'
    ) {
      if (user === UserType.self) {
        yield put(getProfilePhotoFileSuccess({ s3Key, fileString: data }));
      } else if (user === UserType.other) {
        yield put(
          getOtherUserProfilePhotoFileSuccess({ s3Key, fileString: data })
        );
      } else if (user === UserType.followArray) {
        yield put(
          getUserPhotoForFollowArraySuccess({ s3Key, fileString: data })
        );
      } else if (user === UserType.suggestionArray) {
        yield put(
          getUserPhotoForSuggestionArraySuccess({ s3Key, fileString: data })
        );
      } else if (
        fileRequestType === FileRequestType.singlePost &&
        user === UserType.postReactorsArray
      ) {
        yield put(
          getUserPhotoForReactorArraySuccess({ s3Key, fileString: data })
        );
      } else if (
        fileRequestType === FileRequestType.feedPost &&
        user === UserType.postReactorsArray
      ) {
        yield put(
          getUserPhotoForFeedReactorArraySuccess({ s3Key, fileString: data })
        );
      }
    }
  } catch (err) {
    yield put(getPostFileFailure(err as PostError));
  }
}

export function* archivePost({
  payload: { postId, s3Key },
}: {
  payload: ArchivePostReq;
}) {
  try {
    const { data } = yield axios.delete(`/api/posts/${postId}`, {
      data: {
        s3Key,
      },
    });

    yield put(archivePostSuccess(data.message));
  } catch (err) {
    yield put(archivePostFailure(err as PostError));
  }
}

export function* deleteReaction({
  payload: deleteReactionReq,
}: {
  payload: DeleteReactionReq;
}) {
  try {
    const { data } = yield axios.delete(`/api/reactions`, {
      data: deleteReactionReq,
    });

    if (deleteReactionReq.isLikeRemoval) {
      yield put(
        deleteReactionSuccess({
          reactionId: data.reactionId,
          message: 'Like removed successfully!',
          postId: deleteReactionReq.postId,
        })
      );
    } else {
      yield put(
        deleteReactionSuccess({
          reactionId: data.reactionId,
          message: 'Comment removed successfully!',
          postId: deleteReactionReq.postId,
        })
      );
    }
  } catch (err) {
    yield put(deleteReactionFailure(err as PostError));
  }
}

export function* editPostDetails({
  payload: { postId, caption, location },
}: {
  payload: EditPostDetailsReq;
}) {
  try {
    const { data }: { data: Post } = yield axios.patch(`/api/posts/${postId}`, {
      caption,
      location,
    });

    yield put(editPostDetailsSuccess(data));
  } catch (err) {
    yield put(editPostDetailsFailure(err as PostError));
  }
}

export function* getSinglePostData({
  payload: { postId },
}: {
  payload: SinglePostDataReq;
}) {
  try {
    const { data }: { data: Post } = yield axios.get(
      `/api/posts/data/${postId}`
    );

    yield put(getSinglePostDataSuccess(data));
  } catch (err) {
    yield put(getSinglePostDataFailure(err as PostError));
  }
}

export function* getLocationsSuggestions({
  payload: location,
}: {
  payload: string;
}) {
  try {
    const { data: locationsSuggestions }: { data: Location[] } =
      yield axios.get(`/api/posts/locations/${location}`);

    yield put(getLocationsSuggestionsSuccess(locationsSuggestions));
  } catch (err) {
    yield put(getLocationsSuggestionsFailure(err as PostError));
  }
}

export function* getMapBoxAccessToken() {
  try {
    const { data: mapBoxAccessToken }: { data: string } = yield axios.get(
      '/api/posts/mapbox/api-access-token'
    );

    yield put(getMapBoxAccessTokenSuccess(mapBoxAccessToken));
  } catch (err) {
    yield put(getMapBoxAccessTokenFailure(err as PostError));
  }
}

export function* onCreatePostStart(): SagaIterator {
  yield takeEvery<ActionPattern, PostSaga>(
    PostActions.CREATE_POST_START,
    createPost
  );
}

export function* onCreatePostReactionStart(): SagaIterator {
  yield takeLatest<ActionPattern, PostSaga>(
    PostActions.CREATE_POST_REACTION_START,
    createPostReaction
  );
}

export function* onUpdateProfilePhotoStart(): SagaIterator {
  yield takeLatest<ActionPattern, PostSaga>(
    PostActions.UPDATE_PROFILE_PHOTO_START,
    updateProfilePhoto
  );
}

export function* onGetPostDataStart(): SagaIterator {
  yield takeEvery<ActionPattern, PostSaga>(
    PostActions.GET_POST_DATA_START,
    getPostData
  );
}

export function* onGetPostsWithHashtagStart(): SagaIterator {
  yield takeEvery<ActionPattern, PostSaga>(
    PostActions.GET_POSTS_WITH_HASHTAG_START,
    getPostsWithHashtag
  );
}

export function* onGetPostReactionsStart(): SagaIterator {
  yield takeEvery<ActionPattern, PostSaga>(
    PostActions.GET_POST_REACTIONS_START,
    getPostReactions
  );
}

export function* onGetPostFileStart(): SagaIterator {
  yield takeEvery<ActionPattern, PostSaga>(
    PostActions.GET_POST_FILE_START,
    getPostFile
  );
}

export function* onArchivePostStart(): SagaIterator {
  yield takeLatest<ActionPattern, PostSaga>(
    PostActions.ARCHIVE_POST_START,
    archivePost
  );
}

export function* onDeleteReactionStart(): SagaIterator {
  yield takeLatest<ActionPattern, PostSaga>(
    PostActions.DELETE_REACTION_START,
    deleteReaction
  );
}

export function* onEditPostDetailsStart(): SagaIterator {
  yield takeLatest<ActionPattern, PostSaga>(
    PostActions.EDIT_POST_DETAILS_START,
    editPostDetails
  );
}

export function* onGetSinglePostDataStart(): SagaIterator {
  yield takeLatest<ActionPattern, PostSaga>(
    PostActions.GET_SINGLE_POST_DATA_START,
    getSinglePostData
  );
}

export function* onGetLocationsSuggestionsStart(): SagaIterator {
  yield takeLatest<ActionPattern, PostSaga>(
    PostActions.GET_LOCATIONS_SUGGESTIONS_START,
    getLocationsSuggestions
  );
}

export function* onGetMapBoxAccessTokenStart(): SagaIterator {
  yield takeLatest<ActionPattern, PostSaga>(
    PostActions.GET_MAPBOX_TOKEN_START,
    getMapBoxAccessToken
  );
}

export function* postSagas(): SagaIterator {
  yield all([
    call(onCreatePostStart),
    call(onCreatePostReactionStart),
    call(onUpdateProfilePhotoStart),
    call(onGetPostDataStart),
    call(onGetPostsWithHashtagStart),
    call(onGetPostReactionsStart),
    call(onGetPostFileStart),
    call(onArchivePostStart),
    call(onDeleteReactionStart),
    call(onEditPostDetailsStart),
    call(onGetSinglePostDataStart),
    call(onGetLocationsSuggestionsStart),
    call(onGetMapBoxAccessTokenStart),
  ]);
}
