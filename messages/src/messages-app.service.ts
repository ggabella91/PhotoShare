import { Injectable, Logger } from '@nestjs/common';
import { Model, Condition, LeanDocument } from 'mongoose';
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
import { UpdateUserNicknameForConvoDto } from './database/dto/update-user-nickname-for-convo-dto';
import { FindMessagesFromConvo } from './database/dto/find-messages-from-convo.dto';
import {
  UpdateConvoPreDto,
  UpdateConvoDto,
} from './database/dto/update-convo-dto';
import { WsException } from '@nestjs/websockets';
import { RemoveMessageDto } from './database/dto/remove-message.dto';
import { FindSingleMessageDto } from './database/dto/find-single-message.dto';

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

    const { creator, ...restOfParams } = createConvoPreDto;

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
        ...restOfParams,
        connectedUsers: userIdArray,
        historicalUsers: userIdArray,
        adminUsers: [creator],
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

  async updateUserNicknameForConvo({
    conversationId,
    userId,
    nickname,
  }: UpdateUserNicknameForConvoDto) {
    const conversation = await this.conversationModel.findById(conversationId);

    if (
      !conversation ||
      conversation?.connectedUsers.map((user) => user.userId).includes(userId)
    ) {
      return null;
    }

    let userNicknames = conversation.userNicknames;
    const nicknameIdx = userNicknames.findIndex(
      (nickname) => nickname.userId === userId
    );
    if (nicknameIdx >= 0) {
      userNicknames.splice(nicknameIdx, 1, { userId, nickname });
    } else {
      userNicknames.push({ userId, nickname });
    }

    const updatedConversation = await this.conversationModel.findByIdAndUpdate(
      conversationId,
      { userNicknames },
      { new: true }
    );

    return updatedConversation;
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

  async removeMessage(removeMessageDto: RemoveMessageDto) {
    const removedMessage = await this.messageModel.findByIdAndUpdate(
      removeMessageDto.messageId,
      { hidden: true }
    );

    this.logger.log(
      `Removed message with id ${removeMessageDto.messageId} ${removedMessage} for conversation with id ${removeMessageDto.conversationId}`
    );
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
    let messagesFromConvo: MessageDocument[];
    let queryLength: number;
    const parsedLimit = parseInt(limit);
    const parsedOffset = parseInt(offset);

    if (parsedLimit) {
      if (parsedOffset === 1) {
        queryLength = (await this.messageModel.find({ conversationId })).length;
      }

      messagesFromConvo = await this.messageModel
        .find(
          {
            conversationId,
          },
          null,
          { sort: { _id: -1 } }
        )
        .limit(parsedLimit)
        .skip((parsedOffset - 1) * parsedLimit);
    } else {
      messagesFromConvo = await this.messageModel.find(
        {
          conversationId,
        },
        null,
        { sort: { _id: -1 } }
      );
    }

    const messagesFromConvoObjects: LeanDocument<MessageDocument>[] =
      messagesFromConvo.map((message) => message.toObject());

    this.logger.log(
      `Found the following messages from conversation with id ${conversationId}: `,
      messagesFromConvoObjects
    );

    this.logger.log(`queryLength: ${queryLength}`);

    return {
      messages: messagesFromConvoObjects,
      ...(!!queryLength && { queryLength }),
    };
  }

  async findSingleMessage(findSingleMessageDto: FindSingleMessageDto) {
    const { messageId } = findSingleMessageDto;
    const message = (await this.messageModel.findById(messageId)).toObject();

    return message;
  }

  async updateConversation(updateConvoPreDto: UpdateConvoPreDto) {
    const { id, connectedUsers, updatingUser, adminUsers, ...updateProps } =
      updateConvoPreDto;

    const conversation = await this.conversationModel.findById(id);
    const convoAdminUserIds = conversation.adminUsers;
    const historicalUsers = conversation.historicalUsers;

    let newHistoricalUsers: string[];
    if (connectedUsers && historicalUsers.length < connectedUsers.length) {
      const newUsers = connectedUsers
        .map((user) => user.userId)
        .filter((userId) => !historicalUsers.includes(userId));

      newHistoricalUsers = [...historicalUsers, ...newUsers];
    } else {
      newHistoricalUsers = [...historicalUsers];
    }

    if (!convoAdminUserIds.includes(updatingUser)) {
      throw new WsException(
        'Requesting user is not an admin for this conversation'
      );
    }

    let updateConvoDto: UpdateConvoDto = { ...updateProps };
    updateConvoDto.historicalUsers = newHistoricalUsers;

    if (connectedUsers) {
      await Promise.all(
        connectedUsers.map((user) =>
          this.findOrCreateUser({
            userId: user.userId,
            name: user.name,
            username: user.username,
            photoS3Key: user.photoS3Key,
          })
        )
      );

      updateConvoDto.connectedUsers = connectedUsers.map((user) => user.userId);
    }

    if (adminUsers) {
      updateConvoDto.adminUsers = adminUsers;
    }

    const updatedConversation = await this.conversationModel.findByIdAndUpdate(
      id,
      {
        ...updateConvoDto,
      },
      { new: true }
    );

    this.logger.log(
      `Updated conversation with id ${id}: `,
      updatedConversation
    );

    return updatedConversation;
  }
}
