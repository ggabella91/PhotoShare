import { PostActions, PostActionTypes, PostState } from './post.types';
import {
  addToPostDataArray,
  addPostFileToArray,
  addPostDataToFeedArray,
  addUserPhotoFileToArray,
  addPostReactionsToOuterReactionsArray,
  removeObjectProperty,
} from './post.utils';

import { POST_MODAL_DATA_INITIAL_STATE } from '../../components/feed-post-container/feed-post-container.component';

const INITIAL_STATE: PostState = {
  postData: null,
  postDataFeedArray: [],
  postReactionsArray: [],
  postFiles: [],
  getPostDataError: null,
  getPostDataConfirm: null,
  getPostFileError: null,
  getPostFileConfirm: null,
  getPostReactionsError: null,
  getPostReactionsConfirm: null,
  postError: null,
  postConfirm: null,
  postReactionError: null,
  postReactionConfirm: null,
  profilePhotoKey: null,
  profilePhotoFile: null,
  profilePhotoError: null,
  profilePhotoConfirm: null,
  archivePostConfirm: null,
  archivePostError: null,
  deleteReactionConfirm: null,
  deleteReactionError: null,
  otherUserProfilePhotoFile: null,
  followPhotoFileArray: null,
  suggestionPhotoFileArray: null,
  reactorPhotoFileArray: null,
  usersProfilePhotoConfirm: null,
  commentToDelete: null,
  showCommentOptionsModal: false,
  isLoadingPostData: false,
  postMetaDataForUser: null,
  postMetaDataForHashtag: null,
  postLikingUsersArray: null,
  showPostLikingUsersModal: false,
  feedPagePostModalData: POST_MODAL_DATA_INITIAL_STATE,
  feedPagePostModalShow: false,
  feedPagePostOptionsModalShow: false,
  clearFeedPagePostModalState: false,
  showPostEditForm: false,
  editPostDetailsConfirm: null,
  editPostDetailsFailure: null,
  getSinglePostDataConfirm: null,
  getSinglePostDataError: null,

  // New props to be used for feed-post-container
  // compononents in the feed-page component
  getFeedPostDataConfirm: null,
  feedPostFiles: [],
  feedPostReactionsArray: [],
  feedReactorPhotoFileArray: null,
  feedUsersProfilePhotoConfirm: null,
  feedPagePostIdForNavigation: null,

  // Post modal data cache
  postModalDataCache: {},

  // Location suggestions for posts
  locationsSuggestions: [],
  getLocationsSuggestionsError: null,
  locationSelection: null,

  // Used by locations-suggestions-container component
  isPostPage: false,

  // Mapbox access token fetched from posts service
  mapBoxAccessToken: null,
  getMapBoxAccessTokenError: null,

  // Used for posts with location
  postMetaDataForLocation: null,
  locationCoordinates: null,

  // Used for multipart video file chunk uploads
  videoPostFileChunkMetaData: null,

  // Used for conversation user avatars
  convoAvatarMap: {},

  // Used for conversation images
  convoImageMap: {},

  // Used for uploading conversation photos
  uploadConversationPhotoSuccess: null,
  uploadConversationPhotoFailure: null,

  // Used for notification user avatars
  notificationUserMap: {},

  // Used for notification post data and files
  notificationPostData: {},
  notificationPostFiles: {},
};

const postReducer = (
  state = INITIAL_STATE,
  action: PostActionTypes
): PostState => {
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
        postConfirm: action.payload,
      };
    case PostActions.CREATE_POST_REACTION_SUCCESS:
      return {
        ...state,
        postReactionConfirm: {
          ...action.payload,
          message: action.payload.likedPost
            ? 'Post liked successfully!'
            : 'Post comment created successfully!',
        },
        postReactionError: null,
        deleteReactionConfirm: null,
      };
    case PostActions.GET_POST_DATA_START:
      return {
        ...state,
        isLoadingPostData: true,
        getPostDataConfirm: null,
        getFeedPostDataConfirm: null,
        getPostDataError: null,
      };
    case PostActions.ADD_TO_POST_DATA_ARRAY:
      return {
        ...state,
        postData: addToPostDataArray(state.postData, action.payload),
        getPostDataError: null,
        getPostDataConfirm: 'Post data fetched!',
        isLoadingPostData: false,
      };
    case PostActions.GET_SINGLE_POST_DATA_SUCCESS: {
      return {
        ...state,
        getSinglePostDataConfirm: action.payload,
        getSinglePostDataError: null,
      };
    }
    case PostActions.GET_POST_REACTIONS_SUCCESS:
      return {
        ...state,
        postReactionsArray: addPostReactionsToOuterReactionsArray(
          state.postReactionsArray,
          action.payload
        ),
        getPostReactionsConfirm:
          'Successfully fetched reactions for the requested post!',
        getPostReactionsError: null,
      };
    case PostActions.GET_FEED_POST_REACTIONS_SUCCESS:
      return {
        ...state,
        feedPostReactionsArray: addPostReactionsToOuterReactionsArray(
          state.feedPostReactionsArray,
          action.payload
        ),
        getPostReactionsConfirm:
          'Successfully fetched reactions for the requested feed post container!',
        getPostReactionsError: null,
      };
    case PostActions.ADD_POST_DATA_TO_FEED_ARRAY:
      return {
        ...state,
        postDataFeedArray: addPostDataToFeedArray(
          state.postDataFeedArray,
          action.payload
        ),
        getPostDataError: null,
        getFeedPostDataConfirm: 'Post data added to feed array!',
        isLoadingPostData: false,
      };
    case PostActions.GET_POST_FILE_SUCCESS:
      return {
        ...state,
        postFiles: addPostFileToArray(state.postFiles, action.payload),
        getPostFileError: null,
        getPostFileConfirm: 'Post file fetched!',
      };
    case PostActions.GET_FEED_POST_FILE_SUCCESS:
      return {
        ...state,
        feedPostFiles: addPostFileToArray(state.feedPostFiles, action.payload),
        getPostFileError: null,
        getPostFileConfirm: 'Post feed file fetched!',
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
    case PostActions.GET_USER_PHOTO_FOR_FOLLOW_ARRAY_SUCCESS:
      return {
        ...state,
        followPhotoFileArray: addUserPhotoFileToArray(
          state.followPhotoFileArray,
          action.payload
        ),
        getPostFileError: null,
        usersProfilePhotoConfirm: 'User photo added to follow array!',
      };
    case PostActions.GET_USER_PHOTO_FOR_SUGGESTION_ARRAY_SUCCESS:
      return {
        ...state,
        suggestionPhotoFileArray: addUserPhotoFileToArray(
          state.suggestionPhotoFileArray,
          action.payload
        ),
        getPostFileError: null,
        usersProfilePhotoConfirm: 'User photo added to suggestion array!',
      };
    case PostActions.GET_USER_PHOTO_FOR_REACTOR_ARRAY_SUCCESS:
      return {
        ...state,
        reactorPhotoFileArray: addUserPhotoFileToArray(
          state.reactorPhotoFileArray,
          action.payload
        ),
        getPostFileError: null,
        usersProfilePhotoConfirm: 'User photo added to reactor array!',
      };
    case PostActions.GET_USER_PHOTO_FOR_FEED_REACTOR_ARRAY_SUCCESS:
      return {
        ...state,
        feedReactorPhotoFileArray: addUserPhotoFileToArray(
          state.feedReactorPhotoFileArray,
          action.payload
        ),
        getPostFileError: null,
        feedUsersProfilePhotoConfirm: 'User photo added to feed reactor array!',
      };
    case PostActions.ARCHIVE_POST_SUCCESS:
      return {
        ...state,
        archivePostConfirm: action.payload,
        archivePostError: null,
      };
    case PostActions.DELETE_REACTION_SUCCESS:
      return {
        ...state,
        deleteReactionConfirm: action.payload,
        deleteReactionError: null,
        postReactionConfirm: null,
        commentToDelete: null,
      };
    case PostActions.EDIT_POST_DETAILS_SUCCESS:
      return {
        ...state,
        editPostDetailsConfirm: action.payload,
        editPostDetailsFailure: null,
      };
    case PostActions.GET_LOCATIONS_SUGGESTIONS_SUCCESS:
      return {
        ...state,
        locationsSuggestions: action.payload,
        getLocationsSuggestionsError: null,
      };
    case PostActions.GET_MAPBOX_TOKEN_SUCCESS:
      return {
        ...state,
        mapBoxAccessToken: action.payload,
        getMapBoxAccessTokenError: null,
      };
    case PostActions.UPLOAD_VIDEO_POST_FILE_CHUNK_SUCCESS:
      return {
        ...state,
        videoPostFileChunkMetaData: action.payload,
        postError: null,
      };
    case PostActions.GET_CONVERSATION_AVATAR_PHOTO_SUCCESS:
      return {
        ...state,
        convoAvatarMap: {
          ...state.convoAvatarMap,
          [action.payload.s3Key]: action.payload,
        },
      };
    case PostActions.GET_CONVERSATION_IMAGE_SUCCESS:
      return {
        ...state,
        convoImageMap: {
          ...state.convoImageMap,
          [action.payload.s3Key]: action.payload,
        },
      };
    case PostActions.GET_NOTIFICATION_USER_AVATAR_PHOTO_SUCCESS:
      return {
        ...state,
        notificationUserMap: {
          ...state.notificationUserMap,
          [action.payload.s3Key]: action.payload,
        },
      };
    case PostActions.UPLOAD_CONVERSATION_PHOTO_SUCCESS:
      return {
        ...state,
        uploadConversationPhotoSuccess: action.payload,
        uploadConversationPhotoFailure: null,
      };
    case PostActions.GET_NOTIFICATION_POST_DATA_SUCCESS:
      return {
        ...state,
        notificationPostData: {
          ...state.notificationPostData,
          [action.payload.id]: action.payload,
        },
      };
    case PostActions.GET_NOTIFICATION_POST_FILE_SUCCESS:
      return {
        ...state,
        notificationPostFiles: {
          ...state.notificationPostFiles,
          [action.payload.s3Key]: action.payload,
        },
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
    case PostActions.UPLOAD_CONVERSATION_PHOTO_FAILURE:
      return {
        ...state,
        uploadConversationPhotoFailure: action.payload,
        uploadConversationPhotoSuccess: null,
      };
    case PostActions.CREATE_POST_REACTION_FAILURE:
      return {
        ...state,
        postReactionConfirm: null,
        postReactionError: action.payload,
      };
    case PostActions.GET_POST_DATA_FAILURE:
      return {
        ...state,
        getPostDataError: action.payload,
        getPostDataConfirm: null,
        getFeedPostDataConfirm: null,
        isLoadingPostData: false,
      };
    case PostActions.GET_POST_FILE_FAILURE:
      return {
        ...state,
        getPostFileError: action.payload,
        getPostFileConfirm: null,
      };
    case PostActions.GET_POST_REACTIONS_FAILURE:
      return {
        ...state,
        getPostReactionsError: action.payload,
        getPostReactionsConfirm: null,
      };
    case PostActions.ARCHIVE_POST_FAILURE:
      return {
        ...state,
        archivePostConfirm: null,
        archivePostError: action.payload,
      };
    case PostActions.DELETE_REACTION_FAILURE:
      return {
        ...state,
        deleteReactionConfirm: null,
        deleteReactionError: action.payload,
        commentToDelete: null,
      };
    case PostActions.EDIT_POST_DETAILS_FAILURE:
      return {
        ...state,
        editPostDetailsConfirm: null,
        editPostDetailsFailure: action.payload,
      };
    case PostActions.GET_LOCATIONS_SUGGESTIONS_FAILURE:
      return {
        ...state,
        locationsSuggestions: [],
        getLocationsSuggestionsError: action.payload,
      };
    case PostActions.GET_MAPBOX_TOKEN_FAILURE:
      return {
        ...state,
        getMapBoxAccessTokenError: action.payload,
        mapBoxAccessToken: null,
      };
    case PostActions.UPLOAD_VIDEO_POST_FILE_CHUNK_FAILURE:
      return {
        ...state,
        postError: action.payload,
        videoPostFileChunkMetaData: null,
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
    case PostActions.CLEAR_FOLLOW_PHOTO_FILE_ARRAY:
      return {
        ...state,
        followPhotoFileArray: null,
      };
    case PostActions.CLEAR_SUGGESTION_PHOTO_FILE_ARRAY:
      return {
        ...state,
        suggestionPhotoFileArray: null,
      };
    case PostActions.CLEAR_POST_FILES_AND_DATA:
      return {
        ...state,
        postFiles: [],
        postData: null,
        feedPostFiles: [],
        postReactionsArray: [],
        feedPostReactionsArray: [],
        editPostDetailsConfirm: null,
        getSinglePostDataConfirm: null,
      };
    case PostActions.CLEAR_POST_REACTIONS:
      return {
        ...state,
        postReactionsArray: [],
        postReactionConfirm: null,
        postReactionError: null,
        getPostReactionsConfirm: null,
        getPostReactionsError: null,
        deleteReactionError: null,
        deleteReactionConfirm: null,
        feedPostReactionsArray: [],
      };
    case PostActions.CLEAR_LOCATIONS_SUGGESTIONS:
      return {
        ...state,
        locationsSuggestions: [],
      };
    case PostActions.CLEAR_SINGLE_POST_DATA:
      return {
        ...state,
        getSinglePostDataConfirm: null,
        getSinglePostDataError: null,
      };
    case PostActions.CLEAR_POST_STATE:
      return {
        ...INITIAL_STATE,
      };
    case PostActions.SET_COMMENT_TO_DELETE:
      return {
        ...state,
        commentToDelete: action.payload,
        deleteReactionConfirm: null,
        deleteReactionError: null,
      };
    case PostActions.SET_SHOW_COMMENT_OPTIONS_MODAL:
      return {
        ...state,
        showCommentOptionsModal: action.payload,
      };
    case PostActions.SET_POST_META_DATA_FOR_USER:
      return {
        ...state,
        postMetaDataForUser: action.payload,
      };
    case PostActions.CLEAR_POST_META_DATA_FOR_USER:
      return {
        ...state,
        postMetaDataForUser: null,
      };
    case PostActions.SET_META_DATA_FOR_HASHTAG:
      return {
        ...state,
        postMetaDataForHashtag: action.payload,
      };
    case PostActions.SET_META_DATA_FOR_LOCATION:
      return {
        ...state,
        postMetaDataForLocation: action.payload,
      };
    case PostActions.SET_POST_LIKING_USERS_ARRAY:
      return {
        ...state,
        postLikingUsersArray: action.payload,
      };
    case PostActions.SET_SHOW_POST_LIKING_USERS_MODAL:
      return {
        ...state,
        showPostLikingUsersModal: action.payload,
      };
    case PostActions.SET_FEED_PAGE_POST_MODAL_DATA:
      return {
        ...state,
        feedPagePostModalData: { ...action.payload },
      };
    case PostActions.SET_FEED_PAGE_POST_ID_FOR_NAVIGATION:
      return {
        ...state,
        feedPagePostIdForNavigation: action.payload,
      };
    case PostActions.SET_FEED_PAGE_POST_MODAL_SHOW:
      return {
        ...state,
        feedPagePostModalShow: action.payload,
      };
    case PostActions.SET_FEED_PAGE_POST_OPTIONS_MODAL_SHOW:
      return {
        ...state,
        feedPagePostOptionsModalShow: action.payload,
      };
    case PostActions.SET_CLEAR_FEED_PAGE_POST_MODAL_STATE:
      return {
        ...state,
        clearFeedPagePostModalState: action.payload,
      };
    case PostActions.SET_SHOW_POST_EDIT_FORM:
      return {
        ...state,
        showPostEditForm: action.payload,
      };
    case PostActions.SET_LOCATION_SELECTION:
      return {
        ...state,
        locationSelection: action.payload,
      };
    case PostActions.SET_LOCATION_COORDINATES:
      return {
        ...state,
        locationCoordinates: action.payload,
      };
    case PostActions.SET_IS_POST_PAGE:
      return {
        ...state,
        isPostPage: action.payload,
      };
    case PostActions.SAVE_POST_MODAL_DATA_TO_CACHE:
      return {
        ...state,
        postModalDataCache: {
          ...state.postModalDataCache,
          [action.payload.postId]: {
            ...action.payload.cacheObj,
          },
        },
      };
    case PostActions.REMOVE_POST_MODAL_DATA_FROM_CACHE:
      return {
        ...state,
        postModalDataCache: removeObjectProperty(
          state.postModalDataCache,
          action.payload
        ),
      };
    default:
      return state;
  }
};

export default postReducer;
