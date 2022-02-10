import { AWS } from '../index';
import { S3 } from 'aws-sdk';

export const abortMultipartUpload = (
  abortMultipartUploadParams: S3.Types.AbortMultipartUploadRequest
) => {
  const s3 = new AWS.S3();

  s3.abortMultipartUpload(abortMultipartUploadParams)
    .promise()
    .then(() => {
      console.log('Aborted multipart upload');
    })
    .catch((err) => {
      console.log('Error aborting multipart upload: ', err);
    });
};

export const uploadObject = (thumbnailKey: string, objData: Buffer) => {
  let bucket: string = '';

  if (process.env.NODE_ENV === 'production') {
    bucket = 'photo-share-app';
  } else {
    bucket = 'photo-share-app-dev';
  }
  const uploadObjParams: S3.Types.PutObjectRequest = {
    Bucket: bucket,
    Key: thumbnailKey,
    Body: objData,
    ContentEncoding: 'base64',
    ContentType: 'image/jpeg',
  };

  const s3 = new AWS.S3();

  return s3
    .upload(uploadObjParams, (err, data) => {
      if (err) {
        console.log('Error uploading video thumbnail: ', err);
      }
      if (data) {
        console.log('Uploaded video thumbnail successfully!');
      }
    })
    .promise();
};

export const deleteObject = (deleteObjParams: S3.Types.DeleteObjectRequest) => {
  const s3 = new AWS.S3();

  s3.deleteObject(deleteObjParams)
    .promise()
    .then(
      (data) => {
        console.log('Object successfully deleted in S3: ', data);
      },
      (reason) => {
        console.log('Error deleting object in S3: ', reason);
      }
    );
};
