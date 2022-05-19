import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { User } from './user.schema';

export type ConversationDocument = Conversation & Document;

@Schema()
export class Conversation {
  @Prop({ required: true })
  name: string;

  // @Prop([String])
  // messages: string[];

  @Prop({
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  })
  connectedUsers: User[];

  @Prop()
  lastMessageTime: number;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
