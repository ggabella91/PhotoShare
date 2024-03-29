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
import { PermanentlyRemoveMessageForUserDto } from './database/dto/permanently-remove-message-for-user.dto';
import { UpdateUsersMessageLastViewedDto } from './database/dto/update-message-last-viewed.dto';
import { UpdateMessageStatusDto } from './database/dto/update-message-status.dto';
import { RemoveConversationForUserDto } from './database/dto/remove-conversation-for-user.dto';

@Injectable()
export class MessagesAppService {
  private logger: Logger = new Logger('Messages App Service');

  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>
  ) {}

  async createConversation(createConvoPreDto: CreateConvoPreDto) {
    // Call findOrCreateUser for each user in connectedUsers array
    await Promise.all(
      createConvoPreDto.connectedUsers.map((user) =>
        this.findOrCreateUser({
          userId: user.userId,
          name: user.name,
          username: user.username,
          photoS3Key: user.photoS3Key,
          isOnline: false,
          lastActiveTime: new Date(),
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

      const updatedExistingConvoMatch = (
        await this.updateLastMessageTimeForConvo(existingConvoMatch.id)
      ).toObject<LeanDocument<ConversationDocument>>();

      return updatedExistingConvoMatch;
    } else {
      const createdConvo = new this.conversationModel({
        ...restOfParams,
        connectedUsers: userIdArray,
        historicalUsers: userIdArray,
        adminUsers: [creator],
      });
      const savedConvo = (await createdConvo.save()).toObject<
        LeanDocument<ConversationDocument>
      >();

      return savedConvo;
    }
  }

  async removeConversationForUser(
    removeConversationForUserDto: RemoveConversationForUserDto
  ) {
    const { userId, conversationId } = removeConversationForUserDto;

    const user = await this.userModel.findOne({ userId });

    if (!user) {
      this.logger.log('User not found');

      return null;
    }

    const conversation = await this.conversationModel
      .findById(conversationId)
      .exec();

    if (
      !conversation ||
      !conversation?.connectedUsers
        .map((connectedUserId) => connectedUserId.toString())
        .includes(userId)
    ) {
      this.logger.log(
        'Conversation not found or user not found in conversation'
      );

      return null;
    }

    const newConversationUsers = conversation.connectedUsers.filter(
      (connectedUserId) => connectedUserId.toString() !== userId
    );

    if (
      newConversationUsers.length === 1 &&
      !conversation.adminUsers.includes(
        newConversationUsers[0].userId.toString()
      )
    ) {
      // If only remaining user in conversation is not and admin, make them an admin
      conversation.adminUsers.push(newConversationUsers[0].userId.toString());
    }

    const newConnectedUserNames = conversation.connectedUserNames.filter(
      (connectedUserName) => connectedUserName !== user.name
    );

    conversation.connectedUsers = newConversationUsers;
    conversation.connectedUserNames = newConnectedUserNames;

    this.logger.log(
      'Conversation after removing user and before saving: ',
      conversation
    );

    const updated = (await conversation.save()).toObject<
      LeanDocument<ConversationDocument>
    >();

    this.logger.log(
      'Conversation object after saving and before returning: ',
      updated
    );

    return updated;
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
      const savedUser = (await createdUser.save()).toObject<
        LeanDocument<UserDocument>
      >();

      this.logger.log('Created new messages user: ', savedUser);

      return savedUser;
    }
  }

  async getConversationUsers({ conversationId }) {
    const conversation = await this.conversationModel.findById(conversationId);

    this.logger.log(`conversation with id ${conversationId}: `, conversation);

    if (!conversation) return [];

    const connectedUserIds = conversation.connectedUsers.map((user) =>
      user.toString()
    );

    this.logger.log('connectedUserIds: ', connectedUserIds);

    const connectedMessageUsers = await Promise.all(
      connectedUserIds.map((userId) =>
        this.userModel.findOne({ userId }).exec()
      )
    );

    this.logger.log(
      `Connected users for conversation with id ${conversationId}: `,
      connectedMessageUsers
    );

    if (connectedMessageUsers.length) {
      const connectedMessageUserObjects = connectedMessageUsers.map((user) => {
        const userObj = user.toObject<LeanDocument<UserDocument>>();
        delete userObj.sessionCookie;
        return userObj;
      });

      return connectedMessageUserObjects;
    } else {
      return [];
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
      !conversation?.connectedUsers
        .map((connectedUserId) => connectedUserId.toString())
        .includes(userId)
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
      .update(
        { sessionCookie: {}, isOnline: false, lastActiveTime: new Date() },
        { new: true }
      )
      .exec();

    this.logger.log(`User with ${userId} is now offline`);

    return updatedAuthStatusUser;
  }

  async updateUserStatus(userId: string, isOnline: boolean) {
    const user = await this.userModel.findOneAndUpdate(
      { userId },
      {
        isOnline,
        lastActiveTime: new Date(),
      },
      { new: true }
    );

    this.logger.log(
      `User with id ${userId} is now ${isOnline ? 'online' : 'offline'}: `,
      user
    );

    return user;
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
      convo.toObject<LeanDocument<ConversationDocument>>()
    );

    return conversationsForUserObjects;
  }

  async createMessage(createMessageDto: CreateMessageDto) {
    const createdMessage = new this.messageModel({
      ...createMessageDto,
      status: 'sent',
    });
    const savedMessage = (await createdMessage.save()).toObject<
      LeanDocument<MessageDocument>
    >();

    return savedMessage;
  }

  async removeMessage(removeMessageDto: RemoveMessageDto) {
    const removedMessage = await this.messageModel.findByIdAndUpdate(
      removeMessageDto.messageId,
      { hidden: true, messageHiddenTime: new Date() }
    );

    this.logger.log(
      `Removed message with id ${removeMessageDto.messageId} ${removedMessage} for conversation with id ${removeMessageDto.conversationId}`
    );
  }

  async permanentlyRemoveMessageForUser(
    permanentlyRemoveMessageForUserDto: PermanentlyRemoveMessageForUserDto
  ) {
    const removedMessage = await this.messageModel.findById(
      permanentlyRemoveMessageForUserDto.messageId
    );

    removedMessage.usersMessageIsRemovedFor.push(
      permanentlyRemoveMessageForUserDto.userId
    );

    await removedMessage.save();

    this.logger.log(
      `Permanently removed message with id ${permanentlyRemoveMessageForUserDto.messageId} ${removedMessage} for conversation with id ${permanentlyRemoveMessageForUserDto.conversationId}, for user with id ${permanentlyRemoveMessageForUserDto.userId}`
    );
  }

  async updateMessageStatus(updateMessageStatusDto: UpdateMessageStatusDto) {
    const { messageId, status } = updateMessageStatusDto;

    const updatedMessage = await this.messageModel.findByIdAndUpdate(
      messageId,
      { status },
      { new: true }
    );

    this.logger.log(`Updated message with id ${messageId}: `, updatedMessage);

    return updatedMessage.toObject<LeanDocument<MessageDocument>>();
  }

  async updateUsersForWhomMessageIsLastOneViewed(
    updateUsersMessageLastViewedDto: UpdateUsersMessageLastViewedDto
  ) {
    const { messageId, userId, isMessageOwner } =
      updateUsersMessageLastViewedDto;

    const newMessageToUpdate = await this.messageModel.findById(messageId);

    this.logger.log(
      'newMessageToUpdate within updateUsersForWhomMessageIsLastOneViewed: ',
      newMessageToUpdate
    );

    const updateResult = await this.messageModel.updateMany(
      {
        'usersForWhomMessageWasLastOneSeen.userId': userId,
        _id: { $ne: messageId },
      },
      {
        $pull: {
          usersForWhomMessageWasLastOneSeen: { userId },
        },
      }
    );

    this.logger.log(
      'Update result for old messages with userId in usersForWhomMessageWasLastOneSeen array: ',
      updateResult
    );

    const usersLastSeenBy =
      newMessageToUpdate.usersForWhomMessageWasLastOneSeen.map(
        (user) => user.userId
      );

    if (usersLastSeenBy.includes(userId)) {
      this.logger.log(
        `newMessageToUpdate already includes userId ${userId} within usersForWhomMessageWasLastOneSeen array`
      );

      return newMessageToUpdate.toObject<LeanDocument<MessageDocument>>();
    }

    let usersWhoViewedMessageLast =
      newMessageToUpdate.usersForWhomMessageWasLastOneSeen;

    usersWhoViewedMessageLast.push({ userId, seenTime: new Date() });
    newMessageToUpdate.usersForWhomMessageWasLastOneSeen =
      usersWhoViewedMessageLast;

    if (!isMessageOwner) {
      newMessageToUpdate.hasBeenViewedByOtherUsers = true;

      // Update hasBeenViewedByOtherUsers prop for any previous
      // messages that had also not yet been seen
      const updatedPreviouslyNotSeenMessages =
        await this.messageModel.updateMany(
          {
            _id: { $lt: messageId },
            hasBeenViewedByOtherUsers: { $ne: true },
          },
          {
            hasBeenViewedByOtherUsers: true,
          }
        );

      this.logger.log(
        'Update result for older messages that had also not yet been seen: ',
        updatedPreviouslyNotSeenMessages
      );
    }

    await newMessageToUpdate.save();

    this.logger.log(
      `Updated message with id ${messageId}: `,
      newMessageToUpdate
    );

    return newMessageToUpdate.toObject<LeanDocument<MessageDocument>>();
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
    beforeMessageId,
    getTotal,
  }: FindMessagesFromConvo) {
    let messagesFromConvo: MessageDocument[];
    let queryLength: number;
    const parsedLimit = parseInt(limit);

    if (parsedLimit) {
      if (Boolean(getTotal)) {
        queryLength = (await this.messageModel.find({ conversationId })).length;
      }

      if (beforeMessageId === 'start') {
        messagesFromConvo = await this.messageModel
          .find(
            {
              conversationId,
            },
            null,
            { sort: { _id: -1 } }
          )
          .limit(parsedLimit);
      } else {
        messagesFromConvo = await this.messageModel
          .find(
            {
              conversationId,
              _id: { $lt: beforeMessageId },
            },
            null,
            { sort: { _id: -1 } }
          )
          .limit(parsedLimit);
      }
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
    const message: LeanDocument<MessageDocument> = (
      await this.messageModel.findById(messageId)
    ).toObject();

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
            isOnline: false,
            lastActiveTime: new Date(),
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
