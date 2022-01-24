import express, { Request, Response } from 'express';
import {
  currentUser,
  requireAuth,
  BadRequestError,
} from '@ggabella-photo-share/common';
import { Post } from '../models/post';

const router = express.Router();

router.get(
  '/api/posts/locations/:locationId',
  requireAuth,
  currentUser,
  async (req: Request, res: Response) => {
    const { locationId } = req.params;
    const pageToShow = parseInt(req.query.pageToShow as string) || null;
    const limit = parseInt(req.query.limit as string) || null;

    if (!locationId) {
      throw new BadRequestError('No location id was provided.');
    }

    let postsWithLocation;

    if (pageToShow && limit) {
      let queryLength = 0;

      if (pageToShow === 1) {
        queryLength = (
          await Post.find(
            { postLocation: locationId, archived: { $ne: true } },
            null,
            {
              sort: { totalReactions: -1 },
            }
          )
        ).length;
      }

      postsWithLocation = await Post.find(
        { postLocation: locationId, archived: { $ne: true } },
        null,
        {
          sort: { totalReactions: -1 },
        }
      )
        .limit(limit)
        .skip((pageToShow - 1) * limit);
      console.log(
        `Data for posts with location id: ${locationId}`,
        postsWithLocation
      );

      if (queryLength) {
        res.status(200).send({ postsWithLocation, queryLength });
      } else {
        res.status(200).send({ postsWithLocation });
      }
    } else {
      postsWithLocation = await Post.find(
        { postLocation: locationId, archived: { $ne: true } },
        null,
        {
          sort: { totalReactions: -1 },
        }
      );
      console.log(
        `Data for posts with location id: ${locationId}`,
        postsWithLocation
      );

      res.status(200).send({ postsWithLocation });
    }
  }
);
