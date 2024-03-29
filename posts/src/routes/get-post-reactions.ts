import express, { Request, Response } from 'express';
import {
  currentUser,
  requireAuth,
  BadRequestError,
} from '@ggabella-photo-share/common';
import { Reaction } from '../models/reaction';

const router = express.Router();

router.get(
  '/api/reactions/:postId',
  requireAuth,
  currentUser,
  async (req: Request, res: Response) => {
    const { postId } = req.params;

    if (!postId) {
      throw new BadRequestError('No post ID was provided.');
    }

    let reactions = await Reaction.find({ postId });

    res.status(200).send(reactions);
  }
);

export { router as getReactionsRouter };
