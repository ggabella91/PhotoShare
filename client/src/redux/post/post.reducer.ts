import { PostActions, PostActionTypes, PostState } from './post.types';

const INITIAL_STATE: PostState = {
  posts: [],
  postError: null,
};

const postReducer = (state = INITIAL_STATE, action: PostActionTypes) => {
  switch (action.type) {
    case PostActions.CREATE_POST_SUCCESS:
      return {
        ...state,
        posts: [...state.posts, action.payload],
      };
    case PostActions.CREATE_POST_FAILURE:
      return {
        ...state,
        postError: action.payload,
      };
    default:
      return state;
  }
};

export default postReducer;
