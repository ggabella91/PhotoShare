import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface ProfilePhotoAttrs {
  fileName: string;
  createdAt: Date;
  userId: string;
  s3Key: string;
  s3ObjectURL: string;
}

export interface ProfilePhotoDoc extends mongoose.Document {
  fileName: string;
  createdAt: Date;
  userId: string;
  s3Key: string;
  s3ObjectURL: string;
}

interface ProfilePhotoModel extends mongoose.Model<ProfilePhotoDoc> {
  build(attrs: ProfilePhotoAttrs): ProfilePhotoDoc;
}

const profilePhotoSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    s3Key: {
      type: String,
      required: true,
    },
    s3ObjectURL: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

profilePhotoSchema.set('versionKey', 'version');

profilePhotoSchema.plugin(updateIfCurrentPlugin);

profilePhotoSchema.statics.build = (attrs: ProfilePhotoAttrs) => {
  return new ProfilePhoto(attrs);
};

const ProfilePhoto = mongoose.model<ProfilePhotoDoc, ProfilePhotoModel>(
  'ProfilePhoto',
  profilePhotoSchema
);

export { ProfilePhoto };
