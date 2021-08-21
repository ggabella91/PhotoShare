import express, { Request, Response } from 'express';
import {
  currentUser,
  requireAuth,
  BadRequestError,
} from '@ggabella-photo-share/common';
import { Post } from '../models/post';

const router = express.Router();

router.get(
  '/api/posts/data/:postId',
  requireAuth,
  currentUser,
  async (req: Request, res: Response) => {
    const { postId } = req.params;

    if (!postId) {
      throw new BadRequestError('No post ID was provided.');
    }

    const singlePost = await Post.findById({ postId, archived: { $ne: true } });
    console.log(singlePost);

    res.status(200).send({ singlePost });
  }
);

export { router as getSinglePostDataRouter };
