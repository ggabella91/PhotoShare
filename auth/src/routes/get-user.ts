import express, { Request, Response } from 'express';
import { User } from '../models/user';
import { BadRequestError } from '@ggabella-photo-share/common';

const router = express.Router();

router.get('/api/users/:username', async (req: Request, res: Response) => {
  const { username } = req.params;

  const existingUser = await User.findOne({ username });

  console.log(existingUser);

  if (!existingUser) {
    throw new BadRequestError('User not found');
  }

  res.status(200).send(existingUser.toJSON());
});

export { router as getUserRouter };
