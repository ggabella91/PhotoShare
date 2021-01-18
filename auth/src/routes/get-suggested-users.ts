import express, { Request, Response } from 'express';
import { User } from '../models/user';
import { BadRequestError } from '@ggabella-photo-share/common';

const router = express.Router();

router.get(
  '/api/users/suggested/:match',
  async (req: Request, res: Response) => {
    const { match } = req.params;

    const existingUser = await User.find({
      $or: [
        { username: { $regex: match, $options: 'ig' } },
        { name: { $regex: match, $options: 'ig' } },
      ],
    }).limit(10);

    if (!existingUser) {
      throw new BadRequestError('No username matches found');
    }

    res.status(200).send(existingUser.map((el) => el.toJSON()));
  }
);

export { router as getSuggestedUsersRouter };
