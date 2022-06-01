import { MessageUser } from '../../redux/message/message.types';
import { User } from '../../redux/user/user.types';

export const generateDefaultConvoName = (
  usersArray: Partial<MessageUser>[]
) => {
  if (usersArray.length === 1) {
    return usersArray[0].name;
  } else {
    return usersArray.reduce((acc, cur, idx) => {
      if (idx === 0) {
        acc += `${cur.name}`;
      } else if (idx === usersArray.length - 1) {
        acc += ` and ${cur.name}`;
      } else {
        acc += `, ${cur.name}`;
      }

      return acc;
    }, '');
  }
};

export const generateFinalConvoUsersArray = (
  usersArray: Partial<MessageUser>[],
  currentUser: User
) => {
  const currentUserFound = usersArray.find(
    (user) => user.id === currentUser.id
  );

  if (currentUserFound) {
    return usersArray;
  } else {
    usersArray.push({
      userId: currentUser.id,
      name: currentUser.name,
      username: currentUser.username,
    });
    return usersArray;
  }
};
