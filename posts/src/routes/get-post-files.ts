import express, { Request, Response } from 'express';
import {
  currentUser,
  requireAuth,
  BadRequestError,
} from '@ggabella-photo-share/common';
import { AWS } from '../index';
import { S3 } from 'aws-sdk';
import { redisClient } from '../index';
import { encode } from '../utils/converters';

const router = express.Router();

router.get(
  '/api/posts/files',
  requireAuth,
  currentUser,
  async (req: Request, res: Response) => {
    const user = req.currentUser;

    const bucket: string = (req.query.bucket as string) || '';
    const s3Key = (req.query.s3Key as string) || '';

    if (!user) {
      throw new BadRequestError(
        'No user signed in. Please sign in to access this route.'
      );
    }

    const cachedFile = await redisClient.get(s3Key);

    let keyDeleted: boolean | null = null;

    if (cachedFile) {
      const ttl = await redisClient.ttl(s3Key);
      console.log('Current ttl of cached file: ', ttl);

      if (ttl <= 0) {
        console.log('Cached redis value has expired, ttl is: ', ttl);

        await redisClient.del(s3Key);
        keyDeleted = true;
      }
    }

    if (!cachedFile || keyDeleted) {
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

          const expiration = parseInt(process.env.REDIS_CACHE_EXPIRATION!);

          redisClient.setEx(s3Key, expiration, convertedFileString);

          res.send(convertedFileString);
        }
      });
    } else {
      console.log('Sending cached file!');
      res.send(cachedFile);
    }
  }
);

export { router as getPostFilesRouter };
