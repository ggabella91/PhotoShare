import express, { Request, Response } from 'express';
import {
  currentUser,
  requireAuth,
  BadRequestError,
} from '@ggabella-photo-share/common';
import { Post } from '../models/post';

const router = express.Router();

router.get(
  '/api/postData',
  requireAuth,
  currentUser,
  async (req: Request, res: Response) => {
    const user = req.currentUser;

    if (!user) {
      throw new BadRequestError(
        'No user signed in. Please sign in to access this route.'
      );
    }

    let posts = await Post.find({ userId: user.id });

    posts = posts.reverse();

    console.log(posts);

    res.status(200).send({
      posts,
    });
  }
);

export { router as getPostDataRouter };
