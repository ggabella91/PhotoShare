import { ConvoMessages, Message } from './message.types';

export const updateJoinedConversationsArray = (
  currentConvosArray: string[],
  conversationsToAdd: string | string[]
) => {
  if (Array.isArray(conversationsToAdd)) {
    return [...currentConvosArray, ...conversationsToAdd];
  } else {
    return [...currentConvosArray, conversationsToAdd];
  }
};

export const addConvoMessages = (
  currentConvoMessagesArray: ConvoMessages[],
  convoMessagesToAdd: ConvoMessages
) => {
  const areConvoMessagesInArray = currentConvoMessagesArray.find(
    (convoMessages) =>
      convoMessages.converationId === convoMessagesToAdd.converationId
  );

  if (!areConvoMessagesInArray) {
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
    if (convoMessages.converationId === message.conversationId) {
      return {
        converationId: convoMessages.converationId,
        messages: [...convoMessages.messages, message],
      };
    } else {
      return convoMessages;
    }
  });
};
