import {
  MessageState,
  MessageActions,
  MessageActionTypes,
} from './message.types';

const INITIAL_STATE: MessageState = {
  user: null,
  messages: [],
  findOrCreateUserError: null,
  updateUserAuthStatusConfirm: null,
  updateUserAuthStatusError: null,
};

const messageReducer = (
  state = INITIAL_STATE,
  action: MessageActionTypes
): MessageState => {
  switch (action.type) {
    case MessageActions.FIND_OR_CREATE_USER_SUCCESS:
      return {
        ...state,
        user: action.payload,
        findOrCreateUserError: null,
      };
    case MessageActions.UPDATE_USER_AUTH_STATUS_SUCCESS:
      return {
        ...state,
        updateUserAuthStatusConfirm: action.payload,
      };
    case MessageActions.FIND_OR_CREATE_USER_FAILURE:
      return {
        ...state,
        findOrCreateUserError: action.payload,
      };
    case MessageActions.UPDATE_USER_AUTH_STATUS_FAILURE:
      return {
        ...state,
        updateUserAuthStatusError: action.payload,
      };
    default:
      return state;
  }
};

export default messageReducer;
