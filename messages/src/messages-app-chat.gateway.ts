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
import { CreateConvoPreDto } from './database/dto/create-convo.dto';
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
    client.emit('clientId', client.id);
  }

  @SubscribeMessage('forceDisconnectClient')
  async handleForceDisconnectClient(client: Socket) {
    client.disconnect();
    this.logger.log(`Client force-disconnected: ${client.id}`);
  }

  @SubscribeMessage('chatToServer')
  async handleMessage(
    @MessageBody()
    message: CreateMessageDto
  ) {
    const { conversationId, ...restOfMessage } = message;

    await this.appService.createMessage({ conversationId, ...restOfMessage });

    await this.appService.updateLastMessageTimeForConvo(conversationId);

    this.wss.to(conversationId).emit('chatToClient', restOfMessage);
  }

  @SubscribeMessage('createConversation')
  async handleCreateConversation(
    client: Socket,
    createConvoDto: CreateConvoPreDto
  ) {
    this.logger.log('CreateConvoDto message body: ', createConvoDto);

    const createdConvo = await this.appService.createConversation(
      createConvoDto
    );

    client.join(createdConvo._id.toString());
    client.emit('joinedConversation', createdConvo);
  }

  @SubscribeMessage('joinAllExistingConversations')
  async handleJoinAllExistingConversations(
    client: Socket,
    message: { userId: string }
  ) {
    const existingConversations =
      await this.appService.findAllConversationsForUser(message.userId);

    const existingConvoIds = existingConversations.length
      ? existingConversations.map((convo) => convo._id.toString())
      : null;

    this.logger.log('Conversations found for user: ', existingConversations);

    client.join(existingConvoIds);
    client.emit('joinedConversations', existingConversations);
  }

  @SubscribeMessage('joinConversation')
  handleJoinConversation(
    client: Socket,
    message: { conversationId: string | Types.ObjectId }
  ) {
    const conversationIdString = message.conversationId.toString();

    client.join(conversationIdString);
    client.emit('joinedConversation', message.conversationId);
  }
}
