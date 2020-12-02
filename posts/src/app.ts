import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from '@ggabella-photo-share/common';
import { createPostRouter } from './routes/new';
import { profilePhotoRouter } from './routes/profile-photo';
import { getPostDataRouter } from './routes/data';
import { getPostFilesRouter } from './routes/get-post-files';

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

app.use(createPostRouter);
app.use(profilePhotoRouter);
app.use(getPostDataRouter);
app.use(getPostFilesRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
