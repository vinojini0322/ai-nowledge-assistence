export const queryKeys = {
  conversations: ["conversations"],

  conversationMessages: (conversationId) => [
    "conversation-messages",
    conversationId,
  ],
};
