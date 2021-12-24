import express, { Request, Response } from 'express';
import { Post } from '../models/post';
import { requireAuth, BadRequestError } from '@ggabella-photo-share/common';
import { extractHashtags } from '../utils/extractHashtags';

const router = express.Router();

router.patch(
  '/api/posts/:postId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { postId } = req.params;

    const caption = req.body.caption || '';
    const postLocation = req.body.location || '';
    let hashtags: string[];
    if (caption) {
      hashtags = extractHashtags(caption);
    } else {
      hashtags = [];
    }

    if (!postId) {
      throw new BadRequestError('No post id was provided.');
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { caption, postLocation, hashtags },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).send(updatedPost);
  }
);

export { router as updatePostDataRouter };
