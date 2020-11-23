import express, { Request, Response } from 'express';
import { NotAuthorizedError } from '@ggabella-photo-share/common';

import { User } from '../models/user';

const router = express.Router();

router.patch('/api/users/deleteMe', async (req: Request, res: Response) => {
  if (!req.currentUser) {
    throw new NotAuthorizedError();
  }

  await User.findByIdAndUpdate(req.currentUser!.id, { active: false });

  res.status(200).send({
    status: 'success',
    data: null,
  });
});

export { router as deleteUserRouter };
