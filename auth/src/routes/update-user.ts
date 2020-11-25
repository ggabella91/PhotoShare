import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { User } from '../models/user';
import {
  currentUser,
  validateRequest,
  BadRequestError,
} from '@ggabella-photo-share/common';

const router = express.Router();

interface FilteredObject {
  name?: string;
  email?: string;
  photo?: string;
}

type Element = 'name' | 'email' | 'photo';

const filterObj = (obj: FilteredObject, ...allowedFields: string[]) => {
  const newObj: FilteredObject = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el as Element] = obj[el as Element];
  });
  return newObj;
};

router.patch(
  '/api/users/updateMe',
  [
    body('name').trim().not().isEmpty().withMessage('A name must be provided'),
    body('email').isEmail().withMessage('Email must be valid'),
  ],
  validateRequest,
  currentUser,
  async (req: Request, res: Response) => {
    if (req.body.password) {
      throw new BadRequestError(
        'This route is not for password updates. Please use /updatePassword.'
      );
    }

    const { email } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser.email !== req.currentUser!.email) {
      throw new BadRequestError('Email in use');
    }

    // Filter out unwanted field names that are not allowed to be updated with this route handler (or at all)
    const filteredBody = filterObj(req.body, 'name', 'email', 'photo');

    const updatedUser = await User.findByIdAndUpdate(
      req.currentUser!.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).send(updatedUser);
  }
);

export { router as updateUserRouter };
