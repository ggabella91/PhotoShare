import express, { Request, Response } from 'express';
import multer from 'multer';
import { resizePhoto } from '../utils/photoManipulation';
import { ConversationPhoto } from '../models/conversation-photo';
import { requireAuth, BadRequestError } from '@ggabella-photo-share/common';
import { buffToStream } from '../utils/buffToStream';
import { AWS } from '../index';
import { S3 } from 'aws-sdk';
import { ConversationPhotoUpdatedPublisher } from '../events/publishers/conversation-photo-updated-publisher';
import { natsWrapper } from '../nats-wrapper';
import { generateKey } from '../utils/generateKey';

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
  '/api/posts/conversationPhoto',
  requireAuth,
  upload.single('conversation-photo'),
  resizePhoto,
  async (req: Request, res: Response) => {
    const key = generateKey(req.file!.originalname, false);
    const conversationId: string = req.body.conversationId;
    const existingPhotoKey: string = req.body.existingConvoPhoto;

    console.log('req.file.originalname: ', req.file!.originalname);
    console.log('req.file.filename: ', req.file!.filename);

    const s3 = new AWS.S3();

    let bucket: string;

    if (process.env.NODE_ENV === 'production') {
      bucket = 'photo-share-app-conversation-photos';
    } else {
      bucket = 'photo-share-app-conversation-photos-dev';
    }

    if (existingPhotoKey) {
      const deleteParams: S3.Types.DeleteObjectRequest = {
        Bucket: bucket,
        Key: existingPhotoKey,
      };

      s3.deleteObject(deleteParams, async (err, data) => {
        if (err) {
          throw new Error('Error deleting existing conversation photo.');
        }
        if (data) {
          console.log('Existing conversation photo deleted successfully!');
        }
      });
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

        const photoDoc = ConversationPhoto.build({
          fileName: req.file!.originalname,
          createdAt: new Date(),
          conversationId,
          s3Key: key,
          s3ObjectURL: location,
        });

        await photoDoc.save();

        await new ConversationPhotoUpdatedPublisher(natsWrapper.client).publish(
          { conversationId, s3Key: key }
        );

        res.status(201).send(photoDoc);
      }
    });
  }
);

export { router as conversationPhotoRouter };
