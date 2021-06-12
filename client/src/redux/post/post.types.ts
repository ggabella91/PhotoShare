import { UserInfoAndOtherData } from '../../components/user-info/user-info.component';
import { PostModalDataToFeed } from '../../components/feed-post-container/feed-post-container.component';

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
  GET_POST_DATA_SUCCESS = 'GET_POST_DATA_SUCCESS',
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
}

export interface PostError {
  statusCode: number;
  message: string;
}

export interface Post {
  fileName: string;
  caption?: string;
  postLocation?: string;
  createdAt: Date;
  id: string;
  s3Key: string;
  s3ObjectURL: string;
  userId: string;
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

export enum UserType {
  self = 'self',
  other = 'other',
  followArray = 'followArray',
  suggestionArray = 'suggestionArray',
  postReactorsArray = 'postReactorsArray',
}

export enum DataRequestType {
  single = 'single',
  feed = 'feed',
}

export interface PostDataReq {
  userId: string;
  dataReqType: DataRequestType;
  pageToShow?: number;
  limit?: number;
}

export interface PostFileReq {
  s3Key: string;
  bucket: string;
  user: UserType;
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
  reactionId: string;
  reactingUserId: string;
  isLikeRemoval: boolean;
}

export interface PostMetaData {
  queryLength: number;
  userId: string;
}

export interface PostState {
  postData: Post[] | null;
  postDataFeedArray: Post[][];
  postReactionsArray: Reaction[][];
  postReactionError: PostError | null;
  postReactionConfirm: string | null;
  postFiles: PostFile[];
  getPostDataError: PostError | null;
  getPostDataConfirm: string | null;
  getPostFileError: PostError | null;
  getPostFileConfirm: string | null;
  getPostReactionsError: PostError | null;
  getPostReactionsConfirm: string | null;
  postError: PostError | null;
  postConfirm: string | null;
  profilePhotoKey: string | null;
  profilePhotoFile: string | null;
  profilePhotoError: PostError | null;
  profilePhotoConfirm: string | null;
  archivePostConfirm: string | null;
  archivePostError: PostError | null;
  deleteReactionConfirm: string | null;
  deleteReactionError: PostError | null;
  otherUserProfilePhotoFile: string | null;
  followPhotoFileArray: PostFile[] | null;
  suggestionPhotoFileArray: PostFile[] | null;
  reactorPhotoFileArray: PostFile[] | null;
  usersProfilePhotoConfirm: string | null;
  commentToDelete: DeleteReactionReq | null;
  showCommentOptionsModal: boolean;
  isLoadingPostData: boolean;
  postMetaDataForUser: PostMetaData | null;
  postLikingUsersArray: UserInfoAndOtherData[] | null;
  showPostLikingUsersModal: boolean;
  feedPagePostModalData: PostModalDataToFeed | null;
  feedPagePostModalShow: boolean;
  feedPagePostOptionsModalShow: boolean;
  clearFeedPagePostModalState: boolean;
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
  payload: Reaction;
}

export interface CreatePostReactionFailure {
  type: typeof PostActions.CREATE_POST_REACTION_FAILURE;
  payload: PostError;
}

export interface GetPostReactionsStart {
  type: typeof PostActions.GET_POST_REACTIONS_START;
  payload: string;
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

export interface GetPostDataSuccess {
  type: typeof PostActions.GET_POST_DATA_SUCCESS;
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
  payload: Error;
}

export interface DeleteReactionStart {
  type: typeof PostActions.DELETE_REACTION_START;
  payload: DeleteReactionReq;
}

export interface DeleteReactionSuccess {
  type: typeof PostActions.DELETE_REACTION_SUCCESS;
  payload: string;
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
  payload: string;
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
  | GetPostDataSuccess
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
  | SetPostLikingUsersArray
  | SetShowPostLikingUsersModal
  | SetFeedPagePostModalData
  | SetFeedPagePostModalShow
  | SetFeedPagePostOptionsModalShow
  | SetClearFeedPagePostModalState;
