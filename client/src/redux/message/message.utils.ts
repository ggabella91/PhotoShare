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
