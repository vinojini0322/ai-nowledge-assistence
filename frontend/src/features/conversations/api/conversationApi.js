import apiClient from "../../../api/apiClient";

export const getConversations = async () => {
  const response = await apiClient.get("/conversations");
  return response.data;
};

export const createConversation = async (title = "") => {
  const response = await apiClient.post("/conversations", {
    title: title || null,
  });

  return response.data;
};

export const renameConversation = async ({ conversationId, title }) => {
  const response = await apiClient.patch(`/conversations/${conversationId}`, {
    title,
  });

  return response.data;
};

export const deleteConversation = async (conversationId) => {
  await apiClient.delete(`/conversations/${conversationId}`);
};

export const getConversationById = async (conversationId) => {
  const response = await apiClient.get(`/conversations/${conversationId}`);

  return response.data;
};
