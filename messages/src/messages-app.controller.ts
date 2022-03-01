import { Controller, Get } from '@nestjs/common';
import { MessagesAppService } from './messages-app.service';

@Controller('/api/messages/words')
export class MessagesAppController {
  constructor(private readonly appService: MessagesAppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
