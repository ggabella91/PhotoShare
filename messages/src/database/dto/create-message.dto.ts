export class CreateMessageDto {
  text: string;
  created: Date;
  ownerId: string;
  conversationId: string;
  isReply?: boolean;
  messageReplyingToId?: string;
  messageReplyingToOwnerId?: string;
  messageReplyingToOwnerName?: string;
  usersForWhomMessageWasLastOneSeen: string;
}
