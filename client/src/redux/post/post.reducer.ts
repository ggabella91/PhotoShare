import { PostActions, PostActionTypes, PostState } from './post.types';

const INITIAL_STATE: PostState = {
  posts: [],
  postError: null,
  postConfirm: null,
};

const postReducer = (state = INITIAL_STATE, action: PostActionTypes) => {
  switch (action.type) {
    case PostActions.CREATE_POST_SUCCESS:
      return {
        ...state,
        postError: null,
        postConfirm: 'Post uploaded!',
        posts: [...state.posts, action.payload],
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
