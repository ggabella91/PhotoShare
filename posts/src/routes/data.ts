import express, { Request, Response } from 'express';
import {
  currentUser,
  requireAuth,
  BadRequestError,
} from '@ggabella-photo-share/common';
import { Post } from '../models/post';

const router = express.Router();

router.post(
  '/api/posts/data',
  requireAuth,
  currentUser,
  async (req: Request, res: Response) => {
    const userId: string = req.body.userId;
    const pageToShow = req.body.pageToShow || null;
    const limit = req.body.limit || null;

    if (!userId) {
      throw new BadRequestError('No user ID was provided.');
    }

    let posts;

    if (pageToShow && limit) {
      let queryLength: number;

      if (pageToShow === 1) {
        queryLength = (
          await Post.find({ userId, archived: { $ne: true } }, null, {
            sort: { _id: -1 },
          })
        ).length;
      }

      posts = await Post.find({ userId, archived: { $ne: true } }, null, {
        sort: { _id: -1 },
      })
        .limit(limit)
        .skip((pageToShow - 1) * limit);
      console.log(posts);

      if (queryLength!) {
        res.status(200).send({ posts, queryLength });
      } else {
        res.status(200).send({ posts });
      }
    } else {
      posts = await Post.find({ userId, archived: { $ne: true } }, null, {
        sort: { _id: -1 },
      });
      console.log(posts);

      res.status(200).send({ posts });
    }
  }
);

export { router as getPostDataRouter };
