import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Conversation } from './conversation.schema';
import { User } from './user.schema';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  // _id: ObjectId;

  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  created: Date;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  owner: User;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
  })
  conversation: Conversation;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
