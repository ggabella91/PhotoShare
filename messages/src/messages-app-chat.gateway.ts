import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { WsAuthGuard } from './guards/ws-auth.guard';
import { MessagesAppService } from './messages-app.service';
import { Types } from 'mongoose';
import { CreateConvoPreDto } from './database/dto/create-convo.dto';
import { CreateMessageDto } from './database/dto/create-message.dto';
import { UpdateConvoPreDto } from './database/dto/update-convo-dto';
import { UpdateUserNicknameForConvoDto } from './database/dto/update-user-nickname-for-convo-dto';
import { ConversationDocument } from './database/schemas/conversation.schema';
import { RemoveMessageDto } from './database/dto/remove-message.dto';
import { FindSingleMessageDto } from './database/dto/find-single-message.dto';
import { PermanentlyRemoveMessageForUserDto } from './database/dto/permanently-remove-message-for-user.dto';

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
    const userId = client.handshake.query.userId;
    // TODO Call app service method to set user isOnline
    // property to false
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    client.emit('clientId', client.id);
    // TODO Call app service method to set user isOnline
    // property to true
  }

  handleNotifyUpdateFromEventListener(conversation: ConversationDocument) {
    this.wss.to(conversation.id).emit('conversationUpdated', conversation);
  }

  @SubscribeMessage('forceDisconnectClient')
  async handleForceDisconnectClient(client: Socket) {
    client.disconnect();
    this.logger.log(`Client force-disconnected: ${client.id}`);
    // TODO Call app service method to set user isOnline
    // property to false
  }

  @SubscribeMessage('chatToServer')
  async handleMessage(
    @MessageBody()
    message: CreateMessageDto
  ) {
    const { conversationId } = message;

    const createdMessage = await this.appService.createMessage(message);

    await this.appService.updateLastMessageTimeForConvo(conversationId);

    this.wss.to(conversationId).emit('chatToClient', createdMessage);
  }

  @SubscribeMessage('findSingleMessage')
  async handleFindSingleMessage(
    client: Socket,
    findSingleMessageDto: FindSingleMessageDto
  ) {
    const message = await this.appService.findSingleMessage(
      findSingleMessageDto
    );

    client.emit('foundSingleMessage', message);
  }

  @SubscribeMessage('removeMessage')
  async handleRemoveMessage(@MessageBody() removeMessageDto: RemoveMessageDto) {
    const { conversationId } = removeMessageDto;

    await this.appService.removeMessage(removeMessageDto);

    this.wss.to(conversationId).emit('messageRemoved', removeMessageDto);
  }

  @SubscribeMessage('permanentlyRemoveMessageForUser')
  async handlePermanentlyRemoveMessageForUser(
    @MessageBody()
    permanentlyRemoveMessageForUserDto: PermanentlyRemoveMessageForUserDto
  ) {
    const { conversationId } = permanentlyRemoveMessageForUserDto;

    await this.appService.permanentlyRemoveMessageForUser(
      permanentlyRemoveMessageForUserDto
    );

    this.wss
      .to(conversationId)
      .emit(
        'messagePermanentlyRemovedForUser',
        permanentlyRemoveMessageForUserDto
      );
  }

  @SubscribeMessage('createConversation')
  async handleCreateConversation(
    client: Socket,
    createConvoDto: CreateConvoPreDto
  ) {
    this.logger.log('createConversation message body: ', createConvoDto);

    const createdConvo = await this.appService.createConversation(
      createConvoDto
    );

    client.join(createdConvo.id.toString());
    client.emit('joinedConversation', createdConvo);
  }

  @SubscribeMessage('updateConversation')
  async handleUpdateConversation(
    client: Socket,
    updateConvoDto: UpdateConvoPreDto
  ) {
    this.logger.log('updateConversation message body: ', updateConvoDto);

    const updatedConvo = await this.appService.updateConversation(
      updateConvoDto
    );

    client.emit('conversationUpdated', updatedConvo);
  }

  @SubscribeMessage('updateUserNicknameForConversation')
  async handleUpdateConvoUserNickname(
    client: Socket,
    updateUserNicknameForConvoDto: UpdateUserNicknameForConvoDto
  ) {
    const updatedConvo = await this.appService.updateUserNicknameForConvo(
      updateUserNicknameForConvoDto
    );

    if (!updatedConvo) {
      throw new WsException(
        'Conversation does not exist or user is not in conversation'
      );
    }

    client.emit('convoUserNicknameUpdated', updatedConvo);
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
