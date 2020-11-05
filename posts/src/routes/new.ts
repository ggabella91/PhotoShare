import express, { Request, Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { requireAuth, BadRequestError } from '@ggabella-photo-share/common';
import { AWS } from '../index';

const router = express.Router();

const fileStorage = multer.memoryStorage();

const imageFilter = (req, file, cb) => {
  if (file.mimetype.starswith('image')) {
    cb(null, true);
  } else {
    cb(new BadRequestError('Only images can be uploaded'), false);
  }
};

const upload = multer({ storage: fileStorage, fileFilter: imageFilter });

router.post('/api/posts', requireAuth, async (req: Request, res: Response) => {
  upload.single('photo');

  const s3 = new AWS.S3();

  const uploadParams = { Bucket: 'photo-share-app', Key: '', Body: '' };
});

export { router as createPostRouter };
