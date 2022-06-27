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
  '/api/posts/data/:postId',
  requireAuth,
  currentUser,
  async (req: Request, res: Response) => {
    const { postId } = req.params;

    console.log('postId: ', postId);

    if (!postId) {
      throw new BadRequestError('No post ID was provided.');
    }

    const singlePostWithoutLocationObj = await Post.findOne({
      _id: postId,
      archived: { $ne: true },
    });
    console.log('Single Post Data: ', singlePostWithoutLocationObj);

    let singlePost: Partial<PostResponseObj> | null = null;

    let savedPostLocationObj: LocationDoc | null = null;
    if (
      singlePostWithoutLocationObj &&
      singlePostWithoutLocationObj.postLocation
    ) {
      savedPostLocationObj = await getLocationObjFromId(
        singlePostWithoutLocationObj.postLocation
      );

      const postObj = singlePostWithoutLocationObj.toObject();

      singlePost = {
        ...postObj,
        postLocation: savedPostLocationObj || undefined,
      };
    }

    console.log('Single Post Data With Location Object: ', singlePost);

    res.status(200).send(singlePost);
  }
);

export { router as getSinglePostDataRouter };
