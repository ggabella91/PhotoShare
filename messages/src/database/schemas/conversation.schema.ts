import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from './user.schema';

export type ConversationDocument = Conversation & Document;

@Schema({ id: false })
class UserNickname {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  nickname: string;
}

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
export class Conversation {
  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  })
  connectedUsers: User[];

  @Prop({
    required: true,
  })
  historicalUsers: string[];

  @Prop()
  lastMessageTime: number;

  @Prop()
  avatarS3Keys: string[];

  @Prop()
  conversationImageS3Key: string;

  @Prop()
  connectedUserNames: string[];

  @Prop()
  adminUsers: string[];

  @Prop()
  userNicknames: UserNickname[];
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
