import mongoose, { LeanDocument } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { LocationDoc } from './location';

interface PostAttrs {
  fileName: string;
  caption?: string;
  postLocation?: string;
  createdAt: Date;
  userId: string;
  s3Key: string;
  s3ObjectURL: string;
  archived?: boolean;
  hashtags: string[];
  comments: number;
  likes: number;
  totalReactions: number;
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
  hashtags: string[];
  comments: number;
  likes: number;
  totalReactions: number;
}

export interface PostResponseObj {
  fileName: string;
  caption?: string;
  postLocation?: LeanDocument<LocationDoc>;
  createdAt: Date;
  userId: string;
  s3Key: string;
  s3ObjectURL: string;
  archived?: boolean;
  hashtags: string[];
  comments: number;
  likes: number;
  totalReactions: number;
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
    archived: {
      type: Boolean,
    },
    hashtags: {
      type: [String],
      required: true,
    },
    comments: {
      type: Number,
      required: true,
    },
    likes: {
      type: Number,
      required: true,
    },
    totalReactions: {
      type: Number,
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
    toObject: {
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
