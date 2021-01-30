import express, { Request, Response } from 'express';
import { Follower } from '../models/follower';
import { requireAuth, BadRequestError } from '@ggabella-photo-share/common';

const router = express.Router();

router.post(
  '/api/followers/follow-new-user/:userId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!userId) {
      throw new BadRequestError('User not found');
    }

    const newFollower = Follower.build({
      userId,
      followerId: req.currentUser!.id,
    });

    await newFollower.save();

    res.status(201).send(newFollower);
  }
);

export { router as followNewUserRouter };
