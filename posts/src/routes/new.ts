import express, { Request, Response } from 'express';
import multer from 'multer';
import { compressPhoto } from '../utils/photoManipulation';
import { Post } from '../models/post';
import { requireAuth, BadRequestError } from '@ggabella-photo-share/common';
import { buffToStream } from '../utils/buffToStream';
import { generateKey } from '../utils/generateKey';
import { extractHashtags } from '../utils/extractHashtags';
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
  '/api/posts/new',
  requireAuth,
  upload.single('photo'),
  compressPhoto,
  async (req: Request, res: Response) => {
    const caption = req.body.caption || '';
    const postLocation = req.body.location || '';

    let hashtags: string[];
    if (caption) {
      hashtags = extractHashtags(caption);
    } else {
      hashtags = [];
    }

    const key = generateKey(req.file!.originalname);

    const s3 = new AWS.S3();

    let bucket: string;

    if (process.env.NODE_ENV === 'production') {
      bucket = 'photo-share-app';
    } else {
      bucket = 'photo-share-app-dev';
    }

    const uploadParams: S3.Types.PutObjectRequest = {
      Bucket: bucket,
      Key: key,
      Body: '',
    };

    const fileBuffer = req.file!.buffer;
    const fileStream = buffToStream(fileBuffer);

    uploadParams.Body = fileStream;

    let location = '';

    s3.upload(uploadParams, async (err, data) => {
      if (err) {
        console.log(err);
        throw new Error('Error uploading the photo');
      }
      if (data) {
        location = data.Location;
        console.log('Upload success!', location);

        const post = Post.build({
          fileName: req.file!.originalname,
          caption,
          postLocation,
          createdAt: new Date(),
          userId: req.currentUser!.id,
          s3Key: key,
          s3ObjectURL: location,
          hashtags,
        });

        await post.save();

        res.status(201).send(post);
      }
    });
  }
);

export { router as createPostRouter };
