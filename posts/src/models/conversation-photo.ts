import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface ConversationPhotoPhotoAttrs {
  fileName: string;
  createdAt: Date;
  conversationId: string;
  s3Key: string;
  s3ObjectURL: string;
}

export interface ConversationPhotoPhotoDoc extends mongoose.Document {
  fileName: string;
  createdAt: Date;
  conversationId: string;
  s3Key: string;
  s3ObjectURL: string;
}

interface ConversationPhotoPhotoModel
  extends mongoose.Model<ConversationPhotoPhotoDoc> {
  build(attrs: ConversationPhotoPhotoAttrs): ConversationPhotoPhotoDoc;
}

// TODO Create route handler for uploading conversation photos

const conversationPhotoSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
    conversationId: {
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

conversationPhotoSchema.set('versionKey', 'version');

conversationPhotoSchema.plugin(updateIfCurrentPlugin);

conversationPhotoSchema.statics.build = (
  attrs: ConversationPhotoPhotoAttrs
) => {
  return new ConversationPhoto(attrs);
};

const ConversationPhoto = mongoose.model<
  ConversationPhotoPhotoDoc,
  ConversationPhotoPhotoModel
>('ConversationPhoto', conversationPhotoSchema);

export { ConversationPhoto };
