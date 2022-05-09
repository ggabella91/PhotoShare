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
      convoMessages.conversationId === convoMessagesToAdd.conversationId
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
    if (convoMessages.conversationId === message.conversationId) {
      return {
        conversationId: convoMessages.conversationId,
        messages: [...convoMessages.messages, message],
      };
    } else {
      return convoMessages;
    }
  });
};
