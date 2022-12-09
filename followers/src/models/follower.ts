import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface FollowerAttrs {
  userId: string;
  followerId: string;
}

export interface FollowerDoc extends mongoose.Document {
  userId: string;
  followerId: string;
}

interface FollowerModel extends mongoose.Model<FollowerDoc> {
  build(attrs: FollowerAttrs): FollowerDoc;
}

const followerSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    followerId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.version;
      },
    },
  }
);

followerSchema.set('versionKey', 'version');

followerSchema.plugin(updateIfCurrentPlugin);

followerSchema.statics.build = (attrs: FollowerAttrs) => {
  return new Follower(attrs);
};

const Follower = mongoose.model<FollowerDoc, FollowerModel>(
  'Follower',
  followerSchema
);

export { Follower };
