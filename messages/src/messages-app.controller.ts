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
    // TODO: Update createUser dto, service method to store session for tracking session status in ws auth guard
    const { session, body } = req;
    const { userId, name } = body;

    return this.appService.findOrCreateUser({ userId, name });
  }
}
