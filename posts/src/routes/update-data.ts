import express, { Request, Response } from 'express';
import { Post, PostResponseObj } from '../models/post';
import { LocationDoc } from '../models/location';
import { requireAuth, BadRequestError } from '@ggabella-photo-share/common';
import {
  extractHashtags,
  saveOrUpdateHashtagEntries,
} from '../utils/hashtag-utils';
import {
  createLocationObject,
  saveNewOrGetExistingLocation,
} from '../utils/location-utils';

const router = express.Router();

router.patch(
  '/api/posts/:postId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { postId } = req.params;

    const caption = req.body.caption || '';
    const postLocation = createLocationObject(req.body.location) || undefined;
    let hashtags: string[];
    if (caption) {
      hashtags = extractHashtags(caption);
    } else {
      hashtags = [];
    }

    if (!postId) {
      throw new BadRequestError('No post id was provided.');
    }

    let savedPostLocation: LocationDoc | null = null;
    if (postLocation) {
      savedPostLocation = await saveNewOrGetExistingLocation(postLocation);
    }

    let hashtagEntriesToUpdate: string[] = [];

    const postBeforeUpdate = await Post.findById(postId);
    const oldHashtags = postBeforeUpdate?.hashtags;

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { caption, location: savedPostLocation?.id || undefined, hashtags },
      {
        new: true,
        runValidators: true,
      }
    );

    if (oldHashtags) {
      hashtags.forEach((hashtag) => {
        if (!oldHashtags.includes(hashtag)) {
          hashtagEntriesToUpdate.push(hashtag);
        }
      });
    }

    if (hashtagEntriesToUpdate.length) {
      saveOrUpdateHashtagEntries(hashtagEntriesToUpdate);
    }

    if (updatedPost) {
      const updatedPostObj = updatedPost.toObject();

      const updatedPostResponseObj: PostResponseObj = {
        ...updatedPostObj,
        postLocation: savedPostLocation || undefined,
      };

      res.status(200).send(updatedPostResponseObj);
    } else {
      res.status(204).send(null);
    }
  }
);

export { router as updatePostDataRouter };
