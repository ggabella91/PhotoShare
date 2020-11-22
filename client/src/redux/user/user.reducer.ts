import { UserActions, UserActionTypes, UserState } from './user.types';

const INITIAL_STATE: UserState = {
  currentUser: null,
  signUpError: null,
  signInOrOutError: null,
  changeInfoConfirm: null,
  changeInfoError: null,
  changePasswordConfirm: null,
  changePasswordError: null,
  forgotOrResetConfirm: null,
  forgotOrResetError: null,
  deleteAccountError: null,
};

const userReducer = (state = INITIAL_STATE, action: UserActionTypes) => {
  switch (action.type) {
    case UserActions.SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload,
        signInOrOutError: null,
        signUpError: null,
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
    case UserActions.CHANGE_INFO_SUCCESS:
      return {
        ...state,
        changeInfoConfirm: action.payload,
        changeInfoError: null,
      };
    case UserActions.CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        changePasswordConfirm: action.payload,
        changePasswordError: null,
      };
    case UserActions.FORGOT_PASSWORD_SUCCESS:
    case UserActions.RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        forgotOrResetConfirm: action.payload,
        forgotOrResetError: null,
      };
    case UserActions.DELETE_ACCOUNT_SUCCESS:
      return {
        ...state,
        currentUser: null,
        deleteAccountError: null,
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
    case UserActions.CHANGE_INFO_FAILURE:
      return {
        ...state,
        changeInfoConfirm: null,
        changeInfoError: action.payload,
      };
    case UserActions.CHANGE_PASSWORD_FAILURE:
      return {
        ...state,
        changePasswordConfirm: null,
        changePasswordError: action.payload,
      };
    case UserActions.FORGOT_PASSWORD_FAILURE:
    case UserActions.RESET_PASSWORD_FAILURE:
      return {
        ...state,
        forgotOrResetConfirm: null,
        forgotOrResetError: action.payload,
      };
    case UserActions.DELETE_ACCOUNT_FAILURE:
      return {
        ...state,
        deleteAccountError: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
