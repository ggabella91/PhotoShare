import { MessageState, MessageActionTypes } from './message.types';

const INITIAL_STATE: MessageState = {
  isAuthenticated: false,
  userChatNickname: '',
  conversations: [],
  messages: [],
};

const messageReducer = (
  state = INITIAL_STATE,
  action: MessageActionTypes
): MessageState => {
  switch (action.type) {
    default:
      return state;
  }
};

export default messageReducer;
