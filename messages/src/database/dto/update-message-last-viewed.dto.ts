export class UpdateUsersMessageLastViewedDto {
  conversationId: string;
  messageId: string;
  usersForWhomMessageWasLastOneSeen: string[];
}
