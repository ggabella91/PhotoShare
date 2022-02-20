import { Module } from '@nestjs/common';
import { MessagesAppController } from './messages-app.controller';
import { MessagesAppService } from './messages-app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesAppGateway } from './messages-app.gateway';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }),
  ],
  controllers: [MessagesAppController],
  providers: [MessagesAppService, MessagesAppGateway],
})
export class MessagesAppModule {}
