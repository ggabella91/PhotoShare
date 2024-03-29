import { UserInfoAndOtherData } from '../../components/user-info/user-info.component';
import { PostModalDataToFeed } from '../../components/feed-post-container/feed-post-container.component';

import {
  Post,
  PostDataReq,
  PostFileReq,
  Reaction,
  ReactionReq,
  ReactionConfirm,
  GetPostReactionsReq,
  ArchivePostReq,
  DeleteReactionReq,
  DeleteReactionConfirm,
  PostFile,
  PostError,
  PostActions,
  PostActionTypes,
  PostMetaData,
  EditPostDetailsReq,
  SinglePostDataReq,
  PostModalDataToCache,
  PostsWithHashtagReq,
  PostHashtagMetaData,
  Location,
  PostsWithLocationReq,
  PostLocationMetaData,
  LocationCoordinates,
  UploadVideoPostFileChunkReq,
  UploadVideoPostFileChunkResponse,
  ConversationPhoto,
} from './post.types';

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

export const createPostReactionStart = (
  reactionReq: ReactionReq
): PostActionTypes => ({
  type: PostActions.CREATE_POST_REACTION_START,
  payload: reactionReq,
});

export const createPostReactionSuccess = (
  reactionConfirm: ReactionConfirm
): PostActionTypes => ({
  type: PostActions.CREATE_POST_REACTION_SUCCESS,
  payload: reactionConfirm,
});

export const createPostReactionFailure = (
  error: PostError
): PostActionTypes => ({
  type: PostActions.CREATE_POST_REACTION_FAILURE,
  payload: error,
});

export const getPostReactionsStart = (
  getPostReactionsReq: GetPostReactionsReq
): PostActionTypes => ({
  type: PostActions.GET_POST_REACTIONS_START,
  payload: getPostReactionsReq,
});

export const getPostReactionsSuccess = (
  reactions: Reaction[]
): PostActionTypes => ({
  type: PostActions.GET_POST_REACTIONS_SUCCESS,
  payload: reactions,
});

export const getPostReactionsFailure = (error: PostError): PostActionTypes => ({
  type: PostActions.GET_POST_REACTIONS_FAILURE,
  payload: error,
});

export const clearPostStatuses = (): PostActionTypes => ({
  type: PostActions.CLEAR_POST_STATUSES,
  payload: null,
});

export const updateProfilePhotoStart = (photo: FormData): PostActionTypes => ({
  type: PostActions.UPDATE_PROFILE_PHOTO_START,
  payload: photo,
});

export const updateProfilePhotoSuccess = (photo: Post): PostActionTypes => ({
  type: PostActions.UPDATE_PROFILE_PHOTO_SUCCESS,
  payload: photo,
});

export const updateProfilePhotoFailure = (
  error: PostError
): PostActionTypes => ({
  type: PostActions.UPDATE_PROFILE_PHOTO_FAILURE,
  payload: error,
});

export const clearProfilePhotoStatuses = (): PostActionTypes => ({
  type: PostActions.CLEAR_PROFILE_PHOTO_STATUSES,
  payload: null,
});

export const getPostDataStart = (
  postDataReq: PostDataReq
): PostActionTypes => ({
  type: PostActions.GET_POST_DATA_START,
  payload: postDataReq,
});

export const addToPostDataArray = (postDataArray: Post[]): PostActionTypes => ({
  type: PostActions.ADD_TO_POST_DATA_ARRAY,
  payload: postDataArray,
});

export const addPostDataToFeedArray = (
  postDataArray: Post[]
): PostActionTypes => ({
  type: PostActions.ADD_POST_DATA_TO_FEED_ARRAY,
  payload: postDataArray,
});

export const getPostDataFailure = (error: PostError): PostActionTypes => ({
  type: PostActions.GET_POST_DATA_FAILURE,
  payload: error,
});

export const getPostFileStart = (fileReq: PostFileReq): PostActionTypes => ({
  type: PostActions.GET_POST_FILE_START,
  payload: fileReq,
});

export const getPostFileSuccess = (file: PostFile): PostActionTypes => ({
  type: PostActions.GET_POST_FILE_SUCCESS,
  payload: file,
});

export const getPostFileFailure = (error: PostError): PostActionTypes => ({
  type: PostActions.GET_POST_FILE_FAILURE,
  payload: error,
});

export const getProfilePhotoFileSuccess = (
  file: PostFile
): PostActionTypes => ({
  type: PostActions.GET_PROFILE_PHOTO_FILE_SUCCESS,
  payload: file,
});

export const archivePostStart = (
  archiveReq: ArchivePostReq
): PostActionTypes => ({
  type: PostActions.ARCHIVE_POST_START,
  payload: archiveReq,
});

export const archivePostSuccess = (message: string): PostActionTypes => ({
  type: PostActions.ARCHIVE_POST_SUCCESS,
  payload: message,
});

export const archivePostFailure = (error: PostError): PostActionTypes => ({
  type: PostActions.ARCHIVE_POST_FAILURE,
  payload: error,
});

export const deleteReactionStart = (
  deleteReactionReq: DeleteReactionReq
): PostActionTypes => ({
  type: PostActions.DELETE_REACTION_START,
  payload: deleteReactionReq,
});

export const deleteReactionSuccess = (
  deleteReactionConfirm: DeleteReactionConfirm
): PostActionTypes => ({
  type: PostActions.DELETE_REACTION_SUCCESS,
  payload: deleteReactionConfirm,
});

export const deleteReactionFailure = (error: PostError): PostActionTypes => ({
  type: PostActions.DELETE_REACTION_FAILURE,
  payload: error,
});

export const getOtherUserProfilePhotoFileSuccess = (
  file: PostFile
): PostActionTypes => ({
  type: PostActions.GET_OTHER_USER_PROFILE_PHOTO_FILE_SUCCESS,
  payload: file,
});

export const getUserPhotoForFollowArraySuccess = (
  postFile: PostFile
): PostActionTypes => ({
  type: PostActions.GET_USER_PHOTO_FOR_FOLLOW_ARRAY_SUCCESS,
  payload: postFile,
});

export const getUserPhotoForSuggestionArraySuccess = (
  postFile: PostFile
): PostActionTypes => ({
  type: PostActions.GET_USER_PHOTO_FOR_SUGGESTION_ARRAY_SUCCESS,
  payload: postFile,
});

export const getUserPhotoForReactorArraySuccess = (
  postFile: PostFile
): PostActionTypes => ({
  type: PostActions.GET_USER_PHOTO_FOR_REACTOR_ARRAY_SUCCESS,
  payload: postFile,
});

export const clearArchivePostStatuses = (): PostActionTypes => ({
  type: PostActions.CLEAR_ARCHIVE_POST_STATUSES,
  payload: null,
});

export const clearFollowPhotoFileArray = (): PostActionTypes => ({
  type: PostActions.CLEAR_FOLLOW_PHOTO_FILE_ARRAY,
  payload: null,
});

export const clearSuggestionPhotoFileArray = (): PostActionTypes => ({
  type: PostActions.CLEAR_SUGGESTION_PHOTO_FILE_ARRAY,
  payload: null,
});

export const clearPostFilesAndData = (): PostActionTypes => ({
  type: PostActions.CLEAR_POST_FILES_AND_DATA,
  payload: null,
});

export const clearPostState = (): PostActionTypes => ({
  type: PostActions.CLEAR_POST_STATE,
  payload: null,
});

export const setCommentToDelete = (
  deleteReactionReq: DeleteReactionReq
): PostActionTypes => ({
  type: PostActions.SET_COMMENT_TO_DELETE,
  payload: deleteReactionReq,
});

export const setShowCommentOptionsModal = (
  showCommentOptionsModal: boolean
): PostActionTypes => ({
  type: PostActions.SET_SHOW_COMMENT_OPTIONS_MODAL,
  payload: showCommentOptionsModal,
});

export const clearPostReactions = (): PostActionTypes => ({
  type: PostActions.CLEAR_POST_REACTIONS,
  payload: null,
});

export const setPostMetaDataForUser = (
  postMetaData: PostMetaData
): PostActionTypes => ({
  type: PostActions.SET_POST_META_DATA_FOR_USER,
  payload: postMetaData,
});

export const clearPostMetaDataForUser = (): PostActionTypes => ({
  type: PostActions.CLEAR_POST_META_DATA_FOR_USER,
});

export const setPostMetaDataForHashtag = (
  postMetaData: PostHashtagMetaData
): PostActionTypes => ({
  type: PostActions.SET_META_DATA_FOR_HASHTAG,
  payload: postMetaData,
});

export const setPostLikingUsersArray = (
  postLikingUsersArray: UserInfoAndOtherData[]
): PostActionTypes => ({
  type: PostActions.SET_POST_LIKING_USERS_ARRAY,
  payload: postLikingUsersArray,
});

export const setShowPostLikingUsersModal = (
  showPostLikingUsersModal: boolean
): PostActionTypes => ({
  type: PostActions.SET_SHOW_POST_LIKING_USERS_MODAL,
  payload: showPostLikingUsersModal,
});

export const setFeedPagePostModalData = (
  postModalDataToFeed: PostModalDataToFeed
): PostActionTypes => ({
  type: PostActions.SET_FEED_PAGE_POST_MODAL_DATA,
  payload: postModalDataToFeed,
});

export const setFeedPagePostModalShow = (
  postModalDataShow: boolean
): PostActionTypes => ({
  type: PostActions.SET_FEED_PAGE_POST_MODAL_SHOW,
  payload: postModalDataShow,
});

export const setFeedPagePostOptionsModalShow = (
  postOptionsModalDataShow: boolean
): PostActionTypes => ({
  type: PostActions.SET_FEED_PAGE_POST_OPTIONS_MODAL_SHOW,
  payload: postOptionsModalDataShow,
});

export const setClearFeedPagePostModalState = (
  clearFeedPagePostModalState: boolean
): PostActionTypes => ({
  type: PostActions.SET_CLEAR_FEED_PAGE_POST_MODAL_STATE,
  payload: clearFeedPagePostModalState,
});

export const setShowPostEditForm = (
  showPostEditForm: boolean
): PostActionTypes => ({
  type: PostActions.SET_SHOW_POST_EDIT_FORM,
  payload: showPostEditForm,
});

export const editPostDetailsStart = (
  editPostDetailsReq: EditPostDetailsReq
): PostActionTypes => ({
  type: PostActions.EDIT_POST_DETAILS_START,
  payload: editPostDetailsReq,
});

export const editPostDetailsSuccess = (editedPost: Post): PostActionTypes => ({
  type: PostActions.EDIT_POST_DETAILS_SUCCESS,
  payload: editedPost,
});

export const editPostDetailsFailure = (error: PostError): PostActionTypes => ({
  type: PostActions.EDIT_POST_DETAILS_FAILURE,
  payload: error,
});

export const getSinglePostDataStart = (
  singlePostDataReq: SinglePostDataReq
): PostActionTypes => ({
  type: PostActions.GET_SINGLE_POST_DATA_START,
  payload: singlePostDataReq,
});

export const getSinglePostDataSuccess = (
  singlePostData: Post
): PostActionTypes => ({
  type: PostActions.GET_SINGLE_POST_DATA_SUCCESS,
  payload: singlePostData,
});

export const getSinglePostDataFailure = (
  error: PostError
): PostActionTypes => ({
  type: PostActions.GET_SINGLE_POST_DATA_FAILURE,
  payload: error,
});

export const clearSinglePostData = (): PostActionTypes => ({
  type: PostActions.CLEAR_SINGLE_POST_DATA,
  payload: null,
});

// Actions for feed-post-container

export const getFeedPostFileSuccess = (file: PostFile): PostActionTypes => ({
  type: PostActions.GET_FEED_POST_FILE_SUCCESS,
  payload: file,
});

export const getFeedPostReactionsSuccess = (
  reactions: Reaction[]
): PostActionTypes => ({
  type: PostActions.GET_FEED_POST_REACTIONS_SUCCESS,
  payload: reactions,
});

export const getUserPhotoForFeedReactorArraySuccess = (
  postFile: PostFile
): PostActionTypes => ({
  type: PostActions.GET_USER_PHOTO_FOR_FEED_REACTOR_ARRAY_SUCCESS,
  payload: postFile,
});

export const setFeedPagePostIdForNavigation = (
  postId: string
): PostActionTypes => ({
  type: PostActions.SET_FEED_PAGE_POST_ID_FOR_NAVIGATION,
  payload: postId,
});

export const savePostModalDataToCache = (
  postModalDataToCache: PostModalDataToCache
): PostActionTypes => ({
  type: PostActions.SAVE_POST_MODAL_DATA_TO_CACHE,
  payload: postModalDataToCache,
});

export const removePostModalDataFromCache = (
  postId: string
): PostActionTypes => ({
  type: PostActions.REMOVE_POST_MODAL_DATA_FROM_CACHE,
  payload: postId,
});

export const getPostsWithHashtagStart = (
  postsWithHashtagReq: PostsWithHashtagReq
): PostActionTypes => ({
  type: PostActions.GET_POSTS_WITH_HASHTAG_START,
  payload: postsWithHashtagReq,
});

export const getLocationsSuggestionsStart = (
  location: string
): PostActionTypes => ({
  type: PostActions.GET_LOCATIONS_SUGGESTIONS_START,
  payload: location,
});

export const getLocationsSuggestionsSuccess = (
  locationsSuggestions: Location[]
): PostActionTypes => ({
  type: PostActions.GET_LOCATIONS_SUGGESTIONS_SUCCESS,
  payload: locationsSuggestions,
});

export const getLocationsSuggestionsFailure = (
  error: PostError
): PostActionTypes => ({
  type: PostActions.GET_LOCATIONS_SUGGESTIONS_FAILURE,
  payload: error,
});

export const setLocationSelection = (
  locationSelection: Location
): PostActionTypes => ({
  type: PostActions.SET_LOCATION_SELECTION,
  payload: locationSelection,
});

export const setIsPostPage = (isPostPage: boolean): PostActionTypes => ({
  type: PostActions.SET_IS_POST_PAGE,
  payload: isPostPage,
});

export const clearLocationsSuggestions = (): PostActionTypes => ({
  type: PostActions.CLEAR_LOCATIONS_SUGGESTIONS,
  payload: null,
});

export const getMapBoxAccessTokenStart = (): PostActionTypes => ({
  type: PostActions.GET_MAPBOX_TOKEN_START,
  payload: null,
});

export const getMapBoxAccessTokenSuccess = (
  mapBoxAccessToken: string
): PostActionTypes => ({
  type: PostActions.GET_MAPBOX_TOKEN_SUCCESS,
  payload: mapBoxAccessToken,
});

export const getMapBoxAccessTokenFailure = (
  error: PostError
): PostActionTypes => ({
  type: PostActions.GET_MAPBOX_TOKEN_FAILURE,
  payload: error,
});

export const getPostsWithLocationStart = (
  postsWithLocationReq: PostsWithLocationReq
): PostActionTypes => ({
  type: PostActions.GET_POSTS_WITH_LOCATION_START,
  payload: postsWithLocationReq,
});

export const setPostMetaDataForLocation = (
  postMetaData: PostLocationMetaData
): PostActionTypes => ({
  type: PostActions.SET_META_DATA_FOR_LOCATION,
  payload: postMetaData,
});

export const setLocationCoordinates = (
  coordinates: LocationCoordinates
): PostActionTypes => ({
  type: PostActions.SET_LOCATION_COORDINATES,
  payload: coordinates,
});

export const uploadVideoPostFileChunkStart = (
  uploadVideoPostFileChunkReq: UploadVideoPostFileChunkReq
): PostActionTypes => ({
  type: PostActions.UPLOAD_VIDEO_POST_FILE_CHUNK_START,
  payload: uploadVideoPostFileChunkReq,
});

export const uploadVideoPostFileChunkSuccess = (
  uploadVideoPostFileChunkResponse: UploadVideoPostFileChunkResponse
): PostActionTypes => ({
  type: PostActions.UPLOAD_VIDEO_POST_FILE_CHUNK_SUCCESS,
  payload: uploadVideoPostFileChunkResponse,
});

export const uploadVideoPostFileChunkFailure = (
  error: PostError
): PostActionTypes => ({
  type: PostActions.UPLOAD_VIDEO_POST_FILE_CHUNK_FAILURE,
  payload: error,
});

export const getConversationAvatarPhotoSuccess = (
  avatarInfo: PostFile
): PostActionTypes => ({
  type: PostActions.GET_CONVERSATION_AVATAR_PHOTO_SUCCESS,
  payload: avatarInfo,
});

export const getConversationImageSuccess = (
  convoImage: PostFile
): PostActionTypes => ({
  type: PostActions.GET_CONVERSATION_IMAGE_SUCCESS,
  payload: convoImage,
});

export const getNotificationUserAvatarPhotoSuccess = (
  avatarInfo: PostFile
): PostActionTypes => ({
  type: PostActions.GET_NOTIFICATION_USER_AVATAR_PHOTO_SUCCESS,
  payload: avatarInfo,
});

export const uploadConversationPhotoStart = (
  formData: FormData
): PostActionTypes => ({
  type: PostActions.UPLOAD_CONVERSATION_PHOTO_START,
  payload: formData,
});

export const uploadConversationPhotoSuccess = (
  conversationPhoto: ConversationPhoto
): PostActionTypes => ({
  type: PostActions.UPLOAD_CONVERSATION_PHOTO_SUCCESS,
  payload: conversationPhoto,
});

export const uploadConversationPhotoFailure = (
  error: PostError
): PostActionTypes => ({
  type: PostActions.UPLOAD_CONVERSATION_PHOTO_FAILURE,
  payload: error,
});

// Actions specific to notification post data and files

export const getNotificationPostDataSuccess = (
  postData: Post
): PostActionTypes => ({
  type: PostActions.GET_NOTIFICATION_POST_DATA_SUCCESS,
  payload: postData,
});

export const getNotificationPostFileSuccess = (
  postFile: PostFile
): PostActionTypes => ({
  type: PostActions.GET_NOTIFICATION_POST_FILE_SUCCESS,
  payload: postFile,
});
