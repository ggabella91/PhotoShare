import express, { Request, Response } from 'express';
import { Reaction } from '../models/reaction';
import { requireAuth, BadRequestError } from '@ggabella-photo-share/common';

const router = express.Router();

router.delete(
  '/api/reactions',
  requireAuth,
  async (req: Request, res: Response) => {
    const reactionId: string = req.body.reactionId;

    await Reaction.findByIdAndDelete(reactionId);

    res.status(204).send({ reactionId });
  }
);

export { router as deleteReactionRouter };
