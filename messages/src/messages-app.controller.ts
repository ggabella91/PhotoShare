import {
  Controller,
  Logger,
  Get,
  Post,
  Put,
  Request,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import { MessagesAppService } from './messages-app.service';
import { UpdateConvoPreDto } from './database/dto/update-convo-dto';

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
    @Query('limit') limit: string,
    @Query('offset') offset: string
  ) {
    return this.appService.findMessagesFromConvo({
      conversationId,
      limit,
      offset,
    });
  }

  @Put('/conversation')
  updateConversation(@Body() updateConvoPreDto: UpdateConvoPreDto) {
    return this.appService.updateConversation(updateConvoPreDto);
  }
}
