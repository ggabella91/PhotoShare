import { Injectable, Logger } from '@nestjs/common';
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
import { UpdateAuthStatusDto } from './database/dto/update-auth-status.dto';

@Injectable()
export class MessagesAppService {
  private logger: Logger = new Logger('Messages App Service');

  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async createConversation(createConvoDto: CreateConvoDto) {
    const createdConvo = new this.conversationModel(createConvoDto);
    const savedConvo = (await createdConvo.save()).toObject();

    return savedConvo;
  }

  async findOrCreateUser(createUserDto: CreateUserDto) {
    const existingUser = await this.userModel
      .findById(createUserDto.userId)
      .exec();

    if (existingUser) {
      const existingUserRefreshedSession = await existingUser
        .update({
          sessionCookie: createUserDto.sessionCookie,
        })
        .exec();

      const existingUserObj = existingUserRefreshedSession.toObject();

      return existingUserObj;
    } else {
      const createdUser = new this.userModel(createUserDto);
      const savedUser = (await createdUser.save()).toObject();

      return savedUser;
    }
  }

  async updateUserAuthStatus(updateAuthStatusDto: UpdateAuthStatusDto) {
    const { userId, isAuthenticated } = updateAuthStatusDto;

    const user = await this.userModel.findById(userId).exec();

    const updatedAuthStatusUser = await user.update({ isAuthenticated }).exec();

    return updatedAuthStatusUser;
  }

  async findAllConversationsForUser(userId: string) {
    const conversationsForUser = await this.conversationModel
      .find({
        connectedUsers: userId,
      })
      .exec();

    const conversationsForUserObjects = conversationsForUser.map((convo) =>
      convo.toObject()
    );

    return conversationsForUserObjects;
  }

  async createMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    const createdMessage = new this.messageModel(createMessageDto);
    const savedMessage = (await createdMessage.save()).toObject();

    return savedMessage;
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

    const messagesFromConvoObjects = messagesFromConvo.map((message) =>
      message.toObject()
    );

    return messagesFromConvoObjects;
  }
}
