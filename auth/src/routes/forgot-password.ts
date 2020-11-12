import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { User } from '../models/user';
import {
  validateRequest,
  NotFoundError,
  InternalServerError,
  Email,
} from '@ggabella-photo-share/common';

const router = express.Router();

router.post(
  '/api/users/forgotPassword',
  [body('email').isEmail().withMessage('Email must be valid')],
  validateRequest,
  async (req: Request, res: Response) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      throw new NotFoundError();
    }

    const resetToken = user.schema.methods.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    try {
      const resetURL = `${req.protocol}://photo-share.dev/reset-password/${resetToken}`;

      await new Email(user, resetURL).sendPasswordReset();

      res
        .status(200)
        .send({ status: 'success', message: 'Token sent to email!' });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      throw new InternalServerError();
    }
  }
);
