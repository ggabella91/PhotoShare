import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { User } from '../models/user';
import {
  validateRequest,
  NotFoundError,
  InternalServerError,
} from '@ggabella-photo-share/common';
import { PasswordResetRequestedPublisher } from '../events/publishers/password-reset-requested-publisher';
import { natsWrapper } from '../nats-wrapper';

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
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    try {
      await new PasswordResetRequestedPublisher(natsWrapper.client).publish({
        name: user.name,
        email: user.email,
        resetToken,
      });

      console.log(user);

      res.status(200).send(user);
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      throw new InternalServerError();
    }
  }
);

export { router as forgotPasswordRouter };
