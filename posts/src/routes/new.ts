import express, { Request, Response } from 'express';
import multer from 'multer';
import { requireAuth, BadRequestError } from '@ggabella-photo-share/common';
import buffToStream from '../utils/buffToStream';
import { AWS } from '../index';
import { S3 } from 'aws-sdk';

const router = express.Router();

const fileStorage = multer.memoryStorage();

const imageFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
): void => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new BadRequestError('Only images can be uploaded'));
  }
};

const upload = multer({ storage: fileStorage, fileFilter: imageFilter });

router.post(
  '/api/posts',
  requireAuth,
  upload.single('photo'),
  async (req: Request, res: Response) => {
    console.log(req.file);

    const s3 = new AWS.S3();

    const uploadParams: S3.Types.PutObjectRequest = {
      Bucket: 'photo-share-app',
      Key: '',
      Body: '',
    };

    const fileBuffer = req.file.buffer;
    const fileStream = buffToStream(fileBuffer);

    uploadParams.Body = fileStream;
    uploadParams.Key = req.file.originalname;

    s3.upload(uploadParams, (err, data) => {
      if (err) {
        throw new Error('Error uploading the photo');
      }
      if (data) {
        console.log('Upload success!', data.Location);
      }
    });
  }
);

export { router as createPostRouter };
