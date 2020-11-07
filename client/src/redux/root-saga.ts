import { all, call } from 'redux-saga/effects';

import { userSagas } from './user/user.sagas';
import { postSagas } from './post/post.sagas';

export default function* rootSaga() {
  yield all([call(userSagas), call(postSagas)]);
}
