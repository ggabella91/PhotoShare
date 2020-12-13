import express, { Request, Response } from 'express';
import {
  currentUser,
  requireAuth,
  BadRequestError,
} from '@ggabella-photo-share/common';
import { AWS } from '../index';
import { S3 } from 'aws-sdk';
import { redisClient } from '../index';
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

    redisClient.GET(s3Key, async (err, cachedFile) => {
      if (!cachedFile) {
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
            const buffer = data.Body;

            const convertedFileString = encode(buffer as Buffer);

            redisClient.SET(s3Key, convertedFileString);

            res.send(convertedFileString);
          }
        });
      } else {
        res.send(cachedFile);
      }
    });
  }
);

export { router as getPostFilesRouter };
