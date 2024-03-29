import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface NotificationAttrs {
  fromUserId: string;
  toUserId: string;
  postId?: string;
  message: string;
  createdAt: Date;
}

export interface NotificationDoc extends mongoose.Document {
  fromUserId: string;
  toUserId: string;
  postId?: string;
  message: string;
  createdAt: Date;
}

interface NotificationModel extends mongoose.Model<NotificationDoc> {
  build(attrs: NotificationAttrs): NotificationDoc;
}

const notificationSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: String,
      required: true,
    },
    toUserId: {
      type: String,
      required: true,
    },
    postId: {
      type: String,
    },
    message: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
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

notificationSchema.set('versionKey', 'version');

notificationSchema.plugin(updateIfCurrentPlugin);

notificationSchema.statics.build = (attrs: NotificationAttrs) => {
  return new Notification(attrs);
};

const Notification = mongoose.model<NotificationDoc, NotificationModel>(
  'Notification',
  notificationSchema
);

export { Notification };
