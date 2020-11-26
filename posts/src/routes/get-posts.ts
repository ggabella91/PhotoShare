import express, { Request, Response } from 'express';
import { requireAuth, BadRequestError } from '@ggabella-photo-share/common';
import { AWS } from '../index';
import { S3 } from 'aws-sdk';

const router = express.Router();

router.get(
  '/api/posts',
  requireAuth,
  async (req: Request, res: Response) => {}
);

export { router as getPostsRouter };
