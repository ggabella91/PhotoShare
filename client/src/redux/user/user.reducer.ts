import { Reducer } from 'redux';
import { UserActions, UserActionTypes, UserState } from './user.types';

const INITIAL_STATE: UserState = {
  currentUser: null,
  signUpError: null,
  signInOrOutError: null,
};

const userReducer = (state = INITIAL_STATE, action: UserActionTypes) => {
  switch (action.type) {
    case UserActions.SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload,
      };
    case UserActions.SIGN_UP_SUCCESS:
      return {
        ...state,
        currentUser: action.payload,
        signUpError: null,
      };
    case UserActions.SIGN_IN_SUCCESS:
      return {
        ...state,
        currentUser: action.payload,
        signInOrOutError: null,
      };
    case UserActions.SIGN_OUT_SUCCESS:
      return {
        ...state,
        currentUser: action.payload,
        signInOrOutError: null,
      };
    case UserActions.SIGN_UP_FAILURE:
      return {
        ...state,
        signUpError: action.payload,
      };
    case UserActions.SIGN_IN_FAILURE:
    case UserActions.SIGN_OUT_FAILURE:
      return {
        ...state,
        signInOrOutError: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
