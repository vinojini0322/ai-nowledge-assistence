import apiClient from "../../../api/apiClient";

export const getConversationMessages = async (conversationId) => {
  const response = await apiClient.get(
    `/messages/conversation/${conversationId}`,
  );

  return response.data;
};

export const sendChatMessage = async ({ conversationId, message }) => {
  const response = await apiClient.post("/messages", {
    conversationId,
    message,
  });

  return response.data;
};
