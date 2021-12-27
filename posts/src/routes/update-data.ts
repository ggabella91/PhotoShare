import express, { Request, Response } from 'express';
import { Post } from '../models/post';
import { requireAuth, BadRequestError } from '@ggabella-photo-share/common';
import {
  extractHashtags,
  saveOrUpdateHashtagEntries,
} from '../utils/hashtag-utils';

const router = express.Router();

router.patch(
  '/api/posts/:postId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { postId } = req.params;

    const caption = req.body.caption || '';
    const postLocation = req.body.location || '';
    let hashtags: string[];
    if (caption) {
      hashtags = extractHashtags(caption);
    } else {
      hashtags = [];
    }

    if (!postId) {
      throw new BadRequestError('No post id was provided.');
    }

    let hashtagEntriesToUpdate: string[] = [];

    const postBeforeUpdate = await Post.findById(postId);
    const oldHashtags = postBeforeUpdate?.hashtags;

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { caption, postLocation, hashtags },
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

    res.status(200).send(updatedPost);
  }
);

export { router as updatePostDataRouter };
