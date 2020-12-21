import express, { Request, Response } from 'express';
import { requireAuth, BadRequestError } from '@ggabella-photo-share/common';
import { Post } from '../models/post';

const router = express.Router();

router.delete(
  '/api/posts/:postId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      throw new BadRequestError('Post not found');
    }

    post.archived = true;
    await post.save();

    res.status(200).send({ message: 'Post archived!' });
  }
);

export { router as archivePostRouter };
