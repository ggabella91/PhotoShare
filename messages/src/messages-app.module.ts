import { Module, NestModule, MiddlewareConsumer, Type } from '@nestjs/common';
import {
  ClientProxy,
  ClientsModule,
  CustomClientOptions,
} from '@nestjs/microservices';
import { MessagesAppController } from './messages-app.controller';
import { MessagesAppService } from './messages-app.service';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { MessagesAppChatGateway } from './messages-app-chat.gateway';
import { NatsWrapper } from './nats-wrapper';
import {
  Conversation,
  ConversationSchema,
} from './database/schemas/conversation.schema';
import { Message, MessageSchema } from './database/schemas/message.schema';
import { User, UserSchema } from './database/schemas/user.schema';
import { MessagesAppLoggerMiddleware } from './middleware/messages-app-logger.middleware';
import { Model } from 'mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_URI.replace('<PASSWORD>', process.env.MONGO_PASSWORD)
        .replace('<MONGO_CLUSTER_HOST>', process.env.MONGO_CLUSTER_HOST)
        .replace(
          'messages',
          process.env.NODE_ENV === 'development' ? 'messages-dev' : 'messages'
        )
    ),
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
      { name: Message.name, schema: MessageSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [MessagesAppController],
  providers: [
    MessagesAppService,
    MessagesAppChatGateway,
    {
      provide: NatsWrapper,
      inject: [
        getModelToken(Conversation.name),
        getModelToken(User.name),
        MessagesAppChatGateway,
      ],
      useFactory: (
        conversationModel: Model<Conversation>,
        userModel: Model<User>,
        chatGateway: MessagesAppChatGateway
      ) => new NatsWrapper(conversationModel, userModel, chatGateway),
    },
  ],
})
export class MessagesAppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MessagesAppLoggerMiddleware).forRoutes('*');
  }
}
