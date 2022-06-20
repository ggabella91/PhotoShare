import { User } from '../schemas/user.schema';

export class CreateConvoDto {
  name: string;
  connectedUsers: string[];
  avatarS3Key: string;
}

export class CreateConvoPreDto {
  name: string;
  connectedUsers: User[];
  avatarS3Key: string;
}
