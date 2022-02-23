import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MessagesAppController } from './messages-app.controller';
import { MessagesAppService } from './messages-app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesAppChatGateway } from './messages-app-chat.gateway';
import { WsAuthGuard } from './guards/ws-auth.guard';
import { requireAuth } from '@ggabella-photo-share/common';
import { NatsStreamingTransport } from '@nestjs-plugins/nestjs-nats-streaming-transport';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }),
    NatsStreamingTransport.register({
      clientId: process.env.NATS_CLIENT_ID,
      clusterId: process.env.NATS_CLUSTER_ID,
      connectOptions: {
        url: process.env.NATS_URL,
      },
    }),
  ],
  controllers: [MessagesAppController],
  providers: [MessagesAppService, MessagesAppChatGateway, WsAuthGuard],
})
export class MessagesAppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(requireAuth).forRoutes(MessagesAppChatGateway);
  }
}
