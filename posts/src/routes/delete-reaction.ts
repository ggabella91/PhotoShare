import express, { Request, Response } from 'express';
import { Reaction } from '../models/reaction';
import { requireAuth, BadRequestError } from '@ggabella-photo-share/common';

const router = express.Router();

router.delete(
  '/api/reactions',
  requireAuth,
  async (req: Request, res: Response) => {
    const reactingUserId: string = req.body.reactingUserId;
    const isLikeRemoval: boolean = req.body.isLikeRemoval;
    const reactionId: string = req.body.reactionId;

    let responseMessage: string;

    if (isLikeRemoval) {
      await Reaction.findOneAndDelete({
        reactingUserId,
        likedPost: isLikeRemoval,
      });

      responseMessage = 'Like removed successfully!';
    } else {
      await Reaction.findByIdAndDelete(reactionId);

      responseMessage = 'Comment removed successfully!';
    }

    res.status(204).send(responseMessage);
  }
);

export { router as deleteReactionRouter };
