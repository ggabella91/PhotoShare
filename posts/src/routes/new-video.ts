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
  async (req: Request, res: Response) => {
    const createNewMultipartUpload: boolean =
      req.body.createNewMultipartUpload || false;
    const partNumber: number = req.body.partNumber || 1;

    // TODO: Move below logic to after final part upload
    // successfully completes
    const caption: string = req.body.caption || '';
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
      bucket = 'photo-share-app-videos';
    } else {
      bucket = 'photo-share-app-videos-dev';
    }

    if (createNewMultipartUpload) {
      const uploadParams: S3.Types.CreateMultipartUploadRequest = {
        Bucket: bucket,
        Key: key,
      };

      let location = '';
      let uploadId: string = '';
      const comments = 0;
      const likes = 0;
      const totalReactions = 0;

      s3.createMultipartUpload(uploadParams, (err, data) => {
        if (err) {
          console.log('S3 createMultipartUpload error: ', err);
          throw new Error('Error creating the multipart upload in S3');
        }
        if (data) {
          console.log(
            'Multipart upload successfully created! Proceeding to uploading of first file chunk...'
          );
          uploadId = data.UploadId || '';

          const uploadPartParms: S3.Types.UploadPartRequest = {
            Bucket: bucket,
            Key: key,
            UploadId: uploadId,
            PartNumber: 1,
          };

          const fileChunkBuffer = req.file!.buffer;
          const fileChunkStream = buffToStream(fileChunkBuffer);

          uploadPartParms.Body = fileChunkStream;

          s3.uploadPart(uploadPartParms, (err, data) => {
            if (err) {
              console.log('S3 uploadPart error: ', err);
              throw new Error('Error uploading file part into S3');
            }
            if (data) {
              console.log('File part uploaded successfully!');

              const successfulPartUploadRes = {
                eTag: data.ETag,
                partNumber,
                key,
              };

              res.status(201).send(successfulPartUploadRes);
            }
          });
        }
      });
    } else {
      // TODO: Send subsequent part upload requests
      // TODO: Complete multipart upload request and save
      // video post
    }
  }
);

export { router as createVideoPostRouter };
