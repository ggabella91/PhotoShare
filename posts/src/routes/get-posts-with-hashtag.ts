import express, { Request, Response } from 'express';
import {
  currentUser,
  requireAuth,
  BadRequestError,
} from '@ggabella-photo-share/common';
import { Post } from '../models/post';

const router = express.Router();

router.get(
  '/api/posts/hashtags/:hashtag',
  requireAuth,
  currentUser,
  async (req: Request, res: Response) => {
    const { hashtag } = req.params;

    if (!hashtag) {
      throw new BadRequestError('No hashtag was provided.');
    }

    let postsWithHashtag = await Post.find({
      hashtags: hashtag,
    });

    res.status(200).send(postsWithHashtag);
  }
);

export { router as getPostsWithHashtagRouter };
