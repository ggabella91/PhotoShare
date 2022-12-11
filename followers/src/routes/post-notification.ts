import express, { Request, Response } from 'express';
import { Notification } from '../models/notification';
import { requireAuth, BadRequestError } from '@ggabella-photo-share/common';

const router = express.Router();

router.post(
  '/api/notifications/new',
  requireAuth,
  async (req: Request, res: Response) => {
    const { fromUserId, toUserId, message } = req.params;

    if (!fromUserId) {
      throw new BadRequestError('From user not found');
    }

    if (!toUserId) {
      throw new BadRequestError('To user not found');
    }

    if (!message) {
      throw new BadRequestError('Message not provided');
    }

    const newNotification = Notification.build({
      fromUserId,
      toUserId,
      message,
      createdAt: new Date(),
    });

    await newNotification.save();

    res.status(201).send(newNotification);
  }
);

export { router as postNotificationRouter };
