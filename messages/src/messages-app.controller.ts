import { Controller, Get } from '@nestjs/common';
import { MessagesAppService } from './messages-app.service';

@Controller()
export class MessagesAppController {
  constructor(private readonly appService: MessagesAppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
