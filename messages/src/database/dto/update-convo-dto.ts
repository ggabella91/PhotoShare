export class UpdateConvoDto {
  id: string;
  name?: string;
  avatarS3Keys?: string[];
  connectedUsers?: string[];
  connectedUserNames?: string[];
}
