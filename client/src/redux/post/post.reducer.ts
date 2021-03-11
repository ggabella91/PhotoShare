import { PostActions, PostActionTypes, PostState } from './post.types';
import {
  addPostFileToArray,
  addPostDataToFeedArray,
  addSuggestedUserPhotoFileToArray,
} from './post.utils';

const INITIAL_STATE: PostState = {
  postData: null,
  postDataFeedArray: [],
  postFiles: [],
  getPostDataError: null,
  getPostDataConfirm: null,
  getPostFileError: null,
  getPostFileConfirm: null,
  postError: null,
  postConfirm: null,
  profilePhotoKey: null,
  profilePhotoFile: null,
  profilePhotoError: null,
  profilePhotoConfirm: null,
  archivePostConfirm: null,
  archivePostError: null,
  otherUserProfilePhotoFile: null,
  usersProfilePhotoFileArray: null,
  usersProfilePhotoConfirm: null,
};

const postReducer = (state = INITIAL_STATE, action: PostActionTypes) => {
  switch (action.type) {
    case PostActions.UPDATE_PROFILE_PHOTO_SUCCESS:
      return {
        ...state,
        profilePhotoKey: action.payload.s3Key,
        profilePhotoError: null,
        profilePhotoConfirm: 'Profile photo updated!',
      };
    case PostActions.CREATE_POST_SUCCESS:
      return {
        ...state,
        postError: null,
        postConfirm: 'Post uploaded!',
      };
    case PostActions.GET_POST_DATA_SUCCESS:
      return {
        ...state,
        postData: action.payload,
        getPostDataError: null,
        getPostDataConfirm: 'Post data fetched!',
      };
    case PostActions.ADD_POST_DATA_TO_FEED_ARRAY:
      return {
        ...state,
        postDataFeedArray: addPostDataToFeedArray(
          state.postDataFeedArray,
          action.payload
        ),
        getPostDataError: null,
        getPostDataConfirm: 'Post data added to feed array!',
      };
    case PostActions.GET_POST_FILE_SUCCESS:
      return {
        ...state,
        postFiles: addPostFileToArray(state.postFiles, action.payload),
        getPostFileError: null,
        getPostFileConfirm: 'Post file fetched!',
      };
    case PostActions.GET_PROFILE_PHOTO_FILE_SUCCESS:
      return {
        ...state,
        profilePhotoFile: action.payload,
        getPostFileError: null,
        getPostFileConfirm: 'Profile photo file fetched!',
      };
    case PostActions.GET_OTHER_USER_PROFILE_PHOTO_FILE_SUCCESS:
      return {
        ...state,
        otherUserProfilePhotoFile: action.payload,
        getPostFileError: null,
        getPostFileConfirm: 'Profile photo of other user fetched!',
      };
    case PostActions.GET_USER_PHOTO_FOR_ARRAY_SUCCESS:
      return {
        ...state,
        usersProfilePhotoFileArray: addSuggestedUserPhotoFileToArray(
          state.usersProfilePhotoFileArray,
          action.payload
        ),
        getPostFileError: null,
        usersProfilePhotoConfirm: 'User photo added to array!',
      };
    case PostActions.ARCHIVE_POST_SUCCESS:
      return {
        ...state,
        archivePostConfirm: action.payload,
        archivePostError: null,
      };
    case PostActions.UPDATE_PROFILE_PHOTO_FAILURE:
      return {
        ...state,
        profilePhotoError: action.payload,
        profilePhotoConfirm: null,
      };
    case PostActions.CREATE_POST_FAILURE:
      return {
        ...state,
        postError: action.payload,
        postConfirm: null,
      };
    case PostActions.GET_POST_DATA_FAILURE:
      return {
        ...state,
        getPostDataError: action.payload,
        getPostDataConfirm: null,
      };
    case PostActions.GET_POST_FILE_FAILURE:
      return {
        ...state,
        getPostFileError: action.payload,
        getPostFileConfirm: null,
      };
    case PostActions.ARCHIVE_POST_FAILURE:
      return {
        ...state,
        archivePostConfirm: null,
        archivePostError: action.payload,
      };
    case PostActions.CLEAR_POST_STATUSES:
      return {
        ...state,
        postConfirm: null,
        postError: null,
      };
    case PostActions.CLEAR_PROFILE_PHOTO_STATUSES:
      return {
        ...state,
        profilePhotoConfirm: null,
        profilePhotoError: null,
      };
    case PostActions.CLEAR_ARCHIVE_POST_STATUSES:
      return {
        ...state,
        archivePostConfirm: null,
        archivePostError: null,
      };
    case PostActions.CLEAR_USERS_PHOTO_FILE_ARRAY:
      return {
        ...state,
        usersProfilePhotoFileArray: null,
      };
    case PostActions.CLEAR_POST_STATE:
      return {
        ...INITIAL_STATE,
      };
    default:
      return state;
  }
};

export default postReducer;
