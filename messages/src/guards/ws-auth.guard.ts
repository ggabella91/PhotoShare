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
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../database/schemas/user.schema';

@Injectable()
export class WsAuthGuard implements CanActivate {
  private logger: Logger = new Logger('WebSocket Auth Guard');

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const wsContext = context.switchToWs();
    const client: Socket = wsContext.getClient<Socket>();
    const userId = client.handshake.query.userId;

    this.logger.log('User id: ', userId);
    this.logger.log('Ws Context data: ', wsContext.getData());

    if (!userId) {
      throw new WsException('No userId found in handshake query');
    } else {
      const user = (await this.userModel.findOne({ userId })).toObject();
      const sessionCookie = user.sessionCookie;
      const sessionJwt = sessionCookie.jwt;

      const userPayload = jwt.verify(sessionJwt, process.env.JWT_KEY);

      if (userPayload) {
        this.logger.log('User is authenticated: ', userPayload);

        return true;
      } else {
        throw new WsException('User is not authenticated');
      }
    }
  }
}
