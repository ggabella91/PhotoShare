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

export const generateFinalConvoUsersArrayAndGetAvatarS3Key = (
  usersArray: Partial<MessageUser>[],
  currentUser: User
) => {
  const currentUserFound = usersArray.find(
    (user) => user.userId === currentUser.id
  );
  let avatarS3Key: string;
  let sortedUsersArray: Partial<MessageUser>[];

  if (currentUserFound) {
    avatarS3Key =
      usersArray.find(
        (user) => user.userId !== currentUser.id && !!user.photoS3Key
      )?.photoS3Key || '';

    sortedUsersArray = usersArray.sort((a, b) => compare(a, b));

    return { usersArray: sortedUsersArray, avatarS3Key };
  } else {
    avatarS3Key =
      usersArray.find((user) => !!user.photoS3Key)?.photoS3Key || '';
    console.log('avatarS3Key: ', avatarS3Key);

    usersArray.push({
      userId: currentUser.id,
      name: currentUser.name,
      username: currentUser.username,
    });

    sortedUsersArray = usersArray.sort((a, b) => compare(a, b));

    return { usersArray: sortedUsersArray, avatarS3Key };
  }
};

const compare = (a: Partial<MessageUser>, b: Partial<MessageUser>) => {
  if (a.userId! < b.userId!) {
    return -1;
  }
  if (a.userId! > b.userId!) {
    return 1;
  }

  return 0;
};
