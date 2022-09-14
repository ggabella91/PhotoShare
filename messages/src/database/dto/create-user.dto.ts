export class CreateUserDto {
  userId: string;
  name: string;
  username: string;
  sessionCookie?: Record<string, any>;
  photoS3Key?: string;
  isOnline?: boolean;
  lastActiveTime?: Date;
}
