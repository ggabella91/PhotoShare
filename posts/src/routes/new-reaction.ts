import express, { Request, Response } from 'express';
import { Reaction } from '../models/reaction';
import { requireAuth, BadRequestError } from '@ggabella-photo-share/common';

const router = express.Router();

router.post(
  '/api/reactions/new',
  requireAuth,
  async (req: Request, res: Response) => {
    const comment: string = req.body.comment || '';
    const likedPost: boolean = req.body.likedPost;

    const post = Reaction.build({
      comment,
      likedPost,
      createdAt: new Date(),
      postId: req.body.postId,
      reactingUserId: req.currentUser!.id,
    });

    await post.save();

    res.status(201).send(post);
  }
);

export { router as newReactionRouter };
