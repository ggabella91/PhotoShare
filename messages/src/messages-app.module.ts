import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { MessagesAppController } from './messages-app.controller';
import { MessagesAppService } from './messages-app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesAppChatGateway } from './messages-app-chat.gateway';
import { requireAuth } from '@ggabella-photo-share/common';
import { NatsWrapper } from './nats-wrapper';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    ClientsModule.register([{ name: 'NatsWrapper', customClass: NatsWrapper }]),
  ],
  controllers: [MessagesAppController],
  providers: [MessagesAppService, MessagesAppChatGateway],
})
export class MessagesAppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(requireAuth).forRoutes(MessagesAppChatGateway);
  }
}
