import express, { Request, Response } from 'express';
import { Post, PostResponseObj } from '../models/post';
import { LocationAttrs, LocationDoc } from '../models/location';
import { requireAuth, BadRequestError } from '@ggabella-photo-share/common';
import { decodeBase64Data } from '../utils/converters';
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
import {
  abortMultipartUpload,
  uploadObject,
  deleteObject,
} from '../utils/s3HelperUtils';

const router = express.Router();

router.post(
  '/api/posts/new-video',
  requireAuth,
  async (req: Request, res: Response) => {
    const createNewMultipartUpload: boolean =
      req.body.createNewMultipartUpload || false;
    const completeMultipartUpload: boolean =
      req.body.completeMultipartUpload || false;
    const partNumber: number = req.body.partNumber;

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
        ContentEncoding: 'base64',
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

            const fileChunkString: string = req.body.fileChunk;
            const chunkBuffer = decodeBase64Data(fileChunkString);

            uploadPartParms.Body = chunkBuffer;

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

                abortMultipartUpload(abortMultipartUploadParams);

                throw new Error(
                  'Error uploading file part into S3 - Multipart upload aborted'
                );
              }
            );
        });
    } else if (completeMultipartUpload) {
      const multiPartUploadArray: { ETag: string; PartNumber: number }[] =
        req.body.multiPartUploadArray;
      const uploadId: string = req.body.uploadId;
      const key: string = req.body.key;
      const fileName: string = req.body.fileName;

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

              if (!fileName) {
                deleteObject({ Key: key, Bucket: bucket });
                throw new BadRequestError('File name not provided');
              }

              const caption: string = req.body.caption || '';
              let postLocation: LocationReq | LocationAttrs = req.body.location;
              const videoThumbnail: string = req.body.videoThumbnail || '';
              let hashtags: string[] = [];

              let videoThumbnailS3Key: string = '';
              if (caption) {
                hashtags = extractHashtags(caption);
              }
              if (postLocation) {
                postLocation = createLocationObject(
                  postLocation as LocationReq
                );
              }
              if (videoThumbnail.length) {
                const thumbnailBuffer = decodeBase64Data(videoThumbnail);

                const thumbnailKey = key + '_thumbnail';

                const { Key } = await uploadObject(
                  thumbnailKey,
                  thumbnailBuffer
                );

                videoThumbnailS3Key = Key;
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
                videoThumbnailS3Key,
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

            abortMultipartUpload(abortMultipartUploadParams);

            throw new Error(
              'Error uploading file part into S3 - Multipart upload aborted'
            );
          }
        );
    } else {
      // Send subsequent part upload requests
      const uploadId: string = req.body.uploadId;
      const key: string = req.body.key;

      const uploadPartParms: S3.Types.UploadPartRequest = {
        Bucket: bucket,
        Key: key,
        UploadId: uploadId,
        PartNumber: partNumber,
      };

      const fileChunkString: string = req.body.fileChunk;
      const chunkBuffer = decodeBase64Data(fileChunkString);

      uploadPartParms.Body = chunkBuffer;

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

            abortMultipartUpload(abortMultipartUploadParams);

            throw new Error(
              'Error uploading file part into S3 - Multipart upload aborted'
            );
          }
        );
    }
  }
);

export { router as createVideoPostRouter };
