import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { WsAuthGuard } from './guards/ws-auth.guard';
import { MessagesAppService } from './messages-app.service';

@UseGuards(WsAuthGuard)
@WebSocketGateway({ path: '/api/messages/chat', cors: true })
export class MessagesAppChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly appService: MessagesAppService) {}

  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('Chat Gateway');

  afterInit(server: Server) {
    this.logger.log('Initialized');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('chatToServer')
  handleMessage(
    @MessageBody()
    message: {
      sender: string;
      conversationId: string;
      message: string;
    }
  ) {
    const { conversationId, ...restOfMessage } = message;

    this.wss.to(conversationId).emit('chatToClient', restOfMessage);
  }

  @SubscribeMessage('joinConversation')
  handleJoinRoom(client: Socket, conversationId: string) {
    client.join(conversationId);
    client.emit(`Joined conversationId ${conversationId}`);
  }
}
