import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class MessagesAppLoggerMiddleware implements NestMiddleware {
  private logger: Logger = new Logger('Logger Middleware');

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log('Request: ', req);
    next();
  }
}
