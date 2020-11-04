import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@ggabella-photo-share/common';
import AWS from 'aws-sdk';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

AWS.config.update({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: 'us-west-1',
});

const router = express.Router();

router.get('/api/posts', async (req, res) => {
  const s3 = new AWS.S3();

  s3.listBuckets((err, data) => {
    if (err) {
      console.log('Error', err);
      res.send({});
    } else {
      console.log(data.Buckets);
      res.send(data.Buckets);
    }
  });
});

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
