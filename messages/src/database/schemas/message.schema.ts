import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Conversation } from './conversation.schema';
import { User } from './user.schema';

export type MessageDocument = Message & Document;

@Schema({ id: false })
class MessageSeenBy {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  seenTime: Date;
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
  messageHiddenTime: Date;

  @Prop()
  usersMessageIsRemovedFor: string[];

  @Prop()
  isReply: boolean;

  @Prop()
  messageReplyingToId: string;

  @Prop()
  messageReplyingToOwnerId: string;

  @Prop()
  messageReplyingToOwnerName: string;

  @Prop()
  usersForWhomMessageWasLastOneSeen: MessageSeenBy[];

  @Prop()
  status: 'sent' | 'delivered' | 'error';

  // For displaying message status before it is seen
  @Prop()
  hasBeenViewedByOtherUsers: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
