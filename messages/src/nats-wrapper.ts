import nats, { Stan } from 'node-nats-streaming';
import {
  CustomTransportStrategy,
  Server,
  ClientProxy,
  ReadPacket,
  WritePacket,
} from '@nestjs/microservices';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
class NatsWrapper extends ClientProxy {
  constructor() {
    super();
    this.connect().then(() => console.log('Connected to NATS'));
  }

  private _client?: Stan;

  protected publish(
    packet: ReadPacket<any>,
    callback: (packet: WritePacket<any>) => void
  ): () => void {
    return;
  }
  protected dispatchEvent<T = any>(packet: ReadPacket<any>): Promise<T> {
    return new Promise(() => {});
  }

  logger: Logger = new Logger('Nats Wrapper');

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
