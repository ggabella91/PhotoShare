export class UpdateUsersMessageLastViewedDto {
  conversationId: string;
  messageId: string;
  removeUserFromLastSeenArray: boolean;
  userId: string;
}
