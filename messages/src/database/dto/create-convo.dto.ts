import { User } from '../schemas/user.schema';

export class CreateConvoDto {
  name: string;
  connectedUsers: string[];
}

export class CreateConvoPreDto {
  name: string;
  connectedUsers: User[];
}
