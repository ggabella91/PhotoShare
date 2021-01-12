import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { User } from '../models/user';
import {
  validateRequest,
  BadRequestError,
  requireAuth,
  currentUser,
} from '@ggabella-photo-share/common';
import { resetPasswordRouter } from './reset-password';

const router = express.Router();

interface FilteredObject {
  name?: string;
  email?: string;
  photo?: string;
  username?: string;
  bio?: string;
}

type Element = 'name' | 'email' | 'photo' | 'username' | 'bio';

const filterObj = (obj: FilteredObject, ...allowedFields: string[]) => {
  const newObj: FilteredObject = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el as Element] = obj[el as Element];
  });
  return newObj;
};

router.patch(
  '/api/users/updateMe',
  [body('email').isEmail().withMessage('Email must be valid')],
  validateRequest,
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    if (req.body.password) {
      throw new BadRequestError(
        'This route is not for password updates. Please use /updatePassword.'
      );
    }

    const { email, username } = req.body;

    const existingUserEmail = await User.findOne({ email });
    const existingUserUsername = await User.findOne({ username });

    if (
      existingUserEmail &&
      req.currentUser &&
      existingUserEmail.email !== req.currentUser!.email
    ) {
      throw new BadRequestError('Email in use');
    } else if (
      existingUserUsername &&
      req.currentUser &&
      existingUserUsername.email !== req.currentUser!.email
    ) {
      throw new BadRequestError('Username in use');
    }

    // Filter out unwanted field names that are not allowed to be updated with this route handler (or at all)
    const filteredBody = filterObj(
      req.body,
      'name',
      'email',
      'username',
      'photo',
      'bio'
    );

    const updatedUser = await User.findByIdAndUpdate(
      req.currentUser!.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: updatedUser!.id,
        name: updatedUser!.name,
        email: updatedUser!.email,
        username: updatedUser!.username,
        photo: updatedUser!.photo,
        bio: updatedUser!.bio,
      },
      process.env.JWT_KEY!
    );

    // Store it on the session object
    req.session = {
      jwt: userJwt,
    };

    res.status(200).send(updatedUser);
  }
);

export { router as updateUserRouter };
