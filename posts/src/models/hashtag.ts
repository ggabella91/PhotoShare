import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface HashtagAttrs {
  hashtag: string;
  postCount: number;
}

export interface HashtagDoc extends mongoose.Document {
  hashtag: string;
  postCount: number;
}

interface HashtagModel extends mongoose.Model<HashtagDoc> {
  build(attrs: HashtagAttrs): HashtagDoc;
}

const hashtagSchema = new mongoose.Schema(
  {
    hashtag: {
      type: String,
      required: true,
    },
    postCount: {
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
  }
);

hashtagSchema.set('versionKey', 'version');

hashtagSchema.plugin(updateIfCurrentPlugin);

hashtagSchema.statics.build = (attrs: HashtagAttrs) => {
  return new Hashtag(attrs);
};

const Hashtag = mongoose.model<HashtagDoc, HashtagModel>(
  'Hashtag',
  hashtagSchema
);

export { Hashtag };
