import { User } from '../schemas/user.schema';

export class UpdateConvoPreDto {
  updatingUser: User;
  id: string;
  name?: string;
  avatarS3Keys?: string[];
  connectedUsers?: User[];
  connectedUserNames?: string[];
  adminUsers: User[];
}

export class UpdateConvoDto {
  name?: string;
  avatarS3Keys?: string[];
  connectedUsers?: string[];
  connectedUserNames?: string[];
  adminUsers?: string[];
}
