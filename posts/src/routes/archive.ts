import express, { Request, Response } from 'express';
import { requireAuth, BadRequestError } from '@ggabella-photo-share/common';
import { Post } from '../models/post';

const router = express.Router();

router.patch(
  '/api/posts/:postId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { postId } = req.params;

    await Post.findByIdAndUpdate(postId, { archived: true });

    res.status(204).send({ message: 'Post archived!' });
  }
);

export { router as archivePostRouter };
