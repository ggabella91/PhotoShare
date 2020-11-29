import express, { Request, Response } from 'express';
import {
  currentUser,
  requireAuth,
  BadRequestError,
} from '@ggabella-photo-share/common';
import { Post } from '../models/post';
import { AWS } from '../index';
import { S3 } from 'aws-sdk';
import { encode } from '../utils/encode';
import { Writable } from 'stream';

const router = express.Router();

interface Data {
  Body: Buffer;
}

router.get(
  '/api/posts',
  requireAuth,
  currentUser,
  async (req: Request, res: Response) => {
    const user = req.currentUser;

    if (!user) {
      throw new BadRequestError(
        'No user signed in. Please sign in to access this route.'
      );
    }

    const posts = await Post.find({ userId: user.id });

    const postKeys = posts.map((el) => el.s3Key);

    console.log(postKeys);

    const s3 = new AWS.S3();

    const postFiles: string[] = [];

    for (let key of postKeys) {
      const fetchParams: S3.Types.GetObjectRequest = {
        Bucket: 'photo-share-app',
        Key: key,
      };

      s3.getObject(fetchParams, async (err, data) => {
        if (err) {
          console.log(err);
          throw new Error('Error fetching the photo');
        }
        if (data) {
          console.log(data);
          const buffer = data.Body;

          const convertedFile = encode(buffer as Buffer);

          const image = `<img src='data:image/jpeg;base64,${convertedFile}'/>`;

          res.send(image);
        }
      });
    }
  }
);

export { router as getPostsRouter };
