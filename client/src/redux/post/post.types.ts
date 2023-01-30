import { UserInfoAndOtherData } from '../../components/user-info/user-info.component';
import { AlreadyLikedAndReactionId } from '../../components/post-modal/post-modal.component';
import { PostModalDataToFeed } from '../../components/feed-post-container/feed-post-container.component';
import { List, Map } from 'immutable';

export enum PostActions {
  CREATE_POST_START = 'CREATE_POST_START',
  CREATE_POST_SUCCESS = 'CREATE_POST_SUCCESS',
  CREATE_POST_FAILURE = 'CREATE_POST_FAILURE',
  CREATE_POST_REACTION_START = 'CREATE_POST_REACTION_START',
  CREATE_POST_REACTION_SUCCESS = 'CREATE_POST_REACTION_SUCCESS',
  CREATE_POST_REACTION_FAILURE = 'CREATE_POST_REACTION_FAILURE',
  GET_POST_REACTIONS_START = 'GET_POST_REACTIONS_START',
  GET_POST_REACTIONS_SUCCESS = 'GET_POST_REACTIONS_SUCCESS',
  GET_POST_REACTIONS_FAILURE = 'GET_POST_REACTIONS_FAILURE',
  UPDATE_PROFILE_PHOTO_START = 'UPDATE_PROFILE_PHOTO_START',
  UPDATE_PROFILE_PHOTO_SUCCESS = 'UPDATE_PROFILE_PHOTO_SUCCESS',
  UPDATE_PROFILE_PHOTO_FAILURE = 'UPDATE_PROFILE_PHOTO_FAILURE',
  CLEAR_POST_STATUSES = 'CLEAR_POST_STATUSES',
  CLEAR_PROFILE_PHOTO_STATUSES = 'CLEAR_PHOTO_STATUSES',
  GET_POST_DATA_START = 'GET_POST_DATA_START',
  ADD_TO_POST_DATA_ARRAY = 'ADD_TO_POST_DATA_ARRAY',
  ADD_POST_DATA_TO_FEED_ARRAY = 'ADD_POST_DATA_TO_FEED_ARRAY',
  GET_POST_DATA_FAILURE = 'GET_POST_DATA_FAILURE',
  GET_POST_FILE_START = 'GET_POST_FILE_START',
  GET_POST_FILE_SUCCESS = 'GET_POST_FILE_SUCCESS',
  GET_PROFILE_PHOTO_FILE_SUCCESS = 'GET_PROFILE_PHOTO_FILE_SUCCESS',
  GET_POST_FILE_FAILURE = 'GET_POST_FILE_FAILURE',
  ARCHIVE_POST_START = 'ARCHIVE_POST_START',
  ARCHIVE_POST_SUCCESS = 'ARCHIVE_POST_SUCCESS',
  ARCHIVE_POST_FAILURE = 'ARCHIVE_POST_FAILURE',
  DELETE_REACTION_START = 'DELETE_REACTION_START',
  DELETE_REACTION_SUCCESS = 'DELETE_REACTION_SUCCESS',
  DELETE_REACTION_FAILURE = 'DELETE_REACTION_FAILURE',
  CLEAR_ARCHIVE_POST_STATUSES = 'CLEAR_ARCHIVE_POST_STATUSES',
  GET_OTHER_USER_PROFILE_PHOTO_FILE_SUCCESS = 'GET_OTHER_USER_PROFILE_PHOTO_FILE_SUCCESS',
  GET_USER_PHOTO_FOR_FOLLOW_ARRAY_SUCCESS = 'GET_USER_PHOTO_FOR_FOLLOW_ARRAY_SUCCESS',
  GET_USER_PHOTO_FOR_SUGGESTION_ARRAY_SUCCESS = 'GET_USER_PHOTO_FOR_SUGGESTION_ARRAY_SUCCESS',
  GET_USER_PHOTO_FOR_REACTOR_ARRAY_SUCCESS = 'GET_USER_PHOTO_FOR_REACTOR_ARRAY_SUCCESS',
  CLEAR_FOLLOW_PHOTO_FILE_ARRAY = 'CLEAR_FOLLOW_PHOTO_FILE_ARRAY',
  CLEAR_SUGGESTION_PHOTO_FILE_ARRAY = 'CLEAR_SUGGESTION_PHOTO_FILE_ARRAY',
  CLEAR_POST_FILES_AND_DATA = 'CLEAR_POST_FILES_AND_DATA',
  CLEAR_POST_STATE = 'CLEAR_POST_STATE',
  SET_COMMENT_TO_DELETE = 'SET_COMMENT_TO_DELETE',
  SET_SHOW_COMMENT_OPTIONS_MODAL = 'SET_SHOW_COMMENT_OPTIONS_MODAL',
  CLEAR_POST_REACTIONS = 'CLEAR_POST_REACTIONS',
  SET_POST_META_DATA_FOR_USER = 'SET_POST_META_DATA_FOR_USER',
  SET_POST_LIKING_USERS_ARRAY = 'SET_POST_LIKING_USERS_ARRAY',
  SET_SHOW_POST_LIKING_USERS_MODAL = 'SET_SHOW_POST_LIKING_USERS_MODAL',
  SET_FEED_PAGE_POST_MODAL_DATA = 'SET_FEED_PAGE_POST_MODAL_DATA',
  SET_FEED_PAGE_POST_MODAL_SHOW = 'SET_FEED_PAGE_POST_MODAL_SHOW',
  SET_FEED_PAGE_POST_OPTIONS_MODAL_SHOW = 'SET_FEED_PAGE_POST_OPTIONS_MODAL_SHOW',
  SET_CLEAR_FEED_PAGE_POST_MODAL_STATE = 'SET_CLEAR_FEED_PAGE_POST_MODAL_STATE',
  SET_SHOW_POST_EDIT_FORM = 'SET_SHOW_POST_EDIT_FORM',
  EDIT_POST_DETAILS_START = 'EDIT_POST_DETAILS_START',
  EDIT_POST_DETAILS_SUCCESS = 'EDIT_POST_DETAILS_SUCCESS',
  EDIT_POST_DETAILS_FAILURE = 'EDIT_POST_DETAILS_FAILURE',
  GET_SINGLE_POST_DATA_START = 'GET_SINGLE_POST_DATA_START',
  GET_SINGLE_POST_DATA_SUCCESS = 'GET_SINGLE_POST_DATA_SUCCESS',
  GET_SINGLE_POST_DATA_FAILURE = 'GET_SINGLE_POST_DATA_FAILURE',
  CLEAR_SINGLE_POST_DATA = 'CLEAR_SINGLE_POST_DATA',

  // Actions specific to data for feed-post-containers
  GET_FEED_POST_FILE_SUCCESS = 'GET_FEED_POST_FILE_SUCCESS',
  GET_FEED_POST_REACTIONS_SUCCESS = 'GET_FEED_POST_REACTIONS_SUCCESS',
  GET_USER_PHOTO_FOR_FEED_REACTOR_ARRAY_SUCCESS = 'GET_USER_PHOTO_FOR_FEED_REACTOR_ARRAY_SUCCESS',
  SET_FEED_PAGE_POST_ID_FOR_NAVIGATION = 'SET_FEED_PAGE_POST_ID_FOR_NAVIGATION',

  // Actions specific to caching post modal reaction data
  SAVE_POST_MODAL_DATA_TO_CACHE = 'SAVE_POST_MODAL_DATA_TO_CACHE',
  REMOVE_POST_MODAL_DATA_FROM_CACHE = 'REMOVE_POST_MODAL_DATA_FROM_CACHE',

  // Actions specific to fetching posts associated with hashtags
  GET_POSTS_WITH_HASHTAG_START = 'GET_POSTS_WITH_HASHTAG_START',
  SET_META_DATA_FOR_HASHTAG = 'SET_META_DATA_FOR_HASHTAG',

  // Actions specific to locations suggestions for posts
  GET_LOCATIONS_SUGGESTIONS_START = 'GET_LOCATIONS_SUGGESTIONS_START',
  GET_LOCATIONS_SUGGESTIONS_SUCCESS = 'GET_LOCATIONS_SUGGESTIONS_SUCCESS',
  GET_LOCATIONS_SUGGESTIONS_FAILURE = 'GET_LOCATIONS_SUGGESTIONS_FAILURE',
  SET_LOCATION_SELECTION = 'SET_LOCATION_SELECTION',
  CLEAR_LOCATIONS_SUGGESTIONS = 'CLEAR_LOCATIONS_SUGGESTIONS',

  // Set if on post-page for locations-suggestions-container
  // component
  SET_IS_POST_PAGE = 'SET_IS_POST_PAGE',

  // Actions specific to fetching mapbox access token from
  // posts service
  GET_MAPBOX_TOKEN_START = 'GET_MAPBOX_TOKEN_START',
  GET_MAPBOX_TOKEN_SUCCESS = 'GET_MAPBOX_TOKEN_SUCCESS',
  GET_MAPBOX_TOKEN_FAILURE = 'GET_MAPBOX_TOKEN_FAILURE',

  // Actions specific to fetching posts associated with a location id
  GET_POSTS_WITH_LOCATION_START = 'GET_POSTS_WITH_LOCATION_START',
  SET_META_DATA_FOR_LOCATION = 'SET_META_DATA_FOR_LOCATION',
  SET_LOCATION_COORDINATES = 'SET_LOCATION_COORDINATES',

  // Actions specific to creating video posts
  UPLOAD_VIDEO_POST_FILE_CHUNK_START = 'UPLOAD_VIDEO_POST_FILE_CHUNK_START',
  UPLOAD_VIDEO_POST_FILE_CHUNK_SUCCESS = 'UPLOAD_VIDEO_POST_FILE_CHUNK_SUCCESS',
  UPLOAD_VIDEO_POST_FILE_CHUNK_FAILURE = 'UPLOAD_VIDEO_POST_FILE_CHUNK_FAILURE',

  // Actions specific to getting conversation avatars
  GET_CONVERSATION_AVATAR_PHOTO_SUCCESS = 'GET_CONVERSATION_AVATAR_PHOTO_SUCCESS',

  // Actions specific to uploading a conversation photo
  UPLOAD_CONVERSATION_PHOTO_START = 'UPLOAD_CONVERSATION_PHOTO_START',
  UPLOAD_CONVERSATION_PHOTO_SUCCESS = 'UPLOAD_CONVERSATION_PHOTO_SUCCESS',
  UPLOAD_CONVERSATION_PHOTO_FAILURE = 'UPLOAD_CONVERSATION_PHOTO_FAILURE',

  // Actions specific to conversation avatars
  GET_NOTIFICATION_USER_AVATAR_PHOTO_SUCCESS = 'GET_NOTIFICATION_USER_AVATAR_PHOTO_SUCCESS',

  // Actions specific to notification post data and files
  GET_NOTIFICATION_POST_DATA_SUCCESS = 'GET_NOTIFICATION_POST_DATA_SUCCESS',
  GET_NOTIFICATION_POST_FILE_SUCCESS = 'GET_NOTIFICATION_POST_FILE_SUCCESS',
}

export interface PostError {
  statusCode: number;
  message: string;
}

export interface Post {
  fileName: string;
  caption?: string;
  postLocation?: Location;
  createdAt: Date;
  id: string;
  s3Key: string;
  s3ObjectURL: string;
  userId: string;
  hashtags: string[];
  comments: number;
  likes: number;
  isVideo?: boolean;
  videoThumbnailS3Key?: string;
}

export interface ConversationPhoto {
  fileName: string;
  createdAt: Date;
  conversationId: string;
  s3Key: string;
  s3ObjectURL: string;
}

export interface Reaction {
  id: string;
  createdAt: Date;
  reactingUserId: string;
  postId: string;
  likedPost: boolean;
  comment?: string;
}

export interface ReactionReq {
  reactingUserId: string;
  postId: string;
  likedPost: boolean;
  comment?: string;
}

export interface ReactionConfirm {
  reactionId: string;
  message: string;
  likedPost: boolean;
  postId: string;
}

export enum ReactionRequestType {
  singlePost = 'singlePost',
  feedPost = 'feedPost',
}

export interface GetPostReactionsReq {
  postId: string;
  reactionReqType: ReactionRequestType;
}

export enum UserType {
  self = 'self',
  other = 'other',
  followArray = 'followArray',
  suggestionArray = 'suggestionArray',
  postReactorsArray = 'postReactorsArray',
  feedPostReactorsArray = 'feedPostReactorsArray',
  conversationAvatar = 'conversationAvatar',
  notificationUser = 'notificationUser',
}

export enum DataRequestType {
  single = 'single',
  feed = 'feed',
}

export enum FileRequestType {
  singlePost = 'singlePost',
  feedPost = 'feedPost',
  notificationPost = 'notificationPost',
}

export interface PostDataReq {
  userId: string;
  dataReqType: DataRequestType;
  pageToShow?: number;
  limit?: number;
}

export interface SinglePostDataReq {
  postId: string;
  notificationPost?: boolean;
}

export interface PostsWithHashtagReq {
  hashtag: string;
  pageToShow?: number;
  limit?: number;
}

export interface PostsWithLocationReq {
  locationId: string;
  pageToShow?: number;
  limit?: number;
}

export interface PostFileReq {
  s3Key: string;
  bucket: string;
  user: UserType;
  fileRequestType: FileRequestType;
  isVideo?: boolean;
  videoThumbnailS3Key?: string;
}

export interface PostFile {
  s3Key: string;
  fileString: string;
}

export interface ArchivePostReq {
  postId: string;
  s3Key: string;
}

export interface DeleteReactionReq {
  postId: string;
  reactionId: string;
  isLikeRemoval: boolean;
  reactingUserId?: string;
}

export interface DeleteReactionConfirm {
  reactionId: string;
  message: string;
  postId: string;
}

export interface EditPostDetailsReq {
  postId: string;
  caption: string;
  location: Location;
}

export interface PostMetaData {
  queryLength: number;
  userId: string;
}

export interface PostHashtagMetaData {
  queryLength: number;
  hashtag: string;
}

export interface PostLocationMetaData {
  queryLength: number;
  locationId: string;
}

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface PostModalDataToCache {
  postId: string;
  cacheObj: PostModalCacheObj;
}

export interface PostModalCacheObj {
  commentingUserList: List<UserInfoAndOtherData>;
  likingUsersList: List<UserInfoAndOtherData>;
  alreadyLikedPostAndReactionId: AlreadyLikedAndReactionId;
}

export interface Location {
  id: string;
  latitude: number;
  longitude: number;
  type: string;
  name: string;
  number: number | null;
  postal_code: string | null;
  street: string | null;
  confidence: number;
  region: string;
  region_code: string;
  county: string;
  locality: string | null;
  administrative_area: string | null;
  neighbourhood: string | null;
  country: string;
  country_code: string;
  continent: string;
  label: string;
}

export interface UploadPart {
  ETag: string;
  PartNumber: number;
}

export interface UploadVideoPostFileChunkReq {
  fileChunk?: string;
  fileName?: string;
  contentType?: string;
  createNewMultipartUpload?: boolean;
  partNumber?: number;
  uploadId?: string;
  key?: string;
  caption?: string;
  location?: Location;
  multiPartUploadArray?: UploadPart[];
  completeMultipartUpload?: boolean;
  videoThumbnail?: string;
}

export interface UploadVideoPostFileChunkResponse {
  eTag: string;
  partNumber: number;
  key: string;
  uploadId: string;
}

export interface PostState {
  postData: Post[] | null;
  postDataFeedArray: Post[][];
  postReactionsArray: Reaction[][];
  postReactionError: PostError | null;
  postReactionConfirm: ReactionConfirm | null;
  postFiles: PostFile[];
  getPostDataError: PostError | null;
  getPostDataConfirm: string | null;
  getPostFileError: PostError | null;
  getPostFileConfirm: string | null;
  getPostReactionsError: PostError | null;
  getPostReactionsConfirm: string | null;
  postError: PostError | null;
  postConfirm: Post | null;
  profilePhotoKey: string | null;
  profilePhotoFile: PostFile | null;
  profilePhotoError: PostError | null;
  profilePhotoConfirm: string | null;
  archivePostConfirm: string | null;
  archivePostError: PostError | null;
  deleteReactionConfirm: DeleteReactionConfirm | null;
  deleteReactionError: PostError | null;
  otherUserProfilePhotoFile: PostFile | null;
  followPhotoFileArray: PostFile[] | null;
  suggestionPhotoFileArray: PostFile[] | null;
  reactorPhotoFileArray: PostFile[] | null;
  usersProfilePhotoConfirm: string | null;
  commentToDelete: DeleteReactionReq | null;
  showCommentOptionsModal: boolean;
  isLoadingPostData: boolean;
  postMetaDataForUser: PostMetaData | null;
  postMetaDataForHashtag: PostHashtagMetaData | null;
  postLikingUsersArray: UserInfoAndOtherData[] | null;
  showPostLikingUsersModal: boolean;
  feedPagePostModalData: PostModalDataToFeed;
  feedPagePostModalShow: boolean;
  feedPagePostOptionsModalShow: boolean;
  clearFeedPagePostModalState: boolean;
  showPostEditForm: boolean;
  editPostDetailsConfirm: Post | null;
  editPostDetailsFailure: PostError | null;
  getSinglePostDataConfirm: Post | null;
  getSinglePostDataError: PostError | null;

  // New props to be used for feed-post-container
  // components in the feed-page component
  getFeedPostDataConfirm: string | null;
  feedPostFiles: PostFile[];
  feedPostReactionsArray: Reaction[][];
  feedReactorPhotoFileArray: PostFile[] | null;
  feedUsersProfilePhotoConfirm: string | null;
  feedPagePostIdForNavigation: string | null;

  // Post modal data cache
  postModalDataCache: Map<string, any>;

  // Locations suggestions / selection
  locationsSuggestions: Location[];
  getLocationsSuggestionsError: PostError | null;
  locationSelection: Location | null;

  // Used by locations-suggestions-container component
  isPostPage: boolean;

  // Mapbox access token fetched from posts service
  mapBoxAccessToken: string | null;
  getMapBoxAccessTokenError: PostError | null;

  // Used for posts with location
  postMetaDataForLocation: PostLocationMetaData | null;
  locationCoordinates: LocationCoordinates | null;

  // Used for multipart video file chunk uploads
  videoPostFileChunkMetaData: UploadVideoPostFileChunkResponse | null;

  // Used for conversation avatars
  convoAvatarMap: Map<string, PostFile>;

  // Used for uploading conversation photos
  uploadConversationPhotoSuccess: ConversationPhoto | null;
  uploadConversationPhotoFailure: PostError | null;

  // Used for notification user avatars
  notificationUserMap: Map<string, PostFile>;

  // Used for notification post data and files
  notificationPostData: Map<string, Post>;
  notificationPostFiles: Map<string, PostFile>;
}

export interface CreatePostStart {
  type: typeof PostActions.CREATE_POST_START;
  payload: FormData;
}

export interface CreatePostSuccess {
  type: typeof PostActions.CREATE_POST_SUCCESS;
  payload: Post;
}

export interface CreatePostFailure {
  type: typeof PostActions.CREATE_POST_FAILURE;
  payload: PostError;
}

export interface CreatePostReactionStart {
  type: typeof PostActions.CREATE_POST_REACTION_START;
  payload: ReactionReq;
}

export interface CreatePostReactionSuccess {
  type: typeof PostActions.CREATE_POST_REACTION_SUCCESS;
  payload: ReactionConfirm;
}

export interface CreatePostReactionFailure {
  type: typeof PostActions.CREATE_POST_REACTION_FAILURE;
  payload: PostError;
}

export interface GetPostReactionsStart {
  type: typeof PostActions.GET_POST_REACTIONS_START;
  payload: GetPostReactionsReq;
}

export interface GetPostReactionsSuccess {
  type: typeof PostActions.GET_POST_REACTIONS_SUCCESS;
  payload: Reaction[];
}

export interface GetPostReactionsFailure {
  type: typeof PostActions.GET_POST_REACTIONS_FAILURE;
  payload: PostError;
}

export interface ClearPostStatuses {
  type: typeof PostActions.CLEAR_POST_STATUSES;
  payload: null;
}

export interface UpdateProfilePhotoStart {
  type: typeof PostActions.UPDATE_PROFILE_PHOTO_START;
  payload: FormData;
}

export interface UpdateProfilePhotoSuccess {
  type: typeof PostActions.UPDATE_PROFILE_PHOTO_SUCCESS;
  payload: Post;
}

export interface UpdateProfilePhotoFailure {
  type: typeof PostActions.UPDATE_PROFILE_PHOTO_FAILURE;
  payload: PostError;
}

export interface ClearProfilePhotoStatuses {
  type: typeof PostActions.CLEAR_PROFILE_PHOTO_STATUSES;
  payload: null;
}

export interface GetPostDataStart {
  type: typeof PostActions.GET_POST_DATA_START;
  payload: PostDataReq;
}

export interface AddToPostDataArray {
  type: typeof PostActions.ADD_TO_POST_DATA_ARRAY;
  payload: Post[];
}

export interface AddPostDataToFeedArray {
  type: typeof PostActions.ADD_POST_DATA_TO_FEED_ARRAY;
  payload: Post[];
}

export interface GetPostDataFailure {
  type: typeof PostActions.GET_POST_DATA_FAILURE;
  payload: PostError;
}

export interface GetPostFileStart {
  type: typeof PostActions.GET_POST_FILE_START;
  payload: PostFileReq;
}

export interface GetPostFileSuccess {
  type: typeof PostActions.GET_POST_FILE_SUCCESS;
  payload: PostFile;
}

export interface GetProfilePhotoFileSuccess {
  type: typeof PostActions.GET_PROFILE_PHOTO_FILE_SUCCESS;
  payload: PostFile;
}

export interface GetPostFileFailure {
  type: typeof PostActions.GET_POST_FILE_FAILURE;
  payload: PostError;
}

export interface ArchivePostStart {
  type: typeof PostActions.ARCHIVE_POST_START;
  payload: ArchivePostReq;
}

export interface ArchivePostSuccess {
  type: typeof PostActions.ARCHIVE_POST_SUCCESS;
  payload: string;
}

export interface ArchivePostFailure {
  type: typeof PostActions.ARCHIVE_POST_FAILURE;
  payload: PostError;
}

export interface DeleteReactionStart {
  type: typeof PostActions.DELETE_REACTION_START;
  payload: DeleteReactionReq;
}

export interface DeleteReactionSuccess {
  type: typeof PostActions.DELETE_REACTION_SUCCESS;
  payload: DeleteReactionConfirm;
}

export interface DeleteReactionFailure {
  type: typeof PostActions.DELETE_REACTION_FAILURE;
  payload: PostError;
}

export interface ClearArchivePostStatuses {
  type: typeof PostActions.CLEAR_ARCHIVE_POST_STATUSES;
  payload: null;
}

export interface GetOtherUserProfilePhotoFileSuccess {
  type: typeof PostActions.GET_OTHER_USER_PROFILE_PHOTO_FILE_SUCCESS;
  payload: PostFile;
}

export interface GetUserPhotoForFollowArraySuccess {
  type: typeof PostActions.GET_USER_PHOTO_FOR_FOLLOW_ARRAY_SUCCESS;
  payload: PostFile;
}

export interface GetUserPhotoForSuggestionArraySuccess {
  type: typeof PostActions.GET_USER_PHOTO_FOR_SUGGESTION_ARRAY_SUCCESS;
  payload: PostFile;
}

export interface GetUserPhotoForReactorArraySuccess {
  type: typeof PostActions.GET_USER_PHOTO_FOR_REACTOR_ARRAY_SUCCESS;
  payload: PostFile;
}

export interface ClearFollowPhotoFileArray {
  type: typeof PostActions.CLEAR_FOLLOW_PHOTO_FILE_ARRAY;
  payload: null;
}

export interface ClearSuggestionPhotoFileArray {
  type: typeof PostActions.CLEAR_SUGGESTION_PHOTO_FILE_ARRAY;
  payload: null;
}

export interface ClearPostFilesAndData {
  type: typeof PostActions.CLEAR_POST_FILES_AND_DATA;
  payload: null;
}

export interface ClearPostState {
  type: typeof PostActions.CLEAR_POST_STATE;
  payload: null;
}

export interface SetCommentToDelete {
  type: typeof PostActions.SET_COMMENT_TO_DELETE;
  payload: DeleteReactionReq;
}

export interface SetShowCommentOptionsModal {
  type: typeof PostActions.SET_SHOW_COMMENT_OPTIONS_MODAL;
  payload: boolean;
}

export interface ClearPostReactions {
  type: typeof PostActions.CLEAR_POST_REACTIONS;
  payload: null;
}

export interface SetPostMetaDataForUser {
  type: typeof PostActions.SET_POST_META_DATA_FOR_USER;
  payload: PostMetaData;
}

export interface SetPostMetaDataForHashtag {
  type: typeof PostActions.SET_META_DATA_FOR_HASHTAG;
  payload: PostHashtagMetaData;
}

export interface SetPostLikingUsersArray {
  type: typeof PostActions.SET_POST_LIKING_USERS_ARRAY;
  payload: UserInfoAndOtherData[];
}

export interface SetShowPostLikingUsersModal {
  type: typeof PostActions.SET_SHOW_POST_LIKING_USERS_MODAL;
  payload: boolean;
}

export interface SetFeedPagePostModalData {
  type: typeof PostActions.SET_FEED_PAGE_POST_MODAL_DATA;
  payload: PostModalDataToFeed;
}

export interface SetFeedPagePostModalShow {
  type: typeof PostActions.SET_FEED_PAGE_POST_MODAL_SHOW;
  payload: boolean;
}

export interface SetFeedPagePostOptionsModalShow {
  type: typeof PostActions.SET_FEED_PAGE_POST_OPTIONS_MODAL_SHOW;
  payload: boolean;
}

export interface SetClearFeedPagePostModalState {
  type: typeof PostActions.SET_CLEAR_FEED_PAGE_POST_MODAL_STATE;
  payload: boolean;
}

export interface SetShowPostEditForm {
  type: typeof PostActions.SET_SHOW_POST_EDIT_FORM;
  payload: boolean;
}

export interface EditPostDetailsStart {
  type: typeof PostActions.EDIT_POST_DETAILS_START;
  payload: EditPostDetailsReq;
}

export interface EditPostDetailsSuccess {
  type: typeof PostActions.EDIT_POST_DETAILS_SUCCESS;
  payload: Post;
}

export interface EditPostDetailsFailure {
  type: typeof PostActions.EDIT_POST_DETAILS_FAILURE;
  payload: PostError;
}

export interface GetSinglePostDataStart {
  type: typeof PostActions.GET_SINGLE_POST_DATA_START;
  payload: SinglePostDataReq;
}

export interface GetSinglePostDataSuccess {
  type: typeof PostActions.GET_SINGLE_POST_DATA_SUCCESS;
  payload: Post;
}

export interface GetSinglePostDataFailure {
  type: typeof PostActions.GET_SINGLE_POST_DATA_FAILURE;
  payload: PostError;
}

export interface ClearSinglePostData {
  type: typeof PostActions.CLEAR_SINGLE_POST_DATA;
  payload: null;
}

// Interfaces related exclusively to feed-post-container data

export interface GetFeedPostFileSuccess {
  type: typeof PostActions.GET_FEED_POST_FILE_SUCCESS;
  payload: PostFile;
}

export interface GetFeedPostReactionsSuccess {
  type: typeof PostActions.GET_FEED_POST_REACTIONS_SUCCESS;
  payload: Reaction[];
}

export interface GetUserPhotoForFeedReactorArraySuccess {
  type: typeof PostActions.GET_USER_PHOTO_FOR_FEED_REACTOR_ARRAY_SUCCESS;
  payload: PostFile;
}

export interface SetFeedPagePostIdForNavigation {
  type: typeof PostActions.SET_FEED_PAGE_POST_ID_FOR_NAVIGATION;
  payload: string;
}

// Interfaces related to caching /uncaching post modal data

export interface SavePostModalDataToCache {
  type: typeof PostActions.SAVE_POST_MODAL_DATA_TO_CACHE;
  payload: PostModalDataToCache;
}

export interface RemovePostModalDataFromCache {
  type: typeof PostActions.REMOVE_POST_MODAL_DATA_FROM_CACHE;
  payload: string;
}

// Interfaces related to actions involving hashtags

export interface GetPostsWithHashtagStart {
  type: typeof PostActions.GET_POSTS_WITH_HASHTAG_START;
  payload: PostsWithHashtagReq;
}

// Interfaces related to actions involving locations

export interface GetLocationsSuggestionsStart {
  type: typeof PostActions.GET_LOCATIONS_SUGGESTIONS_START;
  payload: string;
}

export interface GetLocationsSuggestionsSuccess {
  type: typeof PostActions.GET_LOCATIONS_SUGGESTIONS_SUCCESS;
  payload: Location[];
}

export interface GetLocationsSuggestionsFailure {
  type: typeof PostActions.GET_LOCATIONS_SUGGESTIONS_FAILURE;
  payload: PostError;
}

export interface SetLocationSelection {
  type: typeof PostActions.SET_LOCATION_SELECTION;
  payload: Location;
}

export interface ClearLocationsSuggestions {
  type: typeof PostActions.CLEAR_LOCATIONS_SUGGESTIONS;
  payload: null;
}

export interface SetIsPostPage {
  type: typeof PostActions.SET_IS_POST_PAGE;
  payload: boolean;
}

export interface GetMapBoxTokenStart {
  type: typeof PostActions.GET_MAPBOX_TOKEN_START;
  payload: null;
}

export interface GetMapBoxTokenSuccess {
  type: typeof PostActions.GET_MAPBOX_TOKEN_SUCCESS;
  payload: string;
}

export interface GetMapBoxTokenFailure {
  type: typeof PostActions.GET_MAPBOX_TOKEN_FAILURE;
  payload: PostError;
}

export interface GetPostsWithLocationStart {
  type: typeof PostActions.GET_POSTS_WITH_LOCATION_START;
  payload: PostsWithLocationReq;
}

export interface SetPostMetaDataForLocation {
  type: typeof PostActions.SET_META_DATA_FOR_LOCATION;
  payload: PostLocationMetaData;
}

export interface SetLocationCoordinates {
  type: typeof PostActions.SET_LOCATION_COORDINATES;
  payload: LocationCoordinates;
}

// Interfaces specific to actions involving video posts

export interface UploadVideoPostFileChunkStart {
  type: typeof PostActions.UPLOAD_VIDEO_POST_FILE_CHUNK_START;
  payload: UploadVideoPostFileChunkReq;
}

export interface UploadVideoPostFileChunkSuccess {
  type: typeof PostActions.UPLOAD_VIDEO_POST_FILE_CHUNK_SUCCESS;
  payload: UploadVideoPostFileChunkResponse;
}

export interface UploadVideoPostFileChunkFailure {
  type: typeof PostActions.UPLOAD_VIDEO_POST_FILE_CHUNK_FAILURE;
  payload: PostError;
}

// Interfaces specific to actions involving conversation avatars

export interface GetConversationAvatarPhotoSuccess {
  type: typeof PostActions.GET_CONVERSATION_AVATAR_PHOTO_SUCCESS;
  payload: PostFile;
}

// Interfaces specific to actions involving conversation photos
// (different from conversation user avatars)
export interface UploadConversationPhotoStart {
  type: typeof PostActions.UPLOAD_CONVERSATION_PHOTO_START;
  payload: FormData;
}

export interface UploadConversationPhotoSuccess {
  type: typeof PostActions.UPLOAD_CONVERSATION_PHOTO_SUCCESS;
  payload: ConversationPhoto;
}

export interface UploadConversationPhotoFailure {
  type: typeof PostActions.UPLOAD_CONVERSATION_PHOTO_FAILURE;
  payload: PostError;
}

// Interfaces specific to actions involving notification
//  user avatars

export interface GetNotificationUserAvatarPhotoSuccess {
  type: typeof PostActions.GET_NOTIFICATION_USER_AVATAR_PHOTO_SUCCESS;
  payload: PostFile;
}

// Interfaces specific to notification post data and files

export interface GetNotificationPostDataSuccess {
  type: typeof PostActions.GET_NOTIFICATION_POST_DATA_SUCCESS;
  payload: Post;
}

export interface GetNotificationPostFileSuccess {
  type: typeof PostActions.GET_NOTIFICATION_POST_FILE_SUCCESS;
  payload: PostFile;
}

export type PostActionTypes =
  | CreatePostStart
  | CreatePostSuccess
  | CreatePostFailure
  | CreatePostReactionStart
  | CreatePostReactionSuccess
  | CreatePostReactionFailure
  | GetPostReactionsStart
  | GetPostReactionsSuccess
  | GetPostReactionsFailure
  | ClearPostStatuses
  | UpdateProfilePhotoStart
  | UpdateProfilePhotoSuccess
  | UpdateProfilePhotoFailure
  | ClearProfilePhotoStatuses
  | GetPostDataStart
  | AddToPostDataArray
  | AddPostDataToFeedArray
  | GetPostDataFailure
  | GetPostFileStart
  | GetPostFileSuccess
  | GetProfilePhotoFileSuccess
  | GetPostFileFailure
  | ArchivePostStart
  | ArchivePostSuccess
  | ArchivePostFailure
  | DeleteReactionStart
  | DeleteReactionSuccess
  | DeleteReactionFailure
  | GetOtherUserProfilePhotoFileSuccess
  | GetUserPhotoForFollowArraySuccess
  | GetUserPhotoForSuggestionArraySuccess
  | GetUserPhotoForReactorArraySuccess
  | ClearArchivePostStatuses
  | ClearFollowPhotoFileArray
  | ClearSuggestionPhotoFileArray
  | ClearPostFilesAndData
  | ClearPostState
  | SetCommentToDelete
  | SetShowCommentOptionsModal
  | ClearPostReactions
  | SetPostMetaDataForUser
  | SetPostMetaDataForHashtag
  | SetPostLikingUsersArray
  | SetShowPostLikingUsersModal
  | SetFeedPagePostModalData
  | SetFeedPagePostModalShow
  | SetFeedPagePostOptionsModalShow
  | SetClearFeedPagePostModalState
  | SetShowPostEditForm
  | EditPostDetailsStart
  | EditPostDetailsSuccess
  | EditPostDetailsFailure
  | GetSinglePostDataStart
  | GetSinglePostDataSuccess
  | GetSinglePostDataFailure
  | ClearSinglePostData
  | GetFeedPostFileSuccess
  | GetFeedPostReactionsSuccess
  | GetUserPhotoForFeedReactorArraySuccess
  | SetFeedPagePostIdForNavigation
  | SavePostModalDataToCache
  | RemovePostModalDataFromCache
  | GetPostsWithHashtagStart
  | GetLocationsSuggestionsStart
  | GetLocationsSuggestionsSuccess
  | GetLocationsSuggestionsFailure
  | SetLocationSelection
  | ClearLocationsSuggestions
  | SetIsPostPage
  | GetMapBoxTokenStart
  | GetMapBoxTokenSuccess
  | GetMapBoxTokenFailure
  | GetPostsWithLocationStart
  | SetPostMetaDataForLocation
  | SetLocationCoordinates
  | UploadVideoPostFileChunkStart
  | UploadVideoPostFileChunkSuccess
  | UploadVideoPostFileChunkFailure
  | GetConversationAvatarPhotoSuccess
  | UploadConversationPhotoStart
  | UploadConversationPhotoSuccess
  | UploadConversationPhotoFailure
  | GetNotificationUserAvatarPhotoSuccess
  | GetNotificationPostDataSuccess
  | GetNotificationPostFileSuccess;
