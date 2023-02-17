import express, { Request, Response } from 'express';
import { Notification, NotificationDoc } from '../models/notification';
import { requireAuth, BadRequestError } from '@ggabella-photo-share/common';

const router = express.Router();

router.get(
  '/api/notifications/:userId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { userId } = req.params;
    const pageToShow = parseInt(req.query.pageToShow as string) || null;
    const limit = parseInt(req.query.limit as string) || null;

    if (!userId) {
      throw new BadRequestError('User id must be provided');
    }

    let notifications: NotificationDoc[] = [];

    if (pageToShow && limit) {
      notifications = await Notification.find(
        {
          toUserId: userId,
          fromUserId: { $ne: userId },
        },
        null,
        {
          sort: { _id: -1 },
        }
      )
        .limit(limit)
        .skip((pageToShow - 1) * limit);
    } else {
      notifications = await Notification.find({
        toUserId: userId,
      });
    }

    res.status(200).send(notifications);
  }
);

export { router as getNotificationsRouter };
