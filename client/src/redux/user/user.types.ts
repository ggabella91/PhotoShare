interface UserTypes {
  CHECK_USER_SESSION: string;
  SET_CURRENT_USER: string;
  SIGN_UP_START: string;
  SIGN_UP_SUCCESS: string;
  SIGN_UP_FAILURE: string;
  SIGN_IN_START: string;
  SIGN_IN_SUCCESS: string;
  SIGN_IN_FAILURE: string;
  SIGN_OUT_START: string;
  SIGN_OUT_SUCCESS: string;
  SIGN_OUT_FAILURE: string;
}

const UserActions: UserTypes = {
  CHECK_USER_SESSION: 'CHECK_USER_SESSION',
  SET_CURRENT_USER: 'SET_CURRENT_USER',
  SIGN_UP_START: 'SIGN_UP_START',
  SIGN_UP_SUCCESS: 'SIGN_UP_SUCCESS',
  SIGN_UP_FAILURE: 'SIGN_UP_FAILURE',
  SIGN_IN_START: 'SIGN_IN_START',
  SIGN_IN_SUCCESS: 'SIGN_IN_SUCCESS',
  SIGN_IN_FAILURE: 'SIGN_IN_FAILURE',
  SIGN_OUT_START: 'SIGN_OUT_START',
  SIGN_OUT_SUCCESS: 'SIGN_OUT_SUCCESS',
  SIGN_OUT_FAILURE: 'SIGN_OUT_FAILURE',
};

export default UserActions;
