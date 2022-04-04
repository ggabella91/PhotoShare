import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Observable } from 'rxjs';
import jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';

@Injectable()
export class WsAuthGuard implements CanActivate {
  private logger: Logger = new Logger('WebSocket Auth Guard');

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const wsContext = context.switchToWs();
    const client: Socket = wsContext.getClient<Socket>();
    this.logger.log('User id: ', client.handshake.query.userId);
    this.logger.log('Ws Context data: ', wsContext.getData());

    if (!context) {
      // throw new WsException('Not authenticated');
      this.logger.log('No context found');
    }

    return true;
  }
}
