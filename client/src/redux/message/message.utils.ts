import {
  ConvoMessages,
  Message,
  Conversation,
  MessageUser,
} from './message.types';

interface UpdatedConvo {
  conversationId: string;
  messageCreatedTime: string;
}

export const updateJoinedConversationsArray = (
  currentConvosArray: Conversation[],
  conversationsToAdd: Conversation | Conversation[]
) => {
  if (Array.isArray(conversationsToAdd)) {
    return conversationsToAdd;
  } else {
    if (!currentConvosArray.some((el) => el.id === conversationsToAdd.id)) {
      return [conversationsToAdd, ...currentConvosArray];
    } else {
      return currentConvosArray;
    }
  }
};

export const updateAndSortJoinedConversationsArray = (
  currentConvosArray: Conversation[],
  updatedConvo: UpdatedConvo
) => {
  const convoToUpdateIdx = currentConvosArray.findIndex(
    (convo) => convo.id === updatedConvo.conversationId
  );
  const currentConvosArrayCopy = [...currentConvosArray];
  currentConvosArrayCopy[convoToUpdateIdx].lastMessageTime = Date.parse(
    updatedConvo.messageCreatedTime
  );

  return currentConvosArrayCopy.sort(
    (a, b) => b.lastMessageTime - a.lastMessageTime
  );
};

export const addConvoMessages = (
  currentConvoMessagesArray: ConvoMessages[],
  convoMessagesToAdd: ConvoMessages
) => {
  const convoMessagesArrayIdx = currentConvoMessagesArray.findIndex(
    (convoMessages) =>
      convoMessages.conversationId === convoMessagesToAdd.conversationId
  );

  if (convoMessagesArrayIdx < 0) {
    return [...currentConvoMessagesArray, convoMessagesToAdd];
  } else {
    const currentConvoMessagesForIdx =
      currentConvoMessagesArray[convoMessagesArrayIdx];
    const newConvoMessagesForIdx = currentConvoMessagesForIdx.messages.concat(
      ...convoMessagesToAdd.messages
    );

    const currentConvoMessagesArrayCopy = [...currentConvoMessagesArray];
    currentConvoMessagesArrayCopy.splice(convoMessagesArrayIdx, 1, {
      conversationId: currentConvoMessagesForIdx.conversationId,
      messages: newConvoMessagesForIdx,
      queryLength: currentConvoMessagesForIdx.queryLength,
    });

    return [...currentConvoMessagesArrayCopy];
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
        ...(convoMessages.queryLength && {
          queryLength: convoMessages.queryLength,
        }),
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
