import express, { Request, Response } from 'express';
import multer from 'multer';
import { compressPhoto } from '../utils/photoManipulation';
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
    let postLocation: string | LocationReq | LocationAttrs =
      req.body.location || '';

    let hashtags: string[] = [];
    if (caption) {
      hashtags = extractHashtags(caption);
    }
    if (postLocation) {
      postLocation = JSON.parse(postLocation as string);
      postLocation = createLocationObject(postLocation as LocationReq);
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
    const comments = 0;
    const likes = 0;
    const totalReactions = 0;

    s3.upload(uploadParams, async (err, data) => {
      if (err) {
        console.log(err);
        throw new Error('Error uploading the photo');
      }
      if (data) {
        location = data.Location;
        console.log('Upload success!', location);

        let savedPostLocation: LocationDoc | null = null;
        if (postLocation) {
          savedPostLocation = await saveNewOrGetExistingLocation(
            postLocation as LocationAttrs
          );
        }

        const post = Post.build({
          fileName: req.file!.originalname,
          caption,
          postLocation: savedPostLocation?.id || undefined,
          createdAt: new Date(),
          userId: req.currentUser!.id,
          s3Key: key,
          s3ObjectURL: location,
          hashtags,
          comments,
          likes,
          totalReactions,
        });

        await post.save();

        if (hashtags.length) {
          await saveOrUpdateHashtagEntries(hashtags);
        }

        const postObj = post.toObject();

        const postResponseObj: PostResponseObj = {
          ...postObj,
          postLocation: savedPostLocation?.toObject() || undefined,
        };

        res.status(201).send(postResponseObj);
      }
    });
  }
);

export { router as createPostRouter };
