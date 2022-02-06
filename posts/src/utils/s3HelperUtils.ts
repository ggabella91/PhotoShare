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
