import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Conversation } from './conversation.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  // _id: ObjectId;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, minlength: 5, maxlength: 20 })
  name: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' }],
  })
  joinedConversations: Conversation[];

  @Prop()
  sessionCookie: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
