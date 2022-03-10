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
import mongoose, { Document, Types } from 'mongoose';
import { CreateConvoDto } from './database/dto/create-convo.dto';

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

  @SubscribeMessage('createConversation')
  async handleCreateConversation(
    client: Socket,
    createConvoDto: CreateConvoDto
  ) {
    const createdConvo = await this.appService.createConversation(
      createConvoDto
    );

    this.logger.log('Created conversation: ', createdConvo);

    this.handleJoinConversation(client, createdConvo._id);
  }

  @SubscribeMessage('joinConversation')
  handleJoinConversation(
    client: Socket,
    conversationId: string | Types.ObjectId
  ) {
    const conversationIdString = conversationId.toString();

    client.join(conversationIdString);
    client.emit(`Joined conversationId ${conversationId}`);
  }
}
