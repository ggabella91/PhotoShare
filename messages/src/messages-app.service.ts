import { Injectable, Logger } from '@nestjs/common';
import { Model, Condition } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  Conversation,
  ConversationDocument,
} from './database/schemas/conversation.schema';
import { User, UserDocument } from './database/schemas/user.schema';
import { Message, MessageDocument } from './database/schemas/message.schema';
import { CreateConvoPreDto } from './database/dto/create-convo.dto';
import { CreateMessageDto } from './database/dto/create-message.dto';
import { CreateUserDto } from './database/dto/create-user.dto';
import { FindMessagesFromConvo } from './database/dto/find-message-from-convo.dto';
import { UpdateConvoDto } from './database/dto/update-convo-dto';

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

  async createConversation(createConvoPreDto: CreateConvoPreDto) {
    // Call findOrCreateUser for each user in connectedUsers array
    await Promise.all(
      createConvoPreDto.connectedUsers.map((user) =>
        this.findOrCreateUser({
          userId: user.userId,
          name: user.name,
          username: user.username,
          photoS3Key: user.photoS3Key,
        })
      )
    );

    const userIdArray = createConvoPreDto.connectedUsers.map(
      (user) => user.userId
    );

    const existingConvoMatch = await this.conversationModel
      .findOne({
        connectedUsers: userIdArray as Condition<User[]>,
      })
      .exec();

    if (existingConvoMatch) {
      this.logger.log('Found existing conversation with the same users...');

      const updatedExistingConvoMatch = await (
        await this.updateLastMessageTimeForConvo(existingConvoMatch.id)
      ).toObject();

      return updatedExistingConvoMatch;
    } else {
      const createdConvo = new this.conversationModel({
        ...createConvoPreDto,
        connectedUsers: userIdArray,
      });
      const savedConvo = (await createdConvo.save()).toObject();

      return savedConvo;
    }
  }

  async findOrCreateUser(createUserDto: CreateUserDto) {
    const { userId } = createUserDto;

    const existingUser = await this.userModel.findOne({ userId }).exec();

    if (existingUser) {
      this.logger.log('Found existing messages user: ', existingUser);

      let s3Key: string;
      if (
        !existingUser.photoS3Key ||
        (existingUser.photoS3Key && createUserDto.photoS3Key)
      ) {
        s3Key = createUserDto.photoS3Key || '';
      } else {
        s3Key = existingUser.photoS3Key;
      }

      const existingUserRefreshedSessionAndUpdatedAvatar = await this.userModel
        .findOneAndUpdate(
          { userId },
          {
            sessionCookie: createUserDto.sessionCookie,
            photoS3Key: s3Key,
          },
          { new: true }
        )
        .exec();

      const existingUserObj = existingUserRefreshedSessionAndUpdatedAvatar;

      return existingUserObj;
    } else {
      const createdUser = new this.userModel(createUserDto);
      const savedUser = (await createdUser.save()).toObject();

      this.logger.log('Created new messages user: ', savedUser);

      return savedUser;
    }
  }

  async removeUserSessionCookie(userId: string) {
    const user = await this.userModel.findOne({ userId }).exec();

    const updatedAuthStatusUser = await user
      .update({ sessionCookie: {} })
      .exec();

    return updatedAuthStatusUser;
  }

  async findAllConversationsForUser(userId: string) {
    const conversationsForUser = await this.conversationModel
      .find(
        {
          connectedUsers: userId as Condition<User[]>,
        },
        null,
        { sort: { id: -1, lastMessageTime: -1 } }
      )
      .exec();

    const conversationsForUserObjects = conversationsForUser.map((convo) =>
      convo.toObject()
    );

    return conversationsForUserObjects;
  }

  async createMessage(createMessageDto: CreateMessageDto) {
    const createdMessage = new this.messageModel(createMessageDto);
    const savedMessage = (await createdMessage.save()).toObject();

    return savedMessage;
  }

  async updateLastMessageTimeForConvo(conversationId: string) {
    const updatedConversation = await this.conversationModel.findByIdAndUpdate(
      conversationId,
      { lastMessageTime: Date.now() },
      { new: true }
    );

    this.logger.log(
      `Updated conversation with id ${conversationId}: `,
      updatedConversation
    );

    return updatedConversation;
  }

  async findMessagesFromConvo({
    conversationId,
    limit,
    offset,
  }: FindMessagesFromConvo) {
    let messagesFromConvo;
    if (limit) {
      messagesFromConvo = await this.messageModel
        .find({
          conversation: conversationId,
        })
        .limit(limit)
        .skip((offset - 1) * limit);
    } else {
      messagesFromConvo = await this.messageModel.find({
        conversation: conversationId,
      });
    }

    const messagesFromConvoObjects = messagesFromConvo.map((message) =>
      message.toObject()
    );

    this.logger.log(
      `Found the following messages from conversation with id ${conversationId}: `,
      messagesFromConvoObjects
    );

    return messagesFromConvoObjects;
  }

  async updateConversation(updateConvoDto: UpdateConvoDto) {
    const { id, ...updateProps } = updateConvoDto;

    const updatedConversation = await this.conversationModel.findByIdAndUpdate(
      id,
      {
        ...updateProps,
      },
      { new: true }
    );

    this.logger.log(
      `Updated conversation with id ${id}: `,
      updatedConversation
    );
  }
}
