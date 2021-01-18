import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@ggabella-photo-share/common';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { forgotPasswordRouter } from './routes/forgot-password';
import { resetPasswordRouter } from './routes/reset-password';
import { updatePasswordRouter } from './routes/update-password';
import { updateUserRouter } from './routes/update-user';
import { deleteUserRouter } from './routes/delete';
import { getUserRouter } from './routes/get-user';
import { getSuggestedUsersRouter } from './routes/get-suggested-users';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(forgotPasswordRouter);
app.use(resetPasswordRouter);
app.use(updatePasswordRouter);
app.use(updateUserRouter);
app.use(deleteUserRouter);
app.use(getUserRouter);
app.use(getSuggestedUsersRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
