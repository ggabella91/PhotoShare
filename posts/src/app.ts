import express from 'express';
import 'express-async-errors';
import { json, urlencoded } from 'body-parser';
import cookieSession from 'cookie-session';
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from '@ggabella-photo-share/common';
import { createPostRouter } from './routes/new';
import { profilePhotoRouter } from './routes/profile-photo';
import { getPostDataRouter } from './routes/data';
import { getPostFileRouter } from './routes/get-post-file';
import { archivePostRouter } from './routes/archive';
import { newReactionRouter } from './routes/new-reaction';
import { getReactionsRouter } from './routes/get-post-reactions';
import { deleteReactionRouter } from './routes/delete-reaction';
import { updatePostDataRouter } from './routes/update-data';
import { getSinglePostDataRouter } from './routes/single-post-data';
import { getPostsWithHashtagRouter } from './routes/get-posts-with-hashtag';
import { getLocationsSuggestionsRouter } from './routes/get-locations-suggestions';
import { getMapBoxApiAccessTokenRouter } from './routes/get-mapbox-api-key';
import { getPostsWithLocationRouter } from './routes/get-posts-with-location';
import { createVideoPostRouter } from './routes/new-video';

const app = express();
app.set('trust proxy', true);
app.use(json({ limit: '50mb' }));
app.use(urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

app.use(currentUser);

app.use(createPostRouter);
app.use(profilePhotoRouter);
app.use(getPostDataRouter);
app.use(getPostFileRouter);
app.use(archivePostRouter);
app.use(newReactionRouter);
app.use(getReactionsRouter);
app.use(deleteReactionRouter);
app.use(updatePostDataRouter);
app.use(getSinglePostDataRouter);
app.use(getPostsWithHashtagRouter);
app.use(getLocationsSuggestionsRouter);
app.use(getMapBoxApiAccessTokenRouter);
app.use(getPostsWithLocationRouter);
app.use(createVideoPostRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
