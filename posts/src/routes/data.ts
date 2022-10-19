import express, { Request, Response } from 'express';
import {
  currentUser,
  requireAuth,
  BadRequestError,
} from '@ggabella-photo-share/common';
import { Post, PostDoc, PostResponseObj } from '../models/post';
import { LocationDoc, LocationAttrs } from '../models/location';
import { getLocationObjFromId } from '../utils/location-utils';

const router = express.Router();

router.get(
  '/api/posts/data',
  requireAuth,
  currentUser,
  async (req: Request, res: Response) => {
    const userId: string = (req.query.userId as string) || '';
    const pageToShow = parseInt(req.query.pageToShow as string) || null;
    const limit = parseInt(req.query.limit as string) || null;

    if (!userId) {
      throw new BadRequestError('No user ID was provided.');
    }

    let postsWithoutLocationObj: PostDoc[] = [];

    if (pageToShow && limit) {
      let queryLength: number;

      if (pageToShow === 1) {
        queryLength = (
          await Post.find({ userId, archived: { $ne: true } }, null, {
            sort: { _id: -1 },
          })
        ).length;
      }

      postsWithoutLocationObj = await Post.find(
        { userId, archived: { $ne: true } },
        null,
        {
          sort: { _id: -1 },
        }
      )
        .limit(limit)
        .skip((pageToShow - 1) * limit);
      console.log(
        'Posts data without location object: ',
        postsWithoutLocationObj
      );

      let posts: Partial<PostResponseObj>[] = [];
      let savedPostLocationObjPromises: (Promise<LocationDoc | null> | null)[] =
        [];

      postsWithoutLocationObj.forEach(async (post) => {
        if (post.postLocation) {
          savedPostLocationObjPromises.push(
            getLocationObjFromId(post.postLocation)
          );
        } else {
          savedPostLocationObjPromises.push(null);
        }
      });

      const savedPostLocationObjs = await Promise.all(
        savedPostLocationObjPromises
      );

      console.log('Saved post location objects: ', savedPostLocationObjs);

      postsWithoutLocationObj.forEach((post, idx) => {
        const postObj = post.toObject();

        const postResponseObj: Partial<PostResponseObj> = {
          ...postObj,
          postLocation: savedPostLocationObjs[idx]?.toObject() || undefined,
        };

        posts.push(postResponseObj);
      });

      console.log('Posts data with location objects: ', posts);

      if (queryLength!) {
        res.status(200).send({ posts, queryLength });
      } else {
        res.status(200).send({ posts });
      }
    } else {
      postsWithoutLocationObj = await Post.find(
        { userId, archived: { $ne: true } },
        null,
        {
          sort: { _id: -1 },
        }
      );
      console.log(
        'Posts data without location objects: ',
        postsWithoutLocationObj
      );

      let posts: Partial<PostResponseObj>[] = [];
      let savedPostLocationObjPromises: Promise<LocationDoc | null>[] = [];

      postsWithoutLocationObj.forEach(async (post) => {
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

      postsWithoutLocationObj.forEach((post, idx) => {
        const postObj = post.toObject();

        const postResponseObj: Partial<PostResponseObj> = {
          ...postObj,
          postLocation: savedPostLocationObjs[idx]?.toObject() || undefined,
        };

        posts.push(postResponseObj);
      });

      console.log('Posts data with location objects: ', posts);

      res.status(200).send({ posts });
    }
  }
);

export { router as getPostDataRouter };
