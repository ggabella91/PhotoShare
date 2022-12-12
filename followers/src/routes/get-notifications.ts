import express, { Request, Response } from 'express';
import { Notification, NotificationDoc } from '../models/notification';
import { requireAuth, BadRequestError } from '@ggabella-photo-share/common';

const router = express.Router();

router.get(
  '/api/notifications/:userId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!userId) {
      throw new BadRequestError('User id must be provided');
    }

    const notications: NotificationDoc[] = await Notification.find({
      toUserId: userId,
    });

    res.status(200).send(notications);
  }
);

export { router as getNotificationsRouter };
