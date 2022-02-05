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

// const fileStorage = multer.memoryStorage();

// const videoFilter = (
//   req: Request,
//   file: Express.Multer.File,
//   cb: multer.FileFilterCallback
// ): void => {
//   if (file.mimetype.startsWith('application')) {
//     cb(null, true);
//   } else {
//     console.log('file.mimetype: ', file.mimetype);
//     cb(new BadRequestError('Only octet-streams can be uploaded'));
//   }
// };

// const upload = multer({ storage: fileStorage, fileFilter: videoFilter });

router.post(
  '/api/posts/new-video',
  requireAuth,
  async (req: Request, res: Response) => {
    const createNewMultipartUpload: boolean =
      req.body.createNewMultipartUpload || false;
    const completeMultipartUpload: boolean =
      req.body.completeMultipartUpload || false;
    const partNumber: number = req.body.partNumber;

    if (!partNumber && !completeMultipartUpload) {
      throw new BadRequestError('Part number not provided');
    }

    const s3 = new AWS.S3();

    let bucket: string;

    if (process.env.NODE_ENV === 'production') {
      bucket = 'photo-share-app-videos';
    } else {
      bucket = 'photo-share-app-videos-dev';
    }

    if (createNewMultipartUpload) {
      const fileName: string = req.body.fileName;
      const contentType: string = req.body.contentType;

      if (!fileName) {
        throw new BadRequestError('File name not provided');
      }

      if (!contentType) {
        throw new BadRequestError('Content type not provided');
      }

      const key = generateKey(fileName);

      const uploadParams: S3.Types.CreateMultipartUploadRequest = {
        Bucket: bucket,
        Key: key,
        ContentType: contentType,
      };

      let uploadId: string = '';

      s3.createMultipartUpload(uploadParams)
        .promise()
        .then(
          (data) => {
            console.log(
              'Multipart upload successfully created! Proceeding to uploading of first file chunk...'
            );
            console.log('data: ', data);
            uploadId = data.UploadId || '';

            const uploadPartParms: S3.Types.UploadPartRequest = {
              Bucket: bucket,
              Key: key,
              UploadId: uploadId,
              PartNumber: 1,
            };

            const fileChunkArrayBuffer: ArrayBuffer = req.body.fileChunk;
            const fileChunkBuffer = Buffer.from(fileChunkArrayBuffer);

            uploadPartParms.Body = fileChunkBuffer;

            return uploadPartParms;
          },
          (reason) => {
            console.log('S3 createMultipartUpload error: ', reason);
            throw new Error('Error creating the multipart upload in S3');
          }
        )
        .then((uploadPartParms) => {
          s3.uploadPart(uploadPartParms)
            .promise()
            .then(
              (data) => {
                if (data) {
                  console.log('File part uploaded successfully!');
                  console.log('data: ', data);

                  const successfulPartUploadRes = {
                    eTag: data.ETag,
                    partNumber,
                    key,
                    uploadId,
                  };

                  res.status(201).send(successfulPartUploadRes);
                }
              },
              (reason) => {
                console.log('S3 uploadPart error: ', reason);

                const abortMultipartUploadParams: S3.Types.AbortMultipartUploadRequest =
                  { Bucket: bucket, Key: key, UploadId: uploadId };

                s3.abortMultipartUpload(abortMultipartUploadParams)
                  .promise()
                  .then((data) => {
                    console.log('Aborted multipart upload: ', data);

                    throw new Error(
                      'Error uploading file part into S3 - Multipart upload aborted'
                    );
                  })
                  .catch((err) => {
                    console.log('Error aborting multipart upload: ', err);

                    throw new Error('Error aborting multipart upload');
                  });
              }
            );
        });
    } else if (completeMultipartUpload) {
      const multiPartUploadArray: { ETag: string; PartNumber: number }[] =
        req.body.multiPartUploadArray;
      const uploadId: string = req.body.uploadId;
      const key: string = req.body.key;

      if (!uploadId) {
        throw new BadRequestError('Upload Id not provided');
      }

      if (!key) {
        throw new BadRequestError('Key not provided');
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

      s3.completeMultipartUpload(completeMultipartUploadParams)
        .promise()
        .then(
          async (data) => {
            if (data) {
              const location = data.Location || '';
              console.log('Multipart uploaded completed successfully in S3!');
              console.log('data: ', data);

              const caption: string = req.body.caption || '';
              let postLocation: LocationReq | LocationAttrs = req.body.location;
              let hashtags: string[] = [];
              if (caption) {
                hashtags = extractHashtags(caption);
              }
              if (postLocation) {
                postLocation = createLocationObject(
                  postLocation as LocationReq
                );
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
                fileName: req.body.fileName,
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
          },
          (reason) => {
            console.log('S3 completeMultipartUpload error: ', reason);

            const abortMultipartUploadParams: S3.Types.AbortMultipartUploadRequest =
              { Bucket: bucket, Key: key, UploadId: uploadId };

            s3.abortMultipartUpload(abortMultipartUploadParams)
              .promise()
              .then((data) => {
                console.log('Aborted multipart upload: ', data);

                throw new Error(
                  'Error completing multipart upload in S3 - Multipart upload aborted'
                );
              })
              .catch((err) => {
                console.log('Error aborting multipart upload: ', err);

                throw new Error('Error aborting multipart upload');
              });
          }
        );
    } else {
      // Send subsequent part upload requests
      const uploadId: string = req.body.uploadId;
      const key: string = req.body.key;

      if (!key) {
        throw new BadRequestError('Key not provided');
      }

      if (!uploadId) {
        throw new BadRequestError('Upload Id not provided');
      }

      const uploadPartParms: S3.Types.UploadPartRequest = {
        Bucket: bucket,
        Key: key,
        UploadId: uploadId,
        PartNumber: partNumber,
      };

      const fileChunkArrayBuffer: ArrayBuffer = req.body.fileChunk;
      const fileChunkBuffer = Buffer.from(fileChunkArrayBuffer);

      uploadPartParms.Body = fileChunkBuffer;

      uploadPartParms.Body = fileChunkBuffer;

      s3.uploadPart(uploadPartParms)
        .promise()
        .then(
          (data) => {
            if (data) {
              console.log('File part uploaded successfully!');

              const successfulPartUploadRes = {
                eTag: data.ETag,
                partNumber,
                key,
                uploadId,
              };

              res.status(201).send(successfulPartUploadRes);
            }
          },
          (reason) => {
            console.log('S3 uploadPart error: ', reason);

            const abortMultipartUploadParams: S3.Types.AbortMultipartUploadRequest =
              { Bucket: bucket, Key: key, UploadId: uploadId };

            s3.abortMultipartUpload(abortMultipartUploadParams)
              .promise()
              .then((data) => {
                console.log('Aborted multipart upload: ', data);

                throw new Error(
                  'Error uploading file part into S3 - Multipart upload aborted'
                );
              })
              .catch((err) => {
                console.log('Error aborting multipart upload');

                throw new Error('Error aborting multipart upload');
              });
          }
        );
    }
  }
);

export { router as createVideoPostRouter };
