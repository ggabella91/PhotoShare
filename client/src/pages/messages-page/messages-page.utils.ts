import { Conversation, MessageUser } from '../../redux/message/message.types';
import { User } from '../../redux/user/user.types';

export const generateDefaultConvoName = (
  userNamesArray: string[],
  currentUser: User
) => {
  userNamesArray = userNamesArray.filter(
    (userName) => userName !== currentUser.name
  );

  if (userNamesArray.length === 1) {
    return userNamesArray[0];
  } else {
    return userNamesArray.reduce((acc, cur, idx) => {
      if (idx === 0) {
        acc += `${cur}`;
      } else if (idx === userNamesArray.length - 1) {
        acc += ` and ${cur}`;
      } else {
        acc += `, ${cur}`;
      }

      return acc;
    }, '');
  }
};

export const getConvoName = (convo: Conversation, currentUser: User | null) => {
  if (currentUser) {
    return convo.name === 'default'
      ? generateDefaultConvoName(convo.connectedUserNames, currentUser)
      : convo.name;
  }

  return '';
};

export const generateFinalConvoUsersArrayAndGetAvatarS3Key = (
  usersArray: Partial<MessageUser>[],
  currentUser: User
) => {
  const currentUserFound = usersArray.find(
    (user) => user.userId === currentUser.id
  );
  let avatarS3Keys: string[];
  let sortedUsersArray: Partial<MessageUser>[];
  let convoUserNames: string[] = [];

  if (currentUserFound) {
    avatarS3Keys = usersArray.map((user) => {
      convoUserNames.push(user.name!);
      return user.photoS3Key || '';
    });

    sortedUsersArray = usersArray.sort((a, b) => compare(a, b));

    return { usersArray: sortedUsersArray, avatarS3Keys, convoUserNames };
  } else {
    usersArray.push({
      userId: currentUser.id,
      name: currentUser.name,
      username: currentUser.username,
    });

    avatarS3Keys = usersArray.map((user) => {
      convoUserNames.push(user.name!);
      return user.photoS3Key || '';
    });
    sortedUsersArray = usersArray.sort((a, b) => compare(a, b));

    return { usersArray: sortedUsersArray, avatarS3Keys, convoUserNames };
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
