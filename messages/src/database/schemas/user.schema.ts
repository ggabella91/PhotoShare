import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Conversation } from './conversation.schema';

export type UserDocument = User & Document;

@Schema({
  toObject: {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret._v;
      return ret;
    },
  },
})
export class User {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, minlength: 5, maxlength: 20 })
  name: string;

  @Prop({ required: true })
  username: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' }],
  })
  joinedConversations: Conversation[];

  @Prop({ type: mongoose.Schema.Types.Mixed })
  sessionCookie: Record<string, any>;

  @Prop()
  isAuthenticated: boolean;

  @Prop()
  photoS3Key?: string;

  @Prop()
  isOnline: boolean;

  @Prop()
  lastActiveTime: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
