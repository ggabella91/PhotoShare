import express, { Request, Response } from 'express';
import {
  currentUser,
  requireAuth,
  BadRequestError,
} from '@ggabella-photo-share/common';
import { Post, PostResponseObj } from '../models/post';
import { LocationDoc } from '../models/location';
import { getLocationObjFromId } from '../utils/location-utils';

const router = express.Router();

router.get(
  '/api/posts/locations/id/:locationId',
  requireAuth,
  currentUser,
  async (req: Request, res: Response) => {
    const { locationId } = req.params;
    const pageToShow = parseInt(req.query.pageToShow as string) || null;
    const limit = parseInt(req.query.limit as string) || null;

    if (!locationId) {
      throw new BadRequestError('No location id was provided.');
    }

    let postsWithLocationId;

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

      postsWithLocationId = await Post.find(
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
        postsWithLocationId
      );

      let postsWithLocation: Partial<PostResponseObj>[] = [];
      let savedPostLocationObjPromises: Promise<LocationDoc | null>[] = [];

      postsWithLocationId.forEach(async (post) => {
        if (post.postLocation) {
          savedPostLocationObjPromises.push(
            getLocationObjFromId(post.postLocation)
          );
        }
      });

      const savedPostLocationObjs = await Promise.all(
        savedPostLocationObjPromises
      );

      console.log('Saved post location objects: ', savedPostLocationObjs);

      postsWithLocationId.forEach((post, idx) => {
        const postObj = post.toObject();

        const postResponseObj: Partial<PostResponseObj> = {
          ...postObj,
          postLocation: savedPostLocationObjs[idx]?.toObject() || undefined,
        };

        postsWithLocation.push(postResponseObj);
      });

      console.log(
        'Data for posts with with location objects: ',
        postsWithLocation
      );

      if (queryLength) {
        res.status(200).send({ postsWithLocation, queryLength });
      } else {
        res.status(200).send({ postsWithLocation });
      }
    } else {
      postsWithLocationId = await Post.find(
        { postLocation: locationId, archived: { $ne: true } },
        null,
        {
          sort: { totalReactions: -1 },
        }
      );
      console.log(
        `Data for posts with location id: ${locationId}`,
        postsWithLocationId
      );

      let postsWithLocation: Partial<PostResponseObj>[] = [];
      let savedPostLocationObjPromises: Promise<LocationDoc | null>[] = [];

      postsWithLocationId.forEach(async (post) => {
        if (post.postLocation) {
          savedPostLocationObjPromises.push(
            getLocationObjFromId(post.postLocation)
          );
        }
      });

      const savedPostLocationObjs = await Promise.all(
        savedPostLocationObjPromises
      );

      console.log('Saved post location objects: ', savedPostLocationObjs);

      postsWithLocationId.forEach((post, idx) => {
        const postObj = post.toObject();

        const postResponseObj: Partial<PostResponseObj> = {
          ...postObj,
          postLocation: savedPostLocationObjs[idx]?.toObject() || undefined,
        };

        postsWithLocation.push(postResponseObj);
      });

      console.log(
        'Data for posts with with location objects: ',
        postsWithLocation
      );

      res.status(200).send({ postsWithLocation });
    }
  }
);

export { router as getPostsWithLocationRouter };
