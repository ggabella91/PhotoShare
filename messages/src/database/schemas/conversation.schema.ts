import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { User } from './user.schema';

export type ConversationDocument = Conversation & Document;

@Schema()
export class Conversation {
  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  connectedUsers: User[];

  @Prop()
  lastMessageTime: number;

  @Prop()
  avatarS3Key: string;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
