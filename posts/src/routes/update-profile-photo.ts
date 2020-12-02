import express, { Request, Response } from 'express';
import multer from 'multer';
import { resizePhoto } from '../utils/resize';
import { Post } from '../models/post';
import { requireAuth, BadRequestError } from '@ggabella-photo-share/common';
import { buffToStream } from '../utils/buffToStream';
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
  resizePhoto,
  async (req: Request, res: Response) => {
    const caption = req.body.caption || '';

    const key = req.file.filename;

    const s3 = new AWS.S3();

    const uploadParams: S3.Types.PutObjectRequest = {
      Bucket: 'photo-share-app-profile-photos',
      Key: key,
      Body: '',
    };

    const fileBuffer = req.file.buffer;
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

        // const post = Post.build({
        //   fileName: req.file.originalname,
        //   caption,
        //   createdAt: new Date(),
        //   userId: req.currentUser!.id,
        //   s3Key: key,
        //   s3ObjectURL: location,
        // });

        // await post.save();

        // res.status(201).send(post);
      }
    });
  }
);

export { router as createPostRouter };
