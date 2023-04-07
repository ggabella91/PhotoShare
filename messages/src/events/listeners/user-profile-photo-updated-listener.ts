import { Message, Stan } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  ProfilePhotoUpdatedEvent,
} from '@ggabella-photo-share/common';
import { queueGroupName } from './queue-group-name';
import { User } from '../../database/schemas/user.schema';
import { Logger } from '@nestjs/common';
import { Condition, Model } from 'mongoose';
import { MessagesAppChatGateway } from 'src/messages-app-chat.gateway';
import { Conversation } from 'src/database/schemas/conversation.schema';
import { ConversationDocument } from 'src/database/schemas/conversation.schema';

export class ProfilePhotoUpdatedListener extends Listener<ProfilePhotoUpdatedEvent> {
  private logger: Logger = new Logger('Messages ProfilePhotoUpdatedListener');
  private userModel: Model<User, {}, {}, {}, any>;
  private conversationModel: Model<Conversation, {}, {}, {}, any>;
  private chatGateway: MessagesAppChatGateway;

  constructor(
    client: Stan,
    userModel: Model<User, {}, {}, {}, any>,
    conversationModel: Model<Conversation, {}, {}, {}, any>,
    chatGateway: MessagesAppChatGateway
  ) {
    super(client);
    this.logger.log('Listening for user profile photo update events');
    this.userModel = userModel;
    this.conversationModel = conversationModel;
    this.chatGateway = chatGateway;
  }

  readonly subject = Subjects.ProfilePhotoUpdated;

  queueGroupName = queueGroupName;

  async onMessage(data: ProfilePhotoUpdatedEvent['data'], msg: Message) {
    const { userId, s3Key } = data;

    const user = await this.userModel.findOne({ userId });

    if (!user) {
      throw new Error('User not found');
    }

    const oldS3Key = user.photoS3Key;
    user.photoS3Key = s3Key;
    await user.save();

    this.logger.log('Updated user: ', user);

    const conversations = await this.conversationModel
      .find({
        connectedUsers: userId as Condition<User[]>,
      })
      .exec();

    const updatedConvos = conversations.map((convo) => {
      convo.avatarS3Keys = convo.avatarS3Keys.filter(
        (s3Key) => s3Key !== oldS3Key
      );
      convo.avatarS3Keys.push(s3Key);
      return convo.save();
    });

    const savedUpdatedConvoIds: string[] = (
      await Promise.all(updatedConvos)
    ).map((convo) => convo.toObject<ConversationDocument>().id);

    savedUpdatedConvoIds.forEach((convoId) => {
      this.chatGateway.handleUserProfilePhotoUpdated(convoId);
    });
    msg.ack();
  }
}
