import express, { Request, Response } from 'express';
import { Follower, FollowerDoc } from '../models/follower';
import { requireAuth, BadRequestError } from '@ggabella-photo-share/common';

const router = express.Router();

router.get(
  '/api/followers/get-users-following/:userId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { userId } = req.params;

    const usersFollowing: FollowerDoc[] = await Follower.find({
      followerId: userId,
    });

    res.status(200).send(usersFollowing.map((el: FollowerDoc) => el.toJSON()));
  }
);

export { router as getUsersFollowing };
