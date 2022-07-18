import { User } from '../schemas/user.schema';

export class UpdateConvoPreDto {
  id: string;
  name?: string;
  avatarS3Keys?: string[];
  connectedUsers?: User[];
  connectedUserNames?: string[];
}

export class UpdateConvoDto {
  name?: string;
  avatarS3Keys?: string[];
  connectedUsers?: string[];
  connectedUserNames?: string[];
}
