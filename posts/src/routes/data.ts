import express, { Request, Response } from 'express';
import {
  currentUser,
  requireAuth,
  BadRequestError,
} from '@ggabella-photo-share/common';
import { Post } from '../models/post';

const router = express.Router();

router.post(
  '/api/posts/data',
  requireAuth,
  currentUser,
  async (req: Request, res: Response) => {
    const userId: string = req.body.userId;

    if (!userId) {
      throw new BadRequestError('No user ID was provided.');
    }

    let posts = await Post.find({ userId, archived: { $ne: true } });

    posts = posts.reverse();

    console.log(posts);

    res.status(200).send(posts);
  }
);

export { router as getPostDataRouter };
