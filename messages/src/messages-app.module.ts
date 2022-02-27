import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MessagesAppController } from './messages-app.controller';
import { MessagesAppService } from './messages-app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesAppChatGateway } from './messages-app-chat.gateway';
import { WsAuthGuard } from './guards/ws-auth.guard';
import { requireAuth } from '@ggabella-photo-share/common';

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGO_URI)],
  controllers: [MessagesAppController],
  providers: [MessagesAppService, MessagesAppChatGateway],
})
export class MessagesAppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(requireAuth).forRoutes(MessagesAppChatGateway);
  }
}
