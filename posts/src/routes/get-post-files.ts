import express, { Request, Response } from 'express';
import {
  currentUser,
  requireAuth,
  BadRequestError,
} from '@ggabella-photo-share/common';
import { AWS } from '../index';
import { S3 } from 'aws-sdk';
import { encode } from '../utils/encode';

const router = express.Router();

router.post(
  '/api/posts/files',
  requireAuth,
  currentUser,
  async (req: Request, res: Response) => {
    const user = req.currentUser;

    const { bucket, s3Key } = req.body;

    if (!user) {
      throw new BadRequestError(
        'No user signed in. Please sign in to access this route.'
      );
    }

    const s3 = new AWS.S3();

    const fetchParams: S3.Types.GetObjectRequest = {
      Bucket: bucket,
      Key: s3Key,
    };

    s3.getObject(fetchParams, async (err, data) => {
      if (err) {
        console.log(err);
        throw new Error('Error fetching the photo');
      }
      if (data) {
        console.log(data);
        const buffer = data.Body;

        const convertedFileString = encode(buffer as Buffer);

        // const image = `<img src='data:image/jpeg;base64,${convertedFileString}'/>`;

        res.send(convertedFileString);
      }
    });
  }
);

export { router as getPostFilesRouter };
