import {
  ConvoMessages,
  Message,
  Conversation,
  MessageUser,
} from './message.types';

export const updateJoinedConversationsArray = (
  currentConvosArray: Conversation[],
  conversationsToAdd: Conversation | Conversation[]
) => {
  if (Array.isArray(conversationsToAdd)) {
    return [...conversationsToAdd, ...currentConvosArray];
  } else {
    if (!currentConvosArray.some((el) => el._id === conversationsToAdd._id)) {
      return [conversationsToAdd, ...currentConvosArray];
    } else {
      return currentConvosArray;
    }
  }
};

export const addConvoMessages = (
  currentConvoMessagesArray: ConvoMessages[],
  convoMessagesToAdd: ConvoMessages
) => {
  const areConvoMessagesInArray = currentConvoMessagesArray.find(
    (convoMessages) =>
      convoMessages.conversationId === convoMessagesToAdd.conversationId
  );

  if (!areConvoMessagesInArray) {
    convoMessagesToAdd.messages = convoMessagesToAdd.messages.reverse();
    return [...currentConvoMessagesArray, convoMessagesToAdd];
  } else {
    return [...currentConvoMessagesArray];
  }
};

export const addMessage = (
  convoMessagesArray: ConvoMessages[],
  message: Message
) => {
  return convoMessagesArray.map((convoMessages) => {
    if (convoMessages.conversationId === message.conversationId) {
      return {
        conversationId: convoMessages.conversationId,
        messages: [message, ...convoMessages.messages],
      };
    } else {
      return convoMessages;
    }
  });
};

export const removeUserFromArray = (
  usersArray: Partial<MessageUser>[],
  userToRemoveId: string
) => {
  return usersArray.filter((user) => user.id !== userToRemoveId);
};
