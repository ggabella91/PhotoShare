import express, { Request, Response } from 'express';
import {
  currentUser,
  requireAuth,
  BadRequestError,
} from '@ggabella-photo-share/common';
import { Post } from '../models/post';

const router = express.Router();

router.get(
  '/api/posts/hashtags/:hashtag',
  requireAuth,
  currentUser,
  async (req: Request, res: Response) => {
    const { hashtag } = req.params;
    const pageToShow = parseInt(req.query.pageToShow as string) || null;
    const limit = parseInt(req.query.limit as string) || null;

    if (!hashtag) {
      throw new BadRequestError('No hashtag was provided.');
    }

    let postsWithHashtag;

    if (pageToShow && limit) {
      let queryLength = 0;

      if (pageToShow === 1) {
        queryLength = (
          await Post.find(
            { hashtags: hashtag, archived: { $ne: true } },
            null,
            {
              sort: { _id: -1 },
            }
          )
        ).length;
      }

      postsWithHashtag = await Post.find(
        { hashtags: hashtag, archived: { $ne: true } },
        null,
        {
          sort: { _id: -1 },
        }
      )
        .limit(limit)
        .skip((pageToShow - 1) * limit);
      console.log(`Data for posts with hashtag: ${hashtag}`, postsWithHashtag);

      if (queryLength) {
        res.status(200).send({ postsWithHashtag, queryLength });
      } else {
        res.status(200).send({ postsWithHashtag });
      }
    } else {
      postsWithHashtag = await Post.find(
        { hashtags: hashtag, archived: { $ne: true } },
        null,
        {
          sort: { _id: -1 },
        }
      );
      console.log(`Data for posts with hashtag: ${hashtag}`, postsWithHashtag);

      res.status(200).send({ postsWithHashtag });
    }
  }
);

export { router as getPostsWithHashtagRouter };
