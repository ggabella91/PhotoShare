export class CreateMessageDto {
  text: string;
  created: Date;
  ownerId: string;
  conversationId: string;
}
