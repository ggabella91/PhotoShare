import express, { Request, Response } from 'express';
import {
  currentUser,
  requireAuth,
  BadRequestError,
} from '@ggabella-photo-share/common';
import { Post } from '../models/post';
import { AWS } from '../index';
import { S3 } from 'aws-sdk';

const router = express.Router();

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

    res.send(postKeys);
  }
);

export { router as getPostsRouter };
