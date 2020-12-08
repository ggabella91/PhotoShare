import { UserActions, UserActionTypes, UserState } from './user.types';

const INITIAL_STATE: UserState = {
  currentUser: null,
  signUpError: null,
  signInOrOutError: null,
  changeInfoConfirm: null,
  changeInfoError: null,
  changePasswordConfirm: null,
  changePasswordError: null,
  forgotConfirm: null,
  forgotError: null,
  resetConfirm: null,
  resetError: null,
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
        changeInfoConfirm: 'Info changed succesfully!',
        changeInfoError: null,
      };
    case UserActions.CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        changePasswordConfirm: 'Password changed successfully!',
        changePasswordError: null,
      };
    case UserActions.FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        forgotConfirm: action.payload,
        forgotError: null,
      };
    case UserActions.RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        resetConfirm: action.payload,
        resetError: null,
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
      return {
        ...state,
        forgotConfirm: null,
        forgotError: action.payload,
      };
    case UserActions.RESET_PASSWORD_FAILURE:
      return {
        ...state,
        resetConfirm: null,
        resetError: action.payload,
      };
    case UserActions.DELETE_ACCOUNT_FAILURE:
      return {
        ...state,
        deleteAccountError: action.payload,
      };
    case UserActions.CLEAR_INFO_STATUSES:
      return {
        ...state,
        changeInfoError: null,
        changeInfoConfirm: null,
      };
    case UserActions.CLEAR_PASSWORD_STATUSES:
      return {
        ...state,
        changePasswordError: null,
        changePasswordConfirm: null,
      };
    default:
      return state;
  }
};

export default userReducer;
