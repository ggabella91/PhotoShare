import { Message, Stan } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  ConversationPhotoUpdatedEvent,
} from '@ggabella-photo-share/common';
import { queueGroupName } from './queue-group-name';
import { Conversation } from '../../database/schemas/conversation.schema';
import { Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { MessagesAppChatGateway } from 'src/messages-app-chat.gateway';

export class ConversationPhotoUpdatedListener extends Listener<ConversationPhotoUpdatedEvent> {
  private logger: Logger = new Logger(
    'Messages ConversationPhotoUpdatedListener'
  );
  private conversationModel: Model<Conversation, {}, {}, {}, any>;
  private chatGateway: MessagesAppChatGateway;

  constructor(
    client: Stan,
    conversationModel: Model<Conversation, {}, {}, {}, any>,
    chatGateway: MessagesAppChatGateway
  ) {
    super(client);
    this.logger.log('Listening for conversation photo update events');
    this.conversationModel = conversationModel;
    this.chatGateway = chatGateway;
  }

  readonly subject = Subjects.ConversationPhotoUpdated;

  queueGroupName = queueGroupName;

  async onMessage(data: ConversationPhotoUpdatedEvent['data'], msg: Message) {
    const { conversationId, s3Key } = data;

    const conversation = await this.conversationModel.findById(conversationId);

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    conversation.avatarS3Keys = [s3Key];
    await conversation.save();

    this.logger.log('Updated conversation: ', conversation);

    this.chatGateway.handleNotifyUpdateFromEventListener(conversation);

    msg.ack();
  }
}
