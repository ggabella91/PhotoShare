import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import userReducer from './user/user.reducer';
import postReducer from './post/post.reducer';
import followerReducer from './follower/follower.reducer';
import messageReducer from './message/message.reducer';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'],
};

const rootReducer = combineReducers({
  user: userReducer,
  post: postReducer,
  follower: followerReducer,
  message: messageReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export default persistReducer(persistConfig, rootReducer);
