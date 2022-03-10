import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  Conversation,
  ConversationDocument,
} from './database/schemas/conversation.schema';
import { User, UserDocument } from './database/schemas/user.schema';
import { Message, MessageDocument } from './database/schemas/message.schema';
import { CreateConvoDto } from './database/dto/create-convo.dto';
import { CreateMessageDto } from './database/dto/create-message.dto';
import { CreateUserDto } from './database/dto/create-user.dto';
import { FindMessagesFromConvo } from './database/dto/find-message-from-convo.dto';

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
    return await createdConvo.save();
  }

  async findOrCreateUser(createUserDto: CreateUserDto) {
    const existingUser = await this.userModel
      .findById(createUserDto.userId)
      .exec();

    if (existingUser) {
      return existingUser;
    } else {
      const createdUser = new this.userModel(createUserDto);
      return await createdUser.save();
    }
  }

  async findAllConversationsForUser(userId: string) {
    const conversationsForUser = await this.conversationModel
      .find({
        connectedUsers: userId,
      })
      .exec();

    return conversationsForUser;
  }

  async createMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    const createdMessage = new this.messageModel(createMessageDto);
    return await createdMessage.save();
  }

  async findMessagesFromConvo({
    conversationId,
    limit,
    offset,
  }: FindMessagesFromConvo) {
    const messagesFromConvo = await this.messageModel
      .find(
        {
          conversation: conversationId,
        },
        null,
        { sort: { created: -1 } }
      )
      .limit(limit)
      .skip((offset - 1) * limit);

    return messagesFromConvo;
  }
}
