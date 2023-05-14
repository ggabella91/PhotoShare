import express, { Request, Response } from 'express';
import { User, UserDoc } from '../models/user';
import { BadRequestError } from '@ggabella-photo-share/common';

const router = express.Router();

router.get(
  '/api/users/suggested/:match',
  async (req: Request, res: Response) => {
    const { match } = req.params;

    const existingUser = await User.find({
      $or: [
        { username: { $regex: match, $options: 'i' } },
        { name: { $regex: match, $options: 'i' } },
      ],
    }).limit(10);

    if (!existingUser) {
      throw new BadRequestError('No username or name matches found');
    }

    res.status(200).send(existingUser.map((el: UserDoc) => el.toJSON()));
  }
);

export { router as getSuggestedUsersRouter };
