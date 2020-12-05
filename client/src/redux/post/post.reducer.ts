import { PostActions, PostActionTypes, PostState } from './post.types';

const INITIAL_STATE: PostState = {
  posts: null,
  postError: null,
  postConfirm: null,
  profilePhoto: null,
  profilePhotoError: null,
  profilePhotoConfirm: null,
};

const postReducer = (state = INITIAL_STATE, action: PostActionTypes) => {
  switch (action.type) {
    case PostActions.UPDATE_PROFILE_PHOTO_SUCCESS:
      return {
        ...state,
        profilePhotoError: null,
        profilePhotoConfirm: 'Profile photo updated!',
      };
    case PostActions.CREATE_POST_SUCCESS:
      return {
        ...state,
        postError: null,
        postConfirm: 'Post uploaded!',
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
    default:
      return state;
  }
};

export default postReducer;
