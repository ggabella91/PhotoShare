import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface ReactionAttrs {
  createdAt: Date;
  reactingUserId: string;
  postId: string;
  likedPost: boolean;
  comment?: string;
}

export interface ReactionDoc extends mongoose.Document {
  createdAt: Date;
  reactingUserId: string;
  postId: string;
  likedPost: boolean;
  comment?: string;
}

interface ReactionModel extends mongoose.Model<ReactionDoc> {
  build(attrs: ReactionAttrs): ReactionDoc;
}

const reactionSchema = new mongoose.Schema(
  {
    createdAt: {
      type: Date,
      required: true,
    },
    reactingUserId: {
      type: String,
      required: true,
    },
    postId: {
      type: String,
      required: true,
    },
    likedPost: {
      type: Boolean,
      required: true,
    },
    comment: {
      type: String,
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

reactionSchema.set('versionKey', 'version');

reactionSchema.plugin(updateIfCurrentPlugin);

reactionSchema.statics.build = (attrs: ReactionAttrs) => {
  return new Reaction(attrs);
};

const Reaction = mongoose.model<ReactionDoc, ReactionModel>(
  'Reaction',
  reactionSchema
);

export { Reaction };
