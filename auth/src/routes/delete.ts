import express, { Request, Response } from 'express';

import { User } from '../models/user';

const router = express.Router();

router.patch('/api/users/deleteMe', async (req: Request, res: Response) => {
  await User.findByIdAndUpdate(req.currentUser!.id, { active: false });

  res.status(200).send({
    status: 'success',
    data: null,
  });
});

export { router as deleteUserRouter };
