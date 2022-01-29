import express, { Request, Response } from 'express';
import multer from 'multer';
import { Post, PostResponseObj } from '../models/post';
import { LocationAttrs, LocationDoc } from '../models/location';
import { requireAuth, BadRequestError } from '@ggabella-photo-share/common';
import { buffToStream } from '../utils/buffToStream';
import { generateKey } from '../utils/generateKey';
import {
  extractHashtags,
  saveOrUpdateHashtagEntries,
} from '../utils/hashtag-utils';
import {
  createLocationObject,
  LocationReq,
  saveNewOrGetExistingLocation,
} from '../utils/location-utils';
import { AWS } from '../index';
import { S3 } from 'aws-sdk';

const router = express.Router();

const fileStorage = multer.memoryStorage();

const videoFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
): void => {
  if (file.mimetype.startsWith('video')) {
    cb(null, true);
  } else {
    cb(new BadRequestError('Only videos can be uploaded'));
  }
};

const upload = multer({ storage: fileStorage, fileFilter: videoFilter });

router.post(
  '/api/posts/new-video',
  requireAuth,
  upload.single('video'),
  async (req: Request, res: Response) => {}
);

export { router as createVideoPostRouter };
