import express, { Request, Response } from 'express';
import { User } from '../models/user';
import { BadRequestError } from '@ggabella-photo-share/common';

const router = express.Router();

router.get('/api/users/id/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;

  const existingUser = await User.findById({ userId });

  if (!existingUser) {
    throw new BadRequestError('User not found');
  }

  res.status(200).send(existingUser.toJSON());
});

export { router as getUserByIdRouter };
