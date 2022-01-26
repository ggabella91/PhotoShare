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

    let postsWithHashtagWithoutLocationObj;

    if (pageToShow && limit) {
      let queryLength = 0;

      if (pageToShow === 1) {
        queryLength = (
          await Post.find(
            { hashtags: hashtag, archived: { $ne: true } },
            null,
            {
              sort: { totalReactions: -1 },
            }
          )
        ).length;
      }

      postsWithHashtagWithoutLocationObj = await Post.find(
        { hashtags: hashtag, archived: { $ne: true } },
        null,
        {
          sort: { totalReactions: -1 },
        }
      )
        .limit(limit)
        .skip((pageToShow - 1) * limit);
      console.log(
        `Data for posts with hashtag: ${hashtag}`,
        postsWithHashtagWithoutLocationObj
      );

      let postsWithHashtag: PostResponseObj[] = [];
      let savedPostLocationObjPromises: Promise<LocationDoc | null>[] = [];

      postsWithHashtagWithoutLocationObj.forEach(async (post) => {
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

      postsWithHashtagWithoutLocationObj.forEach((post, idx) => {
        const postObj = post.toObject();

        const postResponseObj: PostResponseObj = {
          ...postObj,
          postLocation: savedPostLocationObjs[idx] || undefined,
        };

        postsWithHashtag.push(postResponseObj);
      });

      console.log(
        'Data for posts with hashtag with location objects: ',
        postsWithHashtag
      );

      if (queryLength) {
        res.status(200).send({ postsWithHashtag, queryLength });
      } else {
        res.status(200).send({ postsWithHashtag });
      }
    } else {
      postsWithHashtagWithoutLocationObj = await Post.find(
        { hashtags: hashtag, archived: { $ne: true } },
        null,
        {
          sort: { totalReactions: -1 },
        }
      );
      console.log(
        `Data for posts with hashtag: ${hashtag}`,
        postsWithHashtagWithoutLocationObj
      );

      let postsWithHashtag: PostResponseObj[] = [];
      let savedPostLocationObjPromises: Promise<LocationDoc | null>[] = [];

      postsWithHashtagWithoutLocationObj.forEach(async (post) => {
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

      postsWithHashtagWithoutLocationObj.forEach((post, idx) => {
        const postObj = post.toObject();

        const postResponseObj: PostResponseObj = {
          ...postObj,
          postLocation: savedPostLocationObjs[idx] || undefined,
        };

        postsWithHashtag.push(postResponseObj);
      });

      console.log(
        'Data for posts with hashtag with location objects: ',
        postsWithHashtag
      );

      res.status(200).send({ postsWithHashtag });
    }
  }
);

export { router as getPostsWithHashtagRouter };
