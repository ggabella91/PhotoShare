import express, { Request, Response } from 'express';
import { AWS } from '../index';

const router = express.Router();

router.get('/api/posts', async (req: Request, res: Response) => {
  const s3 = new AWS.S3();

  s3.listBuckets((err, data) => {
    if (err) {
      console.log('Error', err);
      res.send({});
    } else {
      console.log('Data: ', data.Buckets);
      res.send(data.Buckets);
    }
  });
});

export { router as indexBucketsRouter };
