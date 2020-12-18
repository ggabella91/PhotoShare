import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface PostAttrs {
  fileName: string;
  caption?: string;
  postLocation?: string;
  createdAt: Date;
  userId: string;
  s3Key: string;
  s3ObjectURL: string;
  archived?: boolean;
}

export interface PostDoc extends mongoose.Document {
  fileName: string;
  caption?: string;
  postLocation?: string;
  createdAt: Date;
  userId: string;
  s3Key: string;
  s3ObjectURL: string;
  archived?: boolean;
}

interface PostModel extends mongoose.Model<PostDoc> {
  build(attrs: PostAttrs): PostDoc;
}

const postSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
    },
    postLocation: {
      type: String,
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

postSchema.set('versionKey', 'version');

postSchema.plugin(updateIfCurrentPlugin);

postSchema.statics.build = (attrs: PostAttrs) => {
  return new Post(attrs);
};

const Post = mongoose.model<PostDoc, PostModel>('Post', postSchema);

export { Post };
