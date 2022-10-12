export class UpdateMessageStatusDto {
  conversationId: string;
  messageId: string;
  status: 'sent' | 'delivered' | 'error';
}
