import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Conversation } from './conversation.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, minlength: 5, maxlength: 20 })
  name: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' }],
  })
  joinedConversations: Conversation[];
}

export const UserSchema = SchemaFactory.createForClass(User);
