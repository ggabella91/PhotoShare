import { ConvoMessages, Message, Conversation } from './message.types';

export const updateJoinedConversationsArray = (
  currentConvosArray: Conversation[],
  conversationsToAdd: Conversation | Conversation[]
) => {
  if (Array.isArray(conversationsToAdd)) {
    return [...conversationsToAdd, ...currentConvosArray];
  } else {
    return [conversationsToAdd, ...currentConvosArray];
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
