import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Observable } from 'rxjs';
import jwt from 'jsonwebtoken';

@Injectable()
export class WsAuthGuard implements CanActivate {
  private logger: Logger = new Logger('WebSocket Auth Guard');

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const wsContext = context.switchToWs();
    this.logger.log('Ws Context data: ', wsContext.getData());

    if (!context) {
      // throw new WsException('Not authenticated');
      this.logger.log('No context found');
    }

    return true;
  }
}
