import { User } from '../schemas/user.schema';

export class UpdateConvoPreDto {
  updatingUser: string;
  id: string;
  name?: string;
  avatarS3Keys?: string[];
  conversationImageS3Key?: string;
  connectedUsers?: User[];
  connectedUserNames?: string[];
  adminUsers: string[];
}

export class UpdateConvoDto {
  name?: string;
  avatarS3Keys?: string[];
  conversationImageS3Key?: string;
  connectedUsers?: string[];
  connectedUserNames?: string[];
  adminUsers?: string[];
  historicalUsers?: string[];
}
