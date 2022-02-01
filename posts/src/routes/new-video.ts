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
  if (file.mimetype.startsWith('application')) {
    cb(null, true);
  } else {
    console.log('file.mimetype: ', file.mimetype);
    cb(new BadRequestError('Only octet-streams can be uploaded'));
  }
};

const upload = multer({ storage: fileStorage, fileFilter: videoFilter });

router.post(
  '/api/posts/new-video',
  requireAuth,
  upload.single('videoChunk'),
  async (req: Request, res: Response) => {
    console.log('req.body: ', req.body);

    const createNewMultipartUpload: boolean =
      req.body.createNewMultipartUpload === 'true' || false;
    const completeMultipartUpload: boolean =
      req.body.completeMultipartUpload === 'true' || false;
    const partNumber: number = parseInt(req.body.partNumber);

    if (!partNumber) {
      throw new BadRequestError('Part number not provided');
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

      let uploadId: string = '';

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
    } else if (completeMultipartUpload) {
      const multiPartUploadArray: { ETag: string; PartNumber: number }[] =
        JSON.parse(req.body.multiPartUploadArray);
      const uploadId: string = req.body.uploadId;

      if (!uploadId) {
        throw new BadRequestError('Upload Id not provided');
      }

      if (!multiPartUploadArray || !multiPartUploadArray.length) {
        throw new BadRequestError('Missing or empty multipart upload array');
      }

      console.log('Proceeding to complete multipart upload request...');

      const completeMultipartUploadParams: S3.Types.CompleteMultipartUploadRequest =
        {
          Bucket: bucket,
          Key: key,
          MultipartUpload: { Parts: multiPartUploadArray },
          UploadId: uploadId,
        };

      s3.completeMultipartUpload(
        completeMultipartUploadParams,
        async (err, data) => {
          if (err) {
            console.log('S3 completeMultipartUpload error: ', err);
            throw new Error('Error complete multipart upload in S3');
          }
          if (data) {
            const location = data.Location || '';
            console.log(
              'Multipart uploaded completed successfully in S3!',
              location
            );

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

            const comments = 0;
            const likes = 0;
            const totalReactions = 0;

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
              isVideo: true,
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
        }
      );
    } else {
      // Send subsequent part upload requests
      const uploadId: string = req.body.uploadId;

      if (!uploadId) {
        throw new BadRequestError('Upload Id not provided');
      }

      const uploadPartParms: S3.Types.UploadPartRequest = {
        Bucket: bucket,
        Key: key,
        UploadId: uploadId,
        PartNumber: partNumber,
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
  }
);

export { router as createVideoPostRouter };
