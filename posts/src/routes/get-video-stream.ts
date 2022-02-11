import express, { Request, Response } from 'express';
import { Post, PostResponseObj } from '../models/post';
import { requireAuth, BadRequestError } from '@ggabella-photo-share/common';
import { decodeBase64Data } from '../utils/converters';

import { AWS } from '../index';
import { S3 } from 'aws-sdk';
import { uploadObject, deleteObject } from '../utils/s3HelperUtils';

const router = express.Router();

router.get(
  '/api/posts/video',
  requireAuth,
  async (req: Request, res: Response) => {
    const s3Key = req.query.s3Key as string;
    const range = req.headers.range;

    if (!s3Key) {
      throw new BadRequestError('S3 key not provided');
    }

    let bucket: string;

    if (process.env.NODE_ENV === 'production') {
      bucket = 'photo-share-app-videos';
    } else {
      bucket = 'photo-share-app-videos-dev';
    }

    const s3 = new AWS.S3();

    const listObjParams: S3.Types.ListObjectsV2Request = {
      Bucket: bucket,
      MaxKeys: 1,
      Prefix: s3Key,
    };

    const getObjParams: S3.Types.GetObjectRequest = {
      Bucket: bucket,
      Key: s3Key,
    };

    if (range) {
      getObjParams.Range = range;
    }

    s3.listObjectsV2(listObjParams)
      .promise()
      .then(
        (data) => {
          console.log('Successfully made request to list object in S3: ', data);

          if (data.Contents?.length) {
            if (range) {
              const bytes = range.replace(/bytes=/, '').split('-');
              const start = parseInt(bytes[0]);
              const totalSize = data.Contents[0].Size;
              const end = bytes[1] ? parseInt(bytes[1]) : totalSize! - 1;
              const chunkSize = end - start + 1;
              console.log('Set rangem bytes, start, total, end, and chunkSize');

              res.writeHead(206, {
                'Content-Range': `bytes ${start}-${end}/${totalSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunkSize,
                'Content-Type': 'video/mp4',
              });
              console.log('Wrote header');

              s3.getObject(getObjParams).createReadStream().pipe(res);
              console.log('Got object from s3 and created read stream');
            } else {
              res.writeHead(200, {
                'Content-Length': data.Contents[0].Size,
                'Content-Type': 'video/mp4',
              });

              s3.getObject(getObjParams).createReadStream().pipe(res);
              console.log(
                'No range provided, wrote header and got object from s3 and created read stream'
              );
            }
          }
        },
        (reason) => {
          console.log('Error listing object in s3: ', reason);
          throw new Error('Error listing object in s3');
        }
      )
      .catch((err) => {
        console.log('An error occurred: ', err);

        throw new Error('An error occurred');
      });
  }
);

export { router as getVideoStreamRouter };
