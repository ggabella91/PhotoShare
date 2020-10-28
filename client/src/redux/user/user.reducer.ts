import UserActions from './user.types';

interface UserState {
  currentUser: { name: string; email: string } | null;
  signUpError: string | null;
  signInOrOutError: string | null;
}

const INITIAL_STATE: UserState = {
  currentUser: null,
  signUpError: null,
  signInOrOutError: null,
};

const userReducer = (state = INITIAL_STATE, action: any) => {
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
  }
};

export default userReducer;
