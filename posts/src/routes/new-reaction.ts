import express, { Request, Response } from 'express';
import { Reaction } from '../models/reaction';
import { Post, PostDoc } from '../models/post';
import { requireAuth, BadRequestError } from '@ggabella-photo-share/common';

const router = express.Router();

router.post(
  '/api/reactions/new',
  requireAuth,
  async (req: Request, res: Response) => {
    const comment: string = req.body.comment || '';
    const likedPost: boolean = req.body.likedPost;

    const reaction = Reaction.build({
      comment,
      likedPost,
      createdAt: new Date(),
      postId: req.body.postId,
      reactingUserId: req.currentUser!.id,
    });

    await reaction.save();

    let updatedPost: PostDoc | null;
    if (likedPost) {
      updatedPost = await Post.findByIdAndUpdate(
        req.body.postId,
        { $inc: { likes: 1, totalReactions: 1 } },
        {
          new: true,
          runValidators: true,
        }
      );

      console.log(
        `Updated like count for post with id ${req.body.postId}: ${updatedPost?.likes} likes`
      );
    } else {
      updatedPost = await Post.findByIdAndUpdate(
        req.body.postId,
        { $inc: { comments: 1, totalReactions: 1 } },
        {
          new: true,
          runValidators: true,
        }
      );

      console.log(
        `Updated comment count for post with id ${req.body.postId}: ${updatedPost?.comments} comments`
      );
    }

    res.status(201).send(reaction);
  }
);

export { router as newReactionRouter };
