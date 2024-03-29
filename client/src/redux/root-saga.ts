import { all, call } from 'redux-saga/effects';

import { userSagas } from './user/user.sagas';
import { postSagas } from './post/post.sagas';
import { followerSagas } from './follower/follower.sagas';
import { messageSagas } from './message/message.sagas';

export default function* rootSaga() {
  yield all([
    call(userSagas),
    call(postSagas),
    call(followerSagas),
    call(messageSagas),
  ]);
}
