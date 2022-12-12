import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from '@ggabella-photo-share/common';
import { followNewUserRouter } from './routes/follow-new-user';
import { getFollowersRouter } from './routes/get-followers';
import { getUsersFollowing } from './routes/get-users-following';
import { unfollowUserRouter } from './routes/unfollow-user';
import { postNotificationRouter } from './routes/post-notification';
import { getNotificationsRouter } from './routes/get-notifications';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

app.use(currentUser);

app.use(followNewUserRouter);
app.use(getFollowersRouter);
app.use(getUsersFollowing);
app.use(unfollowUserRouter);
app.use(postNotificationRouter);
app.use(getNotificationsRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
