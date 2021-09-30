import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { validateRequest, BadRequestError } from '@ggabella-photo-share/common';
import { User } from '../models/user';
import { generateDefaultUsername } from '../utils/generateDefaultUsername';
import { NewUserCreatedPublisher } from '../events/publishers/new-user-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('name').trim().not().isEmpty().withMessage('A name must be provided'),
    body('email').isEmail().withMessage('Email must be valid'),
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
  async (req: Request, res: Response) => {
    const { username, name, email, password } = req.body;

    const existingUserUsername = await User.findOne({ username });

    const existingUserEmail = await User.findOne({ email });

    if (existingUserUsername) {
      throw new BadRequestError('Username in use');
    }

    if (existingUserEmail) {
      throw new BadRequestError('Email in use');
    }

    const user = User.build({
      name,
      email,
      username,
      password,
      active: true,
    });
    await user.save();

    await new NewUserCreatedPublisher(natsWrapper.client).publish({
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
    });

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
      },
      process.env.JWT_KEY!
    );

    // Store it on the session object
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
