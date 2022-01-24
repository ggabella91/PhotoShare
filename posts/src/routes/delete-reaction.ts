import express, { Request, Response } from 'express';
import { Reaction } from '../models/reaction';
import { Post, PostDoc } from '../models/post';
import { requireAuth, BadRequestError } from '@ggabella-photo-share/common';

const router = express.Router();

router.delete(
  '/api/reactions',
  requireAuth,
  async (req: Request, res: Response) => {
    const reactionId: string = req.body.reactionId;

    const deletedReaction = await Reaction.findByIdAndDelete(reactionId);

    let updatedPost: PostDoc | null;
    if (deletedReaction && deletedReaction.likedPost) {
      updatedPost = await Post.findByIdAndUpdate(
        req.body.postId,
        { $inc: { likes: -1, totalReactions: -1 } },
        {
          new: true,
          runValidators: true,
        }
      );

      console.log(
        `Updated like count for post with id ${req.body.postId}: ${updatedPost?.likes} likes`
      );
    } else if (deletedReaction && !deletedReaction.likedPost) {
      updatedPost = await Post.findByIdAndUpdate(
        req.body.postId,
        { $inc: { comments: -1, totalReactions: -1 } },
        {
          new: true,
          runValidators: true,
        }
      );

      console.log(
        `Updated comment count for post with id ${req.body.postId}: ${updatedPost?.comments} comments`
      );
    }

    res.status(204).send({ reactionId });
  }
);

export { router as deleteReactionRouter };
