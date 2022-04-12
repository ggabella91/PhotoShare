export class CreateUserDto {
  userId: string;
  name: string;
  sessionCookie: Record<string, any>;
}
