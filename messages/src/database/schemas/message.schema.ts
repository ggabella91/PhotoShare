import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Conversation } from './conversation.schema';
import { User } from './user.schema';

export type MessageDocument = Message & Document;

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
export class Message {
  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  created: Date;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  ownerId: User;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
  })
  conversationId: Conversation;

  @Prop()
  hidden: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
