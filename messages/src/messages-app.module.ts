import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { MessagesAppController } from './messages-app.controller';
import { MessagesAppService } from './messages-app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesAppChatGateway } from './messages-app-chat.gateway';
import { NatsWrapper } from './nats-wrapper';
import {
  Conversation,
  ConversationSchema,
} from './database/schemas/conversation.schema';
import { Message, MessageSchema } from './database/schemas/message.schema';
import { User, UserSchema } from './database/schemas/user.schema';
import { MessagesAppLoggerMiddleware } from './middleware/messages-app-logger.middleware';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
      { name: Message.name, schema: MessageSchema },
      { name: User.name, schema: UserSchema },
    ]),
    ClientsModule.register([{ name: 'NatsWrapper', customClass: NatsWrapper }]),
  ],
  controllers: [MessagesAppController],
  providers: [MessagesAppService, MessagesAppChatGateway],
})
export class MessagesAppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MessagesAppLoggerMiddleware).forRoutes('*');
  }
}
