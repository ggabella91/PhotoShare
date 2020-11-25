import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { Password } from '../services/password';
import { User } from '../models/user';
import {
  currentUser,
  validateRequest,
  BadRequestError,
} from '@ggabella-photo-share/common';

const router = express.Router();

router.patch(
  '/api/users/updatePassword',
  [
    body('passwordCurrent')
      .trim()
      .notEmpty()
      .withMessage('You must supply your current password'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
    body('passwordConfirm')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match password');
        }

        return true;
      }),
  ],
  validateRequest,
  currentUser,
  async (req: Request, res: Response) => {
    const { passwordCurrent, password } = req.body;
    const email = req.currentUser!.email;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      console.log('No user found');
      throw new BadRequestError('Invalid credentials');
    }

    const passwordsMatch = await Password.compare(
      existingUser.password,
      passwordCurrent
    );

    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credentials');
    }

    existingUser.password = password;
    await existingUser.save();

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );

    // Store it on the session object
    req.session = {
      jwt: userJwt,
    };

    res.status(200).send(existingUser);
  }
);

export { router as updatePasswordRouter };
