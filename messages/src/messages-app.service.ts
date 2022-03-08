import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  Conversation,
  ConversationDocument,
} from './schemas/conversation.schema';
import { User, UserDocument } from './schemas/user.schema';
import { Message, MessageDocument } from './schemas/message.schema';
import { CreateConvoDto } from './dto/create-convo.dto';

@Injectable()
export class MessagesAppService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async createConversation(
    createConvoDto: CreateConvoDto
  ): Promise<Conversation> {
    const createdConvo = new this.conversationModel(createConvoDto);
    return createdConvo.save();
  }
}
