export class UpdateUsersMessageLastViewedDto {
  conversationId: string;
  messageId: string;
  userId: string;
  isMessageOwner?: boolean;
}
