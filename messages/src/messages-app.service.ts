import { Injectable } from '@nestjs/common';

@Injectable()
export class MessagesAppService {
  getHello(): string {
    return 'Hello World!';
  }
}
