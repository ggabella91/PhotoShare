import express, { Request, Response } from 'express';
import { Post } from '../models/post';
import { requireAuth, BadRequestError } from '@ggabella-photo-share/common';

const router = express.Router();

router.patch(
  '/api/posts/:postId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { postId } = req.params;

    const caption = req.body.caption || '';
    const postLocation = req.body.location || '';

    if (!postId) {
      throw new BadRequestError('No post id was provided.');
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { caption, postLocation },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).send(updatedPost);
  }
);

export { router as updatePostDataRouter };
