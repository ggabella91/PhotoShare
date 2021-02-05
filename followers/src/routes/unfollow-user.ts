import express, { Request, Response } from 'express';
import { Follower } from '../models/follower';
import { requireAuth, BadRequestError } from '@ggabella-photo-share/common';

const router = express.Router();

router.post(
  '/api/followers/unfollow-user/:userId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!userId) {
      throw new BadRequestError('User not found');
    }

    const following = await Follower.find({
      userId,
      followerId: req.currentUser!.id,
    });

    if (following) {
      await Follower.deleteOne({
        userId,
        followerId: req.currentUser!.id,
      });

      res.status(204).send('User unfollowed successfully');
    } else {
      res.status(404).send('No follow record found for user');
    }
  }
);

export { router as unfollowUserRouter };
