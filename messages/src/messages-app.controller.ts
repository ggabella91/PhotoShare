import { Controller, Get, Post, Request } from '@nestjs/common';
import { MessagesAppService } from './messages-app.service';

@Controller('/api/messages')
export class MessagesAppController {
  constructor(private readonly appService: MessagesAppService) {}

  @Get('/hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/users')
  findOrCreateUser(@Request() req) {
    const { session: sessionCookie, body } = req;
    const { userId, name } = body;

    return this.appService.findOrCreateUser({ userId, name, sessionCookie });
  }
}
