import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { User } from './user.schema';

export type ConversationDocument = Conversation & Document;

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
  connectedUserNames: string[];

  @Prop()
  adminUsers: string[];
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
