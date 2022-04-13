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
import { Types } from 'mongoose';
import { CreateConvoDto } from './database/dto/create-convo.dto';
import { CreateMessageDto } from './database/dto/create-message.dto';

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
  async handleMessage(
    @MessageBody()
    message: CreateMessageDto
  ) {
    const { conversationId, ...restOfMessage } = message;

    await this.appService.createMessage({ conversationId, ...restOfMessage });

    this.wss.to(conversationId).emit('chatToClient', restOfMessage);
  }

  @SubscribeMessage('createConversation')
  async handleCreateConversation(
    client: Socket,
    createConvoDto: CreateConvoDto
  ) {
    this.logger.log('CreateConvoDto message body: ', createConvoDto);

    const createdConvo = await this.appService.createConversation(
      createConvoDto
    );

    this.logger.log('Created conversation: ', createdConvo);

    client.join(createdConvo._id);
    client.emit('Joined conversation: ', createdConvo._id);
  }

  @SubscribeMessage('joinAllExistingConversations')
  async handleJoinAllExistingConversations(
    client: Socket,
    message: { userId: string }
  ) {
    const existingConversations =
      await this.appService.findAllConversationsForUser(message.userId);

    const existingConvoIds = existingConversations.length
      ? existingConversations.map((convo) => convo.id.toString())
      : null;

    this.logger.log('Conversations found for user: ', existingConvoIds);

    client.join(existingConvoIds);
    client.emit(
      `Joined conversations with the following ids: ${existingConvoIds}`
    );
  }

  @SubscribeMessage('joinConversation')
  handleJoinConversation(
    client: Socket,
    message: { conversationId: string | Types.ObjectId }
  ) {
    const conversationIdString = message.conversationId.toString();

    client.join(conversationIdString);
    client.emit(`Joined conversation with id: ${message.conversationId}`);
  }
}
