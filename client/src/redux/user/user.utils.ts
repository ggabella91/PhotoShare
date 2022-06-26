import { User } from './user.types';

export const addUserToUsersArray = (usersArray: User[] | null, user: User) => {
  if (usersArray) {
    for (let el of usersArray) {
      if (el.id === user.id) {
        return [...usersArray];
      }
    }

    return [...usersArray, user];
  } else {
    if (user) {
      return [user];
    } else {
      return [];
    }
  }
};
