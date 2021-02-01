import express, { Request, Response } from 'express';
import { Follower, FollowerDoc } from '../models/follower';
import { requireAuth, BadRequestError } from '@ggabella-photo-share/common';

const router = express.Router();

router.get(
  '/api/followers/get-followers/:userId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { userId } = req.params;

    const followers: FollowerDoc[] = await Follower.find({
      userId,
    });

    res.status(200).send(followers);
  }
);

export { router as getFollowersRouter };
