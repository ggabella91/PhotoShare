import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Conversation } from './conversation.schema';
import { User } from './user.schema';

export type MessageDocument = Message & Document;

// TODO Add property for timestamp for when a message is unsent,
// to be added when the message is hidden

// TODO Add property with array with userId's for whom a
// message is permanently removed (doesn't even render "Message
// removed" and done on a per-user basis)

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

  @Prop()
  isReply: boolean;

  @Prop()
  messageReplyingToId: string;

  @Prop()
  messageReplyingToOwnerId: string;

  @Prop()
  messageReplyingToOwnerName: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
