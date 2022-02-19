import { Module } from '@nestjs/common';
import { MessagesAppController } from './messages-app.controller';
import { MessagesAppService } from './messages-app.service';

@Module({
  imports: [],
  controllers: [MessagesAppController],
  providers: [MessagesAppService],
})
export class MessagesAppModule {}
