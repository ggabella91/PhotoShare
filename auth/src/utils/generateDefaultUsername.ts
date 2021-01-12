import { User } from '../models/user';

export const generateDefaultUsername = async (name: string) => {
  let isUsernameUnique = false;
  let username: string;

  while (!isUsernameUnique) {
    username = name.split(' ').join('') + Math.floor(Math.random() * 1000);

    const existingUserUsername = await User.findOne({ username });

    if (!existingUserUsername) {
      isUsernameUnique = true;
    }
  }

  return username!;
};
