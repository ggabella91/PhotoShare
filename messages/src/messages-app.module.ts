import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MessagesAppController } from './messages-app.controller';
import { MessagesAppService } from './messages-app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesAppChatGateway } from './messages-app-chat.gateway';
import { WsAuthGuard } from './guards/ws-auth.guard';
import { requireAuth } from '@ggabella-photo-share/common';
import { NatsStreamingTransport } from '@nestjs-plugins/nestjs-nats-streaming-transport';
import { NatsWrapper } from './nats-wrapper';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    // NatsStreamingTransport.register({
    //   clientId: process.env.NATS_CLIENT_ID,
    //   clusterId: process.env.NATS_CLUSTER_ID,
    //   connectOptions: {
    //     url: process.env.NATS_URL,
    //   },
    // }),
  ],
  controllers: [MessagesAppController],
  providers: [
    MessagesAppService,
    MessagesAppChatGateway,
    WsAuthGuard,
    {
      provide: NatsWrapper,
      useValue: () => {
        const natsWrapper = new NatsWrapper();

        natsWrapper.connect(
          process.env.NATS_CLUSTER_ID,
          process.env.NATS_CLIENT_ID,
          process.env.NATS_URL
        );

        natsWrapper.client.on('close', () => {
          console.log('NATS connection closed!');
          process.exit();
        });

        return natsWrapper;
      },
    },
  ],
})
export class MessagesAppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(requireAuth).forRoutes(MessagesAppChatGateway);
  }
}
