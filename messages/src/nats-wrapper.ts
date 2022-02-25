import nats, { Stan } from 'node-nats-streaming';
import { CustomTransportStrategy, Server } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

class NatsWrapper extends Server implements CustomTransportStrategy {
  private _client?: Stan;

  logger: Logger = new Logger('Nats Wrapper');

  get client() {
    if (!this._client) {
      throw new Error('Cannot access NATS client before connecting');
    }

    return this._client;
  }

  listen() {
    this.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    this.client.on('close', () => {
      this.logger.log('NATS connection closed!');
      process.exit();
    });
  }
  close() {
    this.client.close();
  }

  connect(clusterId: string, clientId: string, url: string) {
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
