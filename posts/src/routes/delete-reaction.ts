import express, { Request, Response } from 'express';
import { Reaction } from '../models/reaction';
import { requireAuth, BadRequestError } from '@ggabella-photo-share/common';

const router = express.Router();

router.delete(
  '/api/posts/reaction',
  requireAuth,
  async (req: Request, res: Response) => {
    const reactingUserId = req.body.reactingUserId;
    const isLikeRemoval: boolean = req.body.isLikeRemoval;
    const reactionId: string = req.body.reactionId;

    if (isLikeRemoval) {
      Reaction.findOneAndDelete({
        reactingUserId,
        likedPost: isLikeRemoval,
      });
    } else {
      Reaction.findByIdAndDelete(reactionId);
    }

    res.status(204).send('Reaction deleted successfully!');
  }
);

export { router as deleteReactionRouter };
