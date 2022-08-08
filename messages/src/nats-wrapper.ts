import nats, { Stan } from 'node-nats-streaming';
import { ClientProxy, ReadPacket, WritePacket } from '@nestjs/microservices';
import { Injectable, Logger } from '@nestjs/common';
import { ConversationPhotoUpdatedListener } from './events/listeners/conversation-photo-updated-listener';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversation } from './database/schemas/conversation.schema';
import { MessagesAppChatGateway } from './messages-app-chat.gateway';

@Injectable()
class NatsWrapper extends ClientProxy {
  private _client?: Stan;
  logger: Logger;

  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
    private chatGateway: MessagesAppChatGateway
  ) {
    super();
    this.logger = new Logger('Nats Wrapper');

    this.connect();
  }

  protected publish(
    packet: ReadPacket<any>,
    callback: (packet: WritePacket<any>) => void
  ): () => void {
    return;
  }
  protected dispatchEvent<T = any>(packet: ReadPacket<any>): Promise<T> {
    return new Promise(() => {});
  }

  get client() {
    if (!this._client) {
      throw new Error('Cannot access NATS client before connecting');
    }

    return this._client;
  }

  async close() {
    this.client.close();
  }

  async connect() {
    return new Promise(() =>
      this._connect(
        process.env.NATS_CLUSTER_ID,
        process.env.NATS_CLIENT_ID,
        process.env.NATS_URL
      )
    );
  }

  async _connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise((resolve, reject) => {
      this.client.on('connect', () => {
        this.logger.log('Connected to NATS');
        new ConversationPhotoUpdatedListener(
          this.client,
          this.conversationModel,
          this.chatGateway
        ).listen();
        resolve('');
      });

      this.client.on('error', (err) => {
        reject(err);
      });
    });
  }

  log(message: string) {
    this.logger.log(message);
  }
}

export { NatsWrapper };
