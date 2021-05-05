import express, { Request, Response } from 'express';
import { Reaction } from '../models/reaction';
import { requireAuth, BadRequestError } from '@ggabella-photo-share/common';

const router = express.Router();

router.delete(
  '/api/reactions',
  requireAuth,
  async (req: Request, res: Response) => {
    console.log('Delete reaction - Request body: ', req.body);

    const reactingUserId: string = req.body.reactingUserId;
    const isLikeRemoval: boolean = req.body.isLikeRemoval;
    const reactionId: string = req.body.reactionId;

    if (isLikeRemoval) {
      await Reaction.findOneAndDelete({
        reactingUserId,
        likedPost: { $eq: isLikeRemoval },
      });
    } else {
      await Reaction.findByIdAndDelete(reactionId);
    }

    res.status(204).send('Reaction deleted successfully!');
  }
);

export { router as deleteReactionRouter };
