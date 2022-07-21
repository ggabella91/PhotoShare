import { User } from '../schemas/user.schema';

export class CreateConvoPreDto {
  creator: string;
  name: string;
  connectedUsers: User[];
  avatarS3Keys: string[];
  connectedUserNames: string[];
}

export class CreateConvoDto {
  name: string;
  connectedUsers: string[];
  avatarS3Keys: string[];
  connectedUserNames: string[];
  adminUsers: string[];
}
