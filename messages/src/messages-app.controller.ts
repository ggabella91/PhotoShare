import {
  Controller,
  Logger,
  Get,
  Post,
  Put,
  Request,
  Param,
  Query,
  Patch,
} from '@nestjs/common';
import { MessagesAppService } from './messages-app.service';

@Controller('/api/messages')
export class MessagesAppController {
  private logger: Logger = new Logger('Messages App Controller');

  constructor(private readonly appService: MessagesAppService) {}

  @Get('/hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/users')
  findOrCreateUser(@Request() req) {
    const { headers, body } = req;
    const { userId, name, username, photoS3Key } = body;
    const { cookie } = headers;

    const sessionCookie = JSON.parse(
      Buffer.from(
        cookie.substring(cookie.indexOf('express:sess=') + 13),
        'base64'
      ).toString()
    );

    return this.appService.findOrCreateUser({
      userId,
      name,
      username,
      sessionCookie,
      photoS3Key,
    });
  }

  @Put('/users')
  updateUserAuthStatus(@Request() req) {
    const { userId } = req;

    return this.appService.removeUserSessionCookie(userId);
  }

  @Get('/conversation/:conversationId')
  findMessagesFromConvo(
    @Param('conversationId') conversationId: string,
    @Query('limit') limit: number,
    @Query('offset') offset: number
  ) {
    return this.appService.findMessagesFromConvo({
      conversationId,
      limit,
      offset,
    });
  }

  // TODO: Finish this route handler
  // @Patch('/conversation/:conversationId')
  // updateConversation() {}
}
