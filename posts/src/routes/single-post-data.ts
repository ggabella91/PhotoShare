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

    console.log('postId: ', postId);

    if (!postId) {
      throw new BadRequestError('No post ID was provided.');
    }

    const singlePost = await Post.findOne({
      _id: postId,
      archived: { $ne: true },
    });
    console.log('Single Post Data: ', singlePost);

    res.status(200).send(singlePost);
  }
);

export { router as getSinglePostDataRouter };
