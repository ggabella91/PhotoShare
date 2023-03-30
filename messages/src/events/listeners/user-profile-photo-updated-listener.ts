import { Message, Stan } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  ProfilePhotoUpdatedEvent,
} from '@ggabella-photo-share/common';
import { queueGroupName } from './queue-group-name';
import { User } from '../../database/schemas/user.schema';
import { Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { MessagesAppChatGateway } from 'src/messages-app-chat.gateway';

export class ProfilePhotoUpdatedListener extends Listener<ProfilePhotoUpdatedEvent> {
  private logger: Logger = new Logger(
    'Messages ConversationPhotoUpdatedListener'
  );
  private userModel: Model<User, {}, {}, {}, any>;
  private chatGateway: MessagesAppChatGateway;

  constructor(
    client: Stan,
    userModel: Model<User, {}, {}, {}, any>,
    chatGateway: MessagesAppChatGateway
  ) {
    super(client);
    this.logger.log('Listening for conversation photo update events');
    this.userModel = userModel;
    this.chatGateway = chatGateway;
  }

  readonly subject = Subjects.ProfilePhotoUpdated;

  queueGroupName = queueGroupName;

  async onMessage(data: ProfilePhotoUpdatedEvent['data'], msg: Message) {
    const { userId, s3Key } = data;

    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    user.photoS3Key = s3Key;
    await user.save();

    this.logger.log('Updated user: ', user);

    // REVIEW Consider adding event handler for chat gateway to notify a conversation
    // and its users when another user in the conversation updates their profile,
    // photo, and call here as with below example from
    // conversation-photo-updated-listener
    // this.chatGateway.handleNotifyUpdateFromEventListener(conversation);

    msg.ack();
  }
}
