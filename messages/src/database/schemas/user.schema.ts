import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Conversation } from './conversation.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, minlength: 5, maxlength: 20 })
  name: string;

  @Prop({ required: true })
  username: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' }],
  })
  joinedConversations: Conversation[];

  @Prop({ type: mongoose.Schema.Types.Mixed })
  sessionCookie: Record<string, any>;

  @Prop()
  isAuthenticated: boolean;

  @Prop()
  photoS3Key?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
